// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Probability & Multi-Reality Consensus Unit Tests
 */

const assert = require('assert');
const { ProbabilisticTriangulationEngine } = require('../src/core/probability');

console.log("Running: Probability Consensus Unit Tests...");

{
    const engine = new ProbabilisticTriangulationEngine();

    // Reconcile extraction:
    // Admin Scope: 10 floors (contractual ground truth, weight 0.9)
    // Design Scope: 8 floors (visual occlusion in 3D model, weight 0.6)
    // Admin Progress: 4 floors (reported in schedule, weight 0.7)
    // RW Progress: 5 floors (actual photographic reality, weight 0.95)
    const result = engine.reconcile({
        admin_scope: 10,
        design_scope: 8,
        admin_progress: 4,
        rw_progress: 5
    });

    // Expected probable scope: (10*0.9 + 8*0.6) / (0.9 + 0.6) = (9 + 4.8) / 1.5 = 13.8 / 1.5 = 9.20
    assert.strictEqual(result.probable_scope, 9.2);

    // Expected probable progress: (4*0.7 + 5*0.95) / (0.7 + 0.95) = (2.8 + 4.75) / 1.65 = 7.55 / 1.65 ≈ 4.58
    assert.strictEqual(result.probable_progress, 4.58);

    // Expected structural percentage: (4.5757 / 9.2) * 100 ≈ 49.74%
    assert.strictEqual(result.structuralPercentage, 49.74);

    // Variances:
    // scope variance = |10 - 8| = 2.0 (drift flag false since <= 2.0)
    // progress variance = |4 - 5| = 1.0 (drift flag false)
    assert.strictEqual(result.variances.scope, 2.0);
    assert.strictEqual(result.variances.progress, 1.0);
    assert.strictEqual(result.variances.scope_drift_flag, false);
}

// Test Case 2: Extreme Drift Flag
{
    const engine = new ProbabilisticTriangulationEngine({ VARIANCE_THRESHOLD: 1.5 });
    const result = engine.reconcile({
        admin_scope: 28,
        design_scope: 20, // Severe visual occlusion undercounting (delta = 8 > 1.5)
        admin_progress: 10,
        rw_progress: 15
    });

    assert.strictEqual(result.variances.scope_drift_flag, true);
    assert.strictEqual(result.variances.progress_drift_flag, true);
}

console.log("✓ Probability Consensus Unit Tests Passed Successfully.");
