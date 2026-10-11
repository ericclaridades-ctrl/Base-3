// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Cognitive Ignore Substrate (Priors Engine)
 * Manages universal site noise filtering (cranes, staging, temporary hoists)
 * and local project overrides.
 */

class CognitivePriors {
    constructor(config = {}) {
        this.blacklist = new Set(config.blacklist || [
            "Unidentified Anomaly",
            "construction hoist",
            "tower crane",
            "climbing formwork system"
        ]);
        this.whitelist = new Set(config.whitelist || [
            "perimeter climbing system"
        ]);
    }

    isIgnored(item) {
        if (!item || typeof item !== 'string') return false;
        const normalized = item.trim().toLowerCase();
        for (const white of this.whitelist) {
            if (normalized.includes(white.toLowerCase())) return false;
        }
        for (const black of this.blacklist) {
            if (normalized.includes(black.toLowerCase())) return true;
        }
        return false;
    }

    addBlacklist(item) {
        if (item) {
            this.blacklist.add(item.trim());
            this.whitelist.delete(item.trim());
        }
    }

    addWhitelist(item) {
        if (item) {
            this.whitelist.add(item.trim());
            this.blacklist.delete(item.trim());
        }
    }

    toJSON() {
        return {
            blacklist: Array.from(this.blacklist),
            whitelist: Array.from(this.whitelist)
        };
    }
}

module.exports = { CognitivePriors };
