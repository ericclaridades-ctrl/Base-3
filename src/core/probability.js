// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Probabilistic Triangulation & Multi-Reality Consensus
 * Triangulates D (Design), Admin (Schedule), and RW (Photographic/Field Reality)
 * by applying epistemic trust weights across independent sources.
 */

const DEFAULT_TRIAD_WEIGHTS = {
    W_ADMIN_SCOPE: 0.9,     // Admin JSON is contractual — high trust for total scope
    W_DESIGN_SCOPE: 0.6,    // Design model/render can lag behind change orders — medium trust
    W_ADMIN_PROGRESS: 0.7,  // Schedule progress can lag field reality — medium trust
    W_RW_PROGRESS: 0.95,    // Photographic evidence is strongest indicator of physical reality
    VARIANCE_THRESHOLD: 2.0 // Discrepancy flag threshold: |source_a - source_b| > threshold
};

class ProbabilisticTriangulationEngine {
    constructor(weights = {}) {
        this.weights = { ...DEFAULT_TRIAD_WEIGHTS, ...weights };
    }

    /**
     * Reconciles raw integer scope and progress counts from D, Admin, and RW realities.
     * 
     * @param {Object} extraction
     * @param {number} extraction.admin_scope - Total units in administrative schedule
     * @param {number} extraction.design_scope - Total units visually identified in design baseline
     * @param {number} extraction.admin_progress - Progress reported in schedule
     * @param {number} extraction.rw_progress - Progress physically identified in real-world evidence
     * @returns {Object} Reconciled consensus result
     */
    reconcile(extraction) {
        const cfg = this.weights;

        const adminScope = Number(extraction.admin_scope) || 0;
        const designScope = Number(extraction.design_scope) || adminScope;
        const adminProgress = Number(extraction.admin_progress) || 0;
        const rwProgress = Number(extraction.rw_progress) || 0;

        const scopeDenominator = cfg.W_ADMIN_SCOPE + cfg.W_DESIGN_SCOPE;
        const probableScope = scopeDenominator > 0
            ? (adminScope * cfg.W_ADMIN_SCOPE + designScope * cfg.W_DESIGN_SCOPE) / scopeDenominator
            : adminScope;

        const progressDenominator = cfg.W_ADMIN_PROGRESS + cfg.W_RW_PROGRESS;
        const probableProgress = progressDenominator > 0
            ? (adminProgress * cfg.W_ADMIN_PROGRESS + rwProgress * cfg.W_RW_PROGRESS) / progressDenominator
            : rwProgress;

        const structuralPercentage = probableScope > 0
            ? Math.min(100, Math.max(0, (probableProgress / probableScope) * 100))
            : 0;

        const scopeVariance = Math.abs(adminScope - designScope);
        const progressVariance = Math.abs(adminProgress - rwProgress);

        return {
            probable_scope: Number(probableScope.toFixed(2)),
            probable_progress: Number(probableProgress.toFixed(2)),
            structuralPercentage: Number(structuralPercentage.toFixed(2)),
            variances: {
                scope: Number(scopeVariance.toFixed(2)),
                progress: Number(progressVariance.toFixed(2)),
                scope_drift_flag: scopeVariance > cfg.VARIANCE_THRESHOLD,
                progress_drift_flag: progressVariance > cfg.VARIANCE_THRESHOLD
            },
            raw: {
                admin_scope: adminScope,
                design_scope: designScope,
                admin_progress: adminProgress,
                rw_progress: rwProgress
            }
        };
    }
}

module.exports = {
    DEFAULT_TRIAD_WEIGHTS,
    ProbabilisticTriangulationEngine
};
