// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Base-3 Triad Engine - Physical Baselines & Dimensional Calibration
 * 
 * The core substrate is domain-agnostic and does not hardcode any industry-specific
 * geometry or dimensions. It accepts any dimensional or physical baseline passed
 * via user instantiation.
 */

class PhysicalBaselinesRegistry {
    constructor(initialBaselines = {}) {
        this.baselines = { ...initialBaselines };
    }

    register(name, specification) {
        this.baselines[name] = specification;
    }

    get(name) {
        return this.baselines[name];
    }

    getAll() {
        return { ...this.baselines };
    }
}

module.exports = {
    PhysicalBaselinesRegistry
};
