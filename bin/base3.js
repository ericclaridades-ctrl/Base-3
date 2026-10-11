#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Base-3 Triad Engine - Headless CLI
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
    DAGSolver,
    CsvScheduleParser,
    JsonScheduleParser,
    buildHierarchicalTopology,
    Base3Engine,
    GeminiVisionProvider,
    MockVisionProvider,
    MemoryLedgerStorage
} = require('../src/index');

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
    console.log(`
@base3/core - Epistemic Physical Arbitration Engine CLI (AGPL-3.0-only)
Usage: base3 <command> [options]

Commands:
  inspect <schedule-file>                  Parses schedule and prints structural strata & task count
  distribute <percentage> <schedule-file>  Executes deterministic DAG volume bleeder (offline)
  synthesize [options]                     Executes Two-Stage Base-3 Epistemic Arbitration

Options for synthesize:
  --schedule <path>       Path to schedule (.csv or .json)
  --design <path>         Path to Design baseline image [D]
  --reality <path>        Path to Real-World physical update image [RW]
  --scale <value>         Calibrated scale data (e.g. "L1 = 3.2m")
  --constitution <path>   Optional path to custom Constitution Vector JSON
  --mock                  Run with MockVisionProvider (zero network cost)
  --output <path>         Optional file to write JSON result

General Options:
  --version, -v           Display engine version and AGPLv3 legal notice
  --help, -h              Display this help message
`);
}

function parseNamedArgs(argsList) {
    const named = {};
    for (let i = 0; i < argsList.length; i++) {
        if (argsList[i].startsWith('--')) {
            const key = argsList[i].replace(/^--/, '');
            const next = argsList[i + 1];
            if (next && !next.startsWith('--')) {
                named[key] = next;
                i++;
            } else {
                named[key] = true;
            }
        }
    }
    return named;
}

async function loadScheduleFromPath(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.csv') {
        return CsvScheduleParser.parseFile(filePath);
    }
    return JsonScheduleParser.parseFile(filePath);
}

async function main() {
    if (!command || command === '--help' || command === '-h') {
        printHelp();
        process.exit(0);
    }

    if (command === '--version' || command === '-v') {
        const pkg = require('../package.json');
        console.log(`Base-3 Triad Engine (${pkg.name}) v${pkg.version}`);
        console.log(`License: ${pkg.license} (GNU Affero General Public License v3)`);
        console.log(`Notice: Remote network users have the right to receive the Corresponding Source.`);
        process.exit(0);
    }

    if (command === 'inspect') {
        const file = args[1];
        if (!file) {
            console.error("Error: Missing schedule file path. Usage: base3 inspect <path>");
            process.exit(1);
        }
        const schedule = await loadScheduleFromPath(file);
        console.log(`\n================ SCHEDULE INSPECTION ================`);
        console.log(`Total Tasks: ${schedule.tasks.length}`);
        console.log(`Total Links: ${schedule.links.length}`);
        console.log(`\n${buildHierarchicalTopology(schedule.tasks)}`);
        process.exit(0);
    }

    if (command === 'distribute') {
        const pct = parseFloat(args[1]);
        const file = args[2];
        if (isNaN(pct) || !file) {
            console.error("Error: Invalid arguments. Usage: base3 distribute <percentage> <schedule-file>");
            process.exit(1);
        }
        const schedule = await loadScheduleFromPath(file);
        console.log(`\nDistributing ${pct}% structural volume across ${schedule.tasks.length} tasks...`);
        const updated = DAGSolver.distributeVolume(pct, schedule.tasks, schedule.links);
        const completedCount = updated.filter(t => t.completed).length;
        console.log(`Completed Tasks: ${completedCount} / ${updated.length} (${((completedCount / updated.length) * 100).toFixed(1)}%)`);
        process.exit(0);
    }

    if (command === 'synthesize') {
        const options = parseNamedArgs(args.slice(1));
        if (!options.schedule) {
            console.error("Error: --schedule is required for synthesize.");
            process.exit(1);
        }

        const schedule = await loadScheduleFromPath(options.schedule);
        const useMock = Boolean(options.mock);

        let customConstitution = null;
        if (options.constitution && fs.existsSync(options.constitution)) {
            customConstitution = JSON.parse(fs.readFileSync(options.constitution, 'utf-8'));
        }

        let provider;
        if (useMock) {
            provider = new MockVisionProvider();
        } else {
            provider = new GeminiVisionProvider({
                apiKey: process.env.GEMINI_API_KEY
            });
        }

        const engine = new Base3Engine({
            provider,
            constitution: customConstitution,
            storage: new MemoryLedgerStorage()
        });

        await engine.loadSchedule(schedule);

        console.log(`\n⚡ Initiating Base-3 Epistemic Arbitration...`);
        const result = await engine.synthesize({
            designFile: options.design,
            realityFiles: options.reality ? [options.reality] : [],
            userScaleData: options.scale || "NONE YET"
        });

        console.log("\n================ ARBITRATION RESULT ================");
        console.log(`Status: ${result.status}`);
        if (result.status === "CALIBRATION_REQUIRED") {
            console.log(`Message: ${result.message}`);
            console.log(`Hypotheses:`);
            result.hypotheses.forEach(h => console.log(`  - [${h.id}] ${h.text} (Confidence: ${h.confidence})`));
            console.log(`\nProvide scale with --scale "<value>" to complete synthesis.`);
        } else if (result.status === "HITL_REQUIRED") {
            console.log(`⚠️ HITL Anomaly Triggered: ${result.item}`);
            console.log(`Reasoning: ${result.reasoning}`);
        } else if (result.status === "COMPLETE") {
            console.log(result.driftReport);
            console.log(`Reasoning: ${result.reasoning}`);
            const completedCount = result.updatedTasks.filter(t => t.completed).length;
            console.log(`Tasks Completed: ${completedCount} / ${result.updatedTasks.length}`);
            console.log(`Staging ID: ${result.stagingId}`);
        }

        if (options.output) {
            fs.writeFileSync(options.output, JSON.stringify(result, null, 2), 'utf-8');
            console.log(`\nOutput written to: ${options.output}`);
        }

        process.exit(0);
    }

    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
}

main().catch(err => {
    console.error(`CLI Execution Error: ${err.message}`);
    process.exit(1);
});
