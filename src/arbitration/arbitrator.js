// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Base-3 Triad Engine - Triad Arbitrator
 * 
 * Coordinates the Two-Stage Physical Arbitration cycle:
 * Stage 1: Baseline Calibration & Entity Lock (governed by Constitution Vector)
 * Stage 2: Volumetric Interpolation & Epistemic Visual Diffing
 */

const { buildStage1Prompt, buildStage2Prompt, extractJSON, normalizeConstitution } = require('./prompts');
const { buildHierarchicalTopology } = require('../core/topology');
const { DAGSolver } = require('../core/dag-solver');
const { CognitivePriors } = require('../core/priors');

class TriadArbitrator {
    /**
     * @param {Object} options
     * @param {Object} options.provider - VisionProvider implementation
     * @param {Object} [options.constitution] - Generic Constitution Vector
     * @param {Object} [options.dimensions] - Optional dimensional baselines passed at instantiation
     * @param {CognitivePriors} [options.priors] - Cognitive priors instance
     */
    constructor(options = {}) {
        if (!options.provider) {
            throw new Error("TriadArbitrator requires a valid VisionProvider.");
        }
        this.provider = options.provider;
        this.priors = options.priors || new CognitivePriors();

        const constitutionInput = options.constitution || {};
        if (options.dimensions && !constitutionInput.physicalBaselines) {
            constitutionInput.physicalBaselines = options.dimensions;
        }
        this.constitution = normalizeConstitution(constitutionInput);
    }

    /**
     * Executes Stage 1: Baseline Calibration & Entity Lock.
     */
    async calibrate({ designFile, adminData, userScaleData = "NONE YET", constitution = null }) {
        const activeConstitution = constitution ? normalizeConstitution(constitution) : this.constitution;

        const adminTopology = Array.isArray(adminData?.tasks) 
            ? buildHierarchicalTopology(adminData.tasks) 
            : (typeof adminData === 'string' ? adminData : "None provided.");

        const prompt = buildStage1Prompt({
            constitution: activeConstitution,
            userScaleData,
            adminTopology
        });

        const parts = [{ text: prompt }];
        if (designFile) {
            parts.push(this.provider.formatFilePart(designFile));
        }

        const rawResponse = await this.provider.generateContent(parts);
        const result = extractJSON(rawResponse);
        if (!result || typeof result !== 'object') {
            throw new Error(`Stage 1 calibration response could not be parsed as JSON: ${rawResponse}`);
        }

        return result;
    }

    /**
     * Executes Stage 2: Volumetric Interpolation & Epistemic Diffing.
     */
    async interpolate({ designFile, realityFiles, stage1Result, constitution = null }) {
        if (stage1Result?.reconciled_baseline === undefined || stage1Result?.reconciled_baseline === null) {
            throw new Error("Stage 2 requires a valid reconciled_baseline from Stage 1.");
        }

        const activeConstitution = constitution ? normalizeConstitution(constitution) : this.constitution;

        const prompt = buildStage2Prompt({
            constitution: activeConstitution,
            lockedBaseline: stage1Result.reconciled_baseline,
            targetMassProfile: stage1Result.target_mass_profile || stage1Result.blueprint_mass_profile || "Standard volumetric silhouette",
            blacklist: Array.from(this.priors.blacklist)
        });

        const parts = [{ text: prompt }];
        if (designFile) {
            parts.push(this.provider.formatFilePart(designFile));
        }
        if (Array.isArray(realityFiles)) {
            realityFiles.forEach(rf => parts.push(this.provider.formatFilePart(rf)));
        } else if (realityFiles) {
            parts.push(this.provider.formatFilePart(realityFiles));
        }

        const rawResponse = await this.provider.generateContent(parts);
        const result = extractJSON(rawResponse);
        if (!result || typeof result !== 'object') {
            throw new Error(`Stage 2 interpolation response could not be parsed as JSON: ${rawResponse}`);
        }

        return result;
    }

    /**
     * Complete Full Two-Stage Triangulation Pipeline
     */
    async synthesize({ designFile, realityFiles, schedule, userScaleData = "NONE YET", constitution = null }) {
        const activeConstitution = constitution ? normalizeConstitution(constitution) : this.constitution;

        // Stage 1
        const stage1 = await this.calibrate({
            designFile,
            adminData: schedule,
            userScaleData,
            constitution: activeConstitution
        });

        if (stage1.calibration_required) {
            return {
                status: "CALIBRATION_REQUIRED",
                message: stage1.calibration_message || "Pre-flight calibration required.",
                hypotheses: stage1.hypotheses || [],
                stage: 1
            };
        }

        // Stage 2
        const stage2 = await this.interpolate({
            designFile,
            realityFiles,
            stage1Result: stage1,
            constitution: activeConstitution
        });

        if (stage2.hitl_triggered) {
            return {
                status: "HITL_REQUIRED",
                message: stage2.hitl_message || "Unrecognized physical anomaly detected.",
                item: stage2.hitl_item,
                reasoning: stage2.stage2_reasoning,
                stage: 2
            };
        }

        // Apply Topological Volume Distribution (exact domain physics)
        const tasks = schedule?.tasks || [];
        const links = schedule?.links || [];
        const updatedTasks = DAGSolver.distributeVolume(stage2.calculated_percentage, tasks, links);

        const completedUnits = stage2.completed_units !== undefined ? stage2.completed_units : stage2.completed_floors;
        const driftReport = `Calculated: ${stage2.calculated_percentage?.toFixed(2)}% | Reconciled Baseline: ${stage1.reconciled_baseline} [${activeConstitution.entityType}] | Physical Count: ${completedUnits} Units`;
        const reasoning = `STAGE 1 (Calibration): ${stage1.stage1_reasoning || 'Locked'} | STAGE 2 (Interpolation): ${stage2.stage2_reasoning || 'Complete'}`;

        return {
            status: "COMPLETE",
            stage1,
            stage2,
            calculatedPercentage: stage2.calculated_percentage,
            completedUnits,
            completedFloors: completedUnits, // backward compatibility
            reconciledBaseline: stage1.reconciled_baseline,
            driftReport,
            reasoning,
            updatedTasks
        };
    }
}

module.exports = { TriadArbitrator };
