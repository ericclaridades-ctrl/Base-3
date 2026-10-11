// SPDX-License-Identifier: AGPL-3.0-only
/**
 * @base3/core - Programmatic SDK Usage Example
 * Demonstrates headless execution with a custom Constitution Vector.
 */

const path = require('path');
const {
    Base3Engine,
    CsvScheduleParser,
    MockVisionProvider,
    MemoryLedgerStorage
} = require('../../src/index');

async function run() {
    console.log("=== Base-3 Triad Engine: Programmatic SDK Run ===");

    // 1. Define Domain Constitution Vector
    const constitution = {
        domain: "Commercial Superstructure Engineering",
        entityType: "structural_level",
        invariants: [
            "Level-wise topological sequential pour invariant.",
            "Visual volumetric diffing bounded to verified CAD silhouette."
        ],
        physicalBaselines: {
            "typical_floor_height": "3.5m",
            "column_grid_spacing": "8.0m"
        }
    };

    // 2. Initialize Engine with Mock Provider (offline safe)
    const engine = new Base3Engine({
        provider: new MockVisionProvider(),
        constitution,
        storage: new MemoryLedgerStorage()
    });

    // 3. Ingest Sample CSV Schedule
    const csvPath = path.join(__dirname, '../schedules/commercial_building.csv');
    console.log(`Ingesting schedule from: ${csvPath}`);
    const schedule = await CsvScheduleParser.parseFile(csvPath);
    await engine.loadSchedule(schedule);

    console.log(`Parsed ${schedule.tasks.length} tasks and ${schedule.links.length} dependencies.`);

    // 4. Stage 1: Pre-flight Baseline Calibration
    console.log("\nExecuting Stage 1 Calibration...");
    const calibration = await engine.calibrate({
        designFile: "blueprint_mock.png",
        userScaleData: "L1 = 3.5m"
    });
    console.log(`Locked Baseline: ${calibration.reconciled_baseline} Units`);

    // 5. Stage 2: Volumetric Synthesis & Epistemic Diffing
    console.log("\nExecuting Stage 2 Volumetric Synthesis...");
    const synthesis = await engine.synthesize({
        designFile: "blueprint_mock.png",
        realityFiles: ["site_photo_week4.jpg"],
        userScaleData: "L1 = 3.5m"
    });

    console.log(`\nSynthesis Status: ${synthesis.status}`);
    console.log(`Calculated Percentage: ${synthesis.calculatedPercentage}%`);
    console.log(`Completed Units: ${synthesis.completedUnits} of ${synthesis.reconciledBaseline}`);
    console.log(`Report: ${synthesis.driftReport}`);

    const completed = synthesis.updatedTasks.filter(t => t.completed);
    console.log(`\nTopologically Completed Tasks (${completed.length}/${synthesis.updatedTasks.length}):`);
    completed.forEach(t => console.log(`  ✓ [${t.id}] ${t.name} (${t.dept})`));

    // 6. Commit to Permanent Ledger
    console.log(`\nCommitting staged update ${synthesis.stagingId}...`);
    const committed = await engine.commit(synthesis.stagingId);
    console.log(`Committed successfully. Total ledger tasks: ${committed.tasks.length}`);
}

run().catch(console.error);
