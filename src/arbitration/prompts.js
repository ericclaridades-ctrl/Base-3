// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Base-3 Triad Engine - Abstract Arbitration Prompt Generators
 * 
 * Implements domain-agnostic physical arbitration governed by a
 * generic Constitution Payload (the Vector).
 */

/**
 * Normalizes a Constitution Vector payload into a standardized schema.
 * @param {Object} input
 * @returns {Object} Standardized Constitution Vector
 */
function normalizeConstitution(input = {}) {
    return {
        domain: input.domain || "Abstract Spatial & Physical Territory",
        entityType: input.entityType || "entity",
        invariants: Array.isArray(input.invariants) ? input.invariants : [
            "Domain-Agnostic Entity Mapping: Treat all inputs as abstract [ENTITIES] with relational dependencies.",
            "Strict Epistemic Triad Evaluation: Cross-examine [Admin] constraints, [D] design models, and [RW] physical observations without ungrounded probabilistic averaging.",
            "Scale Truth-Maintenance: Physical scale anchors and baseline constraints establish absolute feasibility bounds [P_TRUTH]. Visual inference must never contradict physical limits.",
            "Volumetric Invariance: Progress is evaluated as spatial volumetric mass completion against the locked target silhouette.",
            "Commit-Shielding: AI outputs are staged hypotheses; long-term state modifications require explicit authorization."
        ],
        physicalBaselines: input.physicalBaselines || input.dimensions || {},
        ignorePriors: Array.isArray(input.ignorePriors) ? input.ignorePriors : (input.blacklist || []),
        scaleAnchor: input.scaleAnchor || null
    };
}

/**
 * Builds Stage 1 Prompt: Calibration & Baseline Lock
 * Ingests the Constitution Vector to ground spatial scale and lock baseline entity volume.
 */
function buildStage1Prompt({ constitution, userScaleData, adminTopology }) {
    const vector = normalizeConstitution(constitution);
    const scale = userScaleData || vector.scaleAnchor || "NONE YET";
    const baselinesStr = Object.keys(vector.physicalBaselines).length > 0 
        ? JSON.stringify(vector.physicalBaselines, null, 2) 
        : "None provided (derive from optical reference or explicit user scale)";

    const invariantsStr = vector.invariants.map((inv, idx) => `  ${idx + 1}. ${inv}`).join('\n');

    return `
You are the Base-3 Sovereign Epistemic Arbitrator. You execute Stage 1: Baseline Calibration & Entity Lock.

=== CONSTITUTION VECTOR ===
Domain: ${vector.domain}
Target Entity Type: ${vector.entityType}
Constitutional Invariants:
${invariantsStr}

Known Physical / Dimensional Baselines:
${baselinesStr}

Scale Anchor / Calibration Data: ${scale}
Administrative Schedule / Topology:
${adminTopology || "No explicit schedule provided."}
===========================

PHASE 0: PRE-FLIGHT CALIBRATION
1. If Scale Anchor is "NONE YET", inspect the Design Template asset ('D').
2. Cross-reference visible spatial landmarks against the Constitutional Invariants and Known Physical Baselines.
3. Generate 2 to 3 conditional hypotheses linking identifiable features to dimensional units.
4. Set 'calibration_required' to true, populate 'hypotheses', and halt.

PHASE 1: THE BASELINE LOCK
1. If Scale Anchor is provided, apply it to ground the Design asset ('D') against the Administrative Schedule.
2. Calculate the exact 'reconciled_baseline' (total discrete planned [${vector.entityType}] units).
3. Synthesize a 'target_mass_profile': a concise volumetric and geometric silhouette description of the complete target state.

Respond STRICTLY with a valid JSON object matching this schema:
{
    "calibration_required": <boolean>,
    "calibration_message": "<string>",
    "hypotheses": [
        { "id": "H1", "text": "<string>", "confidence": "HIGH|MEDIUM|LOW", "scale_value": "<string>" }
    ],
    "reconciled_baseline": <number>,
    "target_mass_profile": "<string>",
    "blueprint_mass_profile": "<string: alias of target_mass_profile>",
    "stage1_reasoning": "<string>"
}
`.trim();
}

/**
 * Builds Stage 2 Prompt: Volumetric Interpolation & Epistemic Visual Diffing
 * Evaluates physical state against the locked target mass profile according to Constitutional Invariants.
 */
function buildStage2Prompt({ constitution, lockedBaseline, targetMassProfile, blueprintMassProfile, blacklist }) {
    const vector = normalizeConstitution(constitution);
    const massProfile = targetMassProfile || blueprintMassProfile || "Standard volumetric silhouette";
    const effectiveBlacklist = (Array.isArray(blacklist) && blacklist.length > 0)
        ? blacklist
        : vector.ignorePriors;
    const blacklistStr = effectiveBlacklist.length > 0 ? effectiveBlacklist.join(', ') : 'None';
    const invariantsStr = vector.invariants.map((inv, idx) => `  ${idx + 1}. ${inv}`).join('\n');

    return `
You are the Base-3 Sovereign Epistemic Arbitrator. You execute Stage 2: Volumetric Interpolation & Epistemic Diffing.

=== CONSTITUTION VECTOR ===
Domain: ${vector.domain}
Target Entity Type: ${vector.entityType}
Constitutional Invariants:
${invariantsStr}
Ignored Transient Entropy (Blacklist): ${blacklistStr}
===========================

LOCKED BASELINE: ${lockedBaseline} [${vector.entityType}] units
TARGET MASS PROFILE: ${massProfile}

ARBITRATION DIRECTIVES:
1. Volumetric Surveying: Do not brute-force count individual components. Perform an abstract spatial volume estimation.
2. Epistemic Cross-Examination: Compare the Design Template ('D') and the Real-World Physical Observation ('RW').
3. Mass Evaluation: Measure what percentage of the complete target silhouette in 'D' and the TARGET MASS PROFILE is physically verified in 'RW'.
4. Unit Completion: Calculate completed units = (calculated_percentage / 100) * ${lockedBaseline}.
5. Epistemic Drift: Measure variance between expected administrative progression and physically observed mass.
6. Cognitive Priors & Anomaly Detection: Disregard transient noise matching the Ignored Entropy Blacklist. If an unrecognized physical anomaly or high-entropy breach is detected, trigger HITL ('hitl_triggered': true).

Respond STRICTLY with a valid JSON object matching this schema:
{
    "hitl_triggered": <boolean>,
    "hitl_message": "<string>",
    "hitl_item": "<string>",
    "calculated_percentage": <number: 0.0 to 100.0>,
    "completed_units": <number>,
    "completed_floors": <number: backward-compatible alias of completed_units>,
    "epistemic_drift_variance": <number>,
    "stage2_reasoning": "<string: Detailed volumetric and geometric reasoning citing physical evidence>"
}
`.trim();
}

/**
 * Extracts and cleans JSON from raw multimodal model output.
 */
function extractJSON(text) {
    if (!text || typeof text !== 'string') return null;
    const t = text.trim();
    try { return JSON.parse(t); } catch {}
    let cleaned = t.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    try { return JSON.parse(cleaned); } catch {}
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) {
        try { return JSON.parse(m[0]); } catch {}
    }
    return null;
}

module.exports = {
    normalizeConstitution,
    buildStage1Prompt,
    buildStage2Prompt,
    extractJSON
};
