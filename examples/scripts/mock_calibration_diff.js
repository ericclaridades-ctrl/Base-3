// SPDX-License-Identifier: AGPL-3.0-only
/**
 * @base3/core - Interactive Calibration & HITL Anomaly Flow Example
 */

const {
    Base3Engine,
    MockVisionProvider,
    MemoryLedgerStorage
} = require('../../src/index');

async function run() {
    console.log("=== Base-3 Triad Engine: Interactive Calibration & HITL Demonstration ===");

    // Scenario A: Uncalibrated Input (Triggers Calibration Required)
    const uncalibratedProvider = new MockVisionProvider({
        stage1Response: {
            calibration_required: true,
            calibration_message: "Scale anchor is ungrounded. Please confirm physical datum.",
            hypotheses: [
                { id: "H1", text: "Entry corridor matches standard 2.4m width specification", confidence: "HIGH", scale_value: "Corridor: 2.4m" },
                { id: "H2", text: "Structural bay width matches 6.0m grid", confidence: "MEDIUM", scale_value: "Bay: 6.0m" }
            ],
            reconciled_baseline: null
        }
    });

    const engineA = new Base3Engine({ provider: uncalibratedProvider });
    await engineA.loadSchedule({ tasks: [{ id: "1", name: "Test Task", durationDays: 2 }] });

    console.log("\n[Step 1] Synthesizing without prior calibration scale...");
    const resultA = await engineA.synthesize({
        designFile: "blueprint.png",
        userScaleData: "NONE YET"
    });

    console.log(`Status: ${resultA.status}`);
    console.log(`Message: ${resultA.message}`);
    console.log("Generated Hypotheses for User/Operator Review:");
    resultA.hypotheses.forEach(h => console.log(`  -> [${h.id}] ${h.text}`));

    // Scenario B: Calibrated Scale Provided (Synthesis Proceeds to Completion)
    console.log("\n[Step 2] Re-running with selected scale 'Corridor: 2.4m'...");
    const calibratedProvider = new MockVisionProvider();
    const engineB = new Base3Engine({ provider: calibratedProvider });
    await engineB.loadSchedule({ tasks: [{ id: "1", name: "Test Task", durationDays: 2 }] });

    const resultB = await engineB.synthesize({
        designFile: "blueprint.png",
        realityFiles: ["photo.jpg"],
        userScaleData: "Corridor: 2.4m"
    });

    console.log(`Status: ${resultB.status}`);
    console.log(`Structural Completion: ${resultB.calculatedPercentage}%`);
    console.log(`Reconciled Baseline: ${resultB.reconciledBaseline} Units`);
}

run().catch(console.error);
