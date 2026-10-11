// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Schedule JSON Normalizer
 * Validates and sanitizes standard JSON schedule inputs.
 */

const fs = require('fs');

class JsonScheduleParser {
    static normalize(data) {
        if (!data || typeof data !== 'object') {
            return { tasks: [], links: [] };
        }

        const rawTasks = Array.isArray(data.tasks) ? data.tasks : [];
        const tasks = rawTasks.map((t, idx) => ({
            id: String(t.id || `T${idx + 1}`),
            name: String(t.name || `Task ${t.id}`),
            val: Number(t.val || t.durationDays || 1),
            durationDays: Number(t.durationDays || t.val || 1),
            timeLayer: Number(t.timeLayer || t.layer || 0),
            wbs: String(t.wbs || ''),
            dept: String(t.dept || 'General'),
            startDate: t.startDate || t.date || '',
            progress: Number(t.progress || 0),
            completed: Boolean(t.completed),
            weight_factor: Number(t.weight_factor || 1)
        }));

        const validIds = new Set(tasks.map(t => t.id));
        const rawLinks = Array.isArray(data.links) ? data.links : [];
        const links = rawLinks.map((l, idx) => ({
            id: String(l.id || `L${idx + 1}`),
            source: String(typeof l.source === 'object' ? l.source.id : (l.source || l.s)),
            target: String(typeof l.target === 'object' ? l.target.id : (l.target || l.t)),
            type: String(l.type || "0")
        })).filter(l => validIds.has(l.source) && validIds.has(l.target));

        return { tasks, links };
    }

    static async parseFile(filePath) {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return this.normalize(JSON.parse(content));
    }
}

module.exports = { JsonScheduleParser };
