// SPDX-License-Identifier: AGPL-3.0-only
/**
 * @base3/core - Master Epistemic Triad Engine SDK
 * 
 * A domain-agnostic physical arbitration & topological coherence engine
 * anchoring Multimodal AI (VLMs) in deterministic real-world domain physics
 * through Base-3 epistemic consensus.
 */

const crypto = require('crypto');
const { DAGSolver } = require('./core/dag-solver');
const { buildTopologyGroups, buildHierarchicalTopology } = require('./core/topology');
const { ProbabilisticTriangulationEngine, DEFAULT_TRIAD_WEIGHTS } = require('./core/probability');
const { CognitivePriors } = require('./core/priors');
const { TriadArbitrator } = require('./arbitration/arbitrator');
const { normalizeConstitution } = require('./arbitration/prompts');
const { PhysicalBaselinesRegistry } = require('./arbitration/dimensions');
const { CsvScheduleParser } = require('./ingestion/csv-parser');
const { JsonScheduleParser } = require('./ingestion/json-parser');
const { VisionProvider } = require('./providers/base');
const { GeminiVisionProvider } = require('./providers/gemini');
const { MockVisionProvider } = require('./providers/mock');
const { LedgerStorage } = require('./storage/base');
const { MemoryLedgerStorage } = require('./storage/memory');
const { FileLedgerStorage } = require('./storage/file');

class Base3Engine {
    /**
     * @param {Object} options
     * @param {VisionProvider} options.provider - Vision model provider
     * @param {Object} [options.constitution] - Generic Constitution Vector (invariants, domain, entityType)
     * @param {Object} [options.dimensions] - Optional physical/dimensional baselines passed at instantiation
     * @param {LedgerStorage} [options.storage] - Storage adapter (default: MemoryLedgerStorage)
     * @param {CognitivePriors} [options.priors] - Priors manager (default: CognitivePriors)
     */
    constructor(options = {}) {
        this.provider = options.provider;
        if (!this.provider) {
            throw new Error("Base3Engine requires an instantiated VisionProvider (e.g. GeminiVisionProvider or MockVisionProvider).");
        }

        this.storage = options.storage || new MemoryLedgerStorage();
        this.priors = options.priors || new CognitivePriors();
        
        const constitutionInput = options.constitution || {};
        if (options.dimensions && !constitutionInput.physicalBaselines) {
            constitutionInput.physicalBaselines = options.dimensions;
        }
        this.constitution = normalizeConstitution(constitutionInput);

        this.arbitrator = new TriadArbitrator({
            provider: this.provider,
            constitution: this.constitution,
            priors: this.priors
        });

        this.probabilityEngine = new ProbabilisticTriangulationEngine();
    }

    /**
     * Loads a schedule into the engine storage.
     * @param {Object} schedule - { tasks: [], links: [] }
     */
    async loadSchedule(schedule) {
        const normalized = JsonScheduleParser.normalize(schedule);
        await this.storage.save(normalized);
        return normalized;
    }

    /**
     * Returns the current schedule from storage.
     */
    async getSchedule() {
        return this.storage.load();
    }

    /**
     * Stage 1: Calibration & Entity Lock.
     */
    async calibrate({ designFile, userScaleData = "NONE YET", constitution = null }) {
        const schedule = await this.storage.load();
        return this.arbitrator.calibrate({
            designFile,
            adminData: schedule,
            userScaleData,
            constitution: constitution || this.constitution
        });
    }

    /**
     * Stage 2: Full Triangulation & Volumetric Synthesis.
     */
    async synthesize({ designFile, realityFiles, userScaleData = "NONE YET", constitution = null }) {
        const schedule = await this.storage.load();

        const result = await this.arbitrator.synthesize({
            designFile,
            realityFiles,
            schedule,
            userScaleData,
            constitution: constitution || this.constitution
        });

        if (result.status === "COMPLETE") {
            const stagingId = crypto.randomUUID();
            const stagedPayload = {
                tasks: result.updatedTasks,
                links: schedule.links || [],
                reconciled_baseline: result.reconciledBaseline,
                calculated_percentage: result.calculatedPercentage,
                completed_units: result.completedUnits,
                drift_report: result.driftReport,
                ai_reasoning: result.reasoning
            };

            await this.storage.stage(stagingId, stagedPayload);
            return {
                ...result,
                stagingId
            };
        }

        return result;
    }

    /**
     * Commits a staged synthesis into permanent ledger storage.
     */
    async commit(stagingId) {
        return this.storage.commit(stagingId);
    }
}

// TriadEngine alias for backward compatibility
const TriadEngine = Base3Engine;

module.exports = {
    // Primary Engine Facade
    Base3Engine,
    TriadEngine,

    // Core Domain Physics & Math
    DAGSolver,
    buildTopologyGroups,
    buildHierarchicalTopology,
    ProbabilisticTriangulationEngine,
    DEFAULT_TRIAD_WEIGHTS,
    CognitivePriors,

    // Arbitration & Constitution
    TriadArbitrator,
    normalizeConstitution,
    PhysicalBaselinesRegistry,

    // Ingestion
    CsvScheduleParser,
    JsonScheduleParser,

    // Providers
    VisionProvider,
    GeminiVisionProvider,
    MockVisionProvider,

    // Storage
    LedgerStorage,
    MemoryLedgerStorage,
    FileLedgerStorage
};
