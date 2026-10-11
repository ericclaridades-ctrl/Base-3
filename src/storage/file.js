// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - File-Backed Ledger Storage
 */

const fs = require('fs').promises;
const path = require('path');
const { LedgerStorage } = require('./base');

class FileLedgerStorage extends LedgerStorage {
    constructor(filePath) {
        super();
        this.filePath = path.resolve(filePath);
        this.staging = new Map();
    }

    async load() {
        try {
            const raw = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(raw);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return { tasks: [], links: [] };
            }
            throw err;
        }
    }

    async save(data) {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
        return data;
    }

    async stage(stagingId, data) {
        this.staging.set(stagingId, data);
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
        await this.save(staged);
        this.staging.delete(stagingId);
        return staged;
    }
}

module.exports = { FileLedgerStorage };
