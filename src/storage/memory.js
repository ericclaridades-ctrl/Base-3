// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - In-Memory Ledger Storage
 */

const { LedgerStorage } = require('./base');

class MemoryLedgerStorage extends LedgerStorage {
    constructor(initialData = { tasks: [], links: [] }) {
        super();
        this.database = JSON.parse(JSON.stringify(initialData));
        this.staging = new Map();
    }

    async load() {
        return JSON.parse(JSON.stringify(this.database));
    }

    async save(data) {
        this.database = JSON.parse(JSON.stringify(data));
        return this.database;
    }

    async stage(stagingId, data) {
        this.staging.set(stagingId, JSON.parse(JSON.stringify(data)));
        return data;
    }

    async getStaged(stagingId) {
        return this.staging.get(stagingId) || null;
    }

    async commit(stagingId) {
        const staged = this.staging.get(stagingId);
        if (!staged) {
            throw new Error(`No staged payload found for stagingId: ${stagingId}`);
        }
        this.database = JSON.parse(JSON.stringify(staged));
        this.staging.delete(stagingId);
        return this.database;
    }
}

module.exports = { MemoryLedgerStorage };
