// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Base Ledger Storage Interface
 */

class LedgerStorage {
    async load() {
        throw new Error("load() must be implemented by subclass.");
    }

    async save(data) {
        throw new Error("save() must be implemented by subclass.");
    }

    async stage(stagingId, data) {
        throw new Error("stage() must be implemented by subclass.");
    }

    async getStaged(stagingId) {
        throw new Error("getStaged() must be implemented by subclass.");
    }

    async commit(stagingId) {
        throw new Error("commit() must be implemented by subclass.");
    }
}

module.exports = { LedgerStorage };
