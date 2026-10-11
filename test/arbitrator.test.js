// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Base-3 Triad Engine - End-to-End Arbitrator & Lifecycle Unit Tests
 */

const assert = require('assert');
const {
    Base3Engine,
    TriadEngine,
    MockVisionProvider,
    MemoryLedgerStorage
} = require('../src/index');

console.log("Running: Base-3 Arbitrator & Engine Lifecycle Unit Tests...");

// Test Case 1: Pre-Flight Calibration Required
{
    const provider = new MockVisionProvider({
        stage1Response: {
            calibration_required: true,
            calibration_message: "Datum scale is unknown.",
            hypotheses: [
                { id: "H1", text: "Doorway matches 2.1m standard", confidence: "HIGH", scale_value: "2.1m" }
            ],
            reconciled_baseline: null
        }
    });

    const engine = new Base3Engine({ provider });
    await engine.loadSchedule({
        tasks: [
            { id: "T1", name: "Core Wall", durationDays: 5, timeLayer: 1 },
            { id: "T2", name: "Floor Slab", durationDays: 5, timeLayer: 2 }
        ],
        links: [
            { source: "T1", target: "T2" }
        ]
    });

    const result = await engine.synthesize({
        designFile: "blueprint.png",
        userScaleData: "NONE YET"
    });

    assert.strictEqual(result.status, "CALIBRATION_REQUIRED");
    assert.strictEqual(result.hypotheses.length, 1);
    assert.strictEqual(result.hypotheses[0].id, "H1");
}

// Test Case 2: Full Synthesis and Commit Lifecycle
{
    const provider = new MockVisionProvider({
        stage1Response: {
            calibration_required: false,
            reconciled_baseline: 2,
            target_mass_profile: "2-unit structural assembly",
            stage1_reasoning: "Baseline confirmed as 2 units."
        },
        stage2Response: {
            hitl_triggered: false,
            calculated_percentage: 60.0,
            completed_units: 1.2,
            epistemic_drift_variance: 0.0,
            stage2_reasoning: "60% of structural volume visually verified in RW evidence."
        }
    });

    const storage = new MemoryLedgerStorage();
    const engine = new Base3Engine({ provider, storage });

    await engine.loadSchedule({
        tasks: [
            { id: "T1", name: "Module 1 Assembly", durationDays: 3, timeLayer: 1 },
            { id: "T2", name: "Module 2 Assembly", durationDays: 3, timeLayer: 2 }
        ],
        links: [
            { source: "T1", target: "T2" }
        ]
    });

    const result = await engine.synthesize({
        designFile: "blueprint.png",
        realityFiles: ["photo.jpg"],
        userScaleData: "Module = 3.0m"
    });

    assert.strictEqual(result.status, "COMPLETE");
    assert.strictEqual(result.calculatedPercentage, 60.0);
    assert.ok(result.stagingId, "Must return a stagingId");

    // Check DAG distribution: T1 should be completed
    const t1 = result.updatedTasks.find(t => t.id === "T1");
    assert.strictEqual(t1.completed, true);

    // Commit staging
    const committed = await engine.commit(result.stagingId);
    assert.strictEqual(committed.tasks.find(t => t.id === "T1").completed, true);
}

// Test Case 3: Custom Constitution Vector (Aerospace / Civil Domain)
{
    const customConstitution = {
        domain: "Aerospace Structural Subassembly",
        entityType: "fuselage_rib",
        invariants: [
            "Invariance Rule: All fuselage ribs must follow sequential jig alignment."
        ],
        physicalBaselines: {
            "rib_pitch": { dimension: "0.55m", tolerance: "+/- 0.005m" }
        }
    };

    const provider = new MockVisionProvider({
        stage1Response: {
            calibration_required: false,
            reconciled_baseline: 12,
            target_mass_profile: "12-rib fuselage section",
            stage1_reasoning: "Baseline confirmed as 12 fuselage ribs."
        },
        stage2Response: {
            hitl_triggered: false,
            calculated_percentage: 50.0,
            completed_units: 6,
            epistemic_drift_variance: 0.0,
            stage2_reasoning: "6 ribs installed."
        }
    });

    const engine = new Base3Engine({
        provider,
        constitution: customConstitution
    });

    await engine.loadSchedule({
        tasks: [
            { id: "R1", name: "Rib 1 to 6 Alignment", durationDays: 5, timeLayer: 1 },
            { id: "R2", name: "Rib 7 to 12 Alignment", durationDays: 5, timeLayer: 2 }
        ],
        links: [
            { source: "R1", target: "R2" }
        ]
    });

    const result = await engine.synthesize({
        designFile: "cad_render.png",
        realityFiles: ["scanner_feed.jpg"],
        userScaleData: "Pitch = 0.55m"
    });

    assert.strictEqual(result.status, "COMPLETE");
    assert.strictEqual(result.completedUnits, 6);
    assert.strictEqual(result.reconciledBaseline, 12);
}

console.log("✓ Base-3 Arbitrator & Engine Lifecycle Unit Tests Passed Successfully.");
