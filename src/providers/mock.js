// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Mock Vision Provider
 * Provides deterministic offline execution for automated tests and CI/CD pipelines.
 */

const { VisionProvider } = require('./base');

class MockVisionProvider extends VisionProvider {
    /**
     * @param {Object} [options]
     * @param {Object|Function} [options.stage1Response]
     * @param {Object|Function} [options.stage2Response]
     */
    constructor(options = {}) {
        super();
        this.stage1Response = options.stage1Response || {
            calibration_required: false,
            calibration_message: "Pre-flight calibration confirmed.",
            hypotheses: [
                { id: "H1", text: "Floor height verified as 3.2m based on standard doorway ratio", confidence: "HIGH", scale_value: "3.2m" }
            ],
            reconciled_baseline: 10,
            blueprint_mass_profile: "10-floor rectangular commercial structure",
            stage1_reasoning: "Schedule and design both anchor on 10 above-ground levels."
        };

        this.stage2Response = options.stage2Response || {
            hitl_triggered: false,
            hitl_message: "",
            hitl_item: "",
            calculated_percentage: 50.0,
            completed_floors: 5,
            epistemic_drift_variance: 0.0,
            stage2_reasoning: "Real-world visual evidence shows concrete superstructure poured through Level 5 (5 of 10 floors = 50.0%)."
        };
    }

    formatFilePart(fileInput) {
        return { mockData: "image-data-mocked" };
    }

    async generateContent(parts) {
        const promptText = parts.find(p => typeof p.text === 'string')?.text || '';

        if (promptText.includes("Stage 1: Blueprint Calibration")) {
            if (typeof this.stage1Response === 'function') {
                return JSON.stringify(this.stage1Response(parts));
            }
            return JSON.stringify(this.stage1Response);
        }

        if (promptText.includes("Stage 2: Volumetric Interpolation")) {
            if (typeof this.stage2Response === 'function') {
                return JSON.stringify(this.stage2Response(parts));
            }
            return JSON.stringify(this.stage2Response);
        }

        return JSON.stringify({ message: "Default mock response" });
    }
}

module.exports = { MockVisionProvider };
