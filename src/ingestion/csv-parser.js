// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Smart CSV Schedule Ingestion
 * Robust parsing using regex keyword alias matrices for third-party contractor schedules.
 */

const fs = require('fs');

class CsvScheduleParser {
    /**
     * Splits a CSV string into rows handling quotes.
     */
    static parseLine(str) {
        const arr = [];
        let quote = false;
        let col = '';
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (c === '"') {
                quote = !quote;
            } else if (c === ',' && !quote) {
                arr.push(col.trim());
                col = '';
            } else {
                col += c;
            }
        }
        arr.push(col.trim());
        return arr;
    }

    /**
     * Parses a CSV text into standard { tasks: [], links: [] } payload.
     * @param {string} csvText - Raw CSV content
     * @returns {{ tasks: Array<Object>, links: Array<Object> }}
     */
    static parseString(csvText) {
        if (!csvText || typeof csvText !== 'string') {
            return { tasks: [], links: [] };
        }

        const cleanText = csvText.replace(/^\uFEFF/, '');
        const lines = cleanText.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) return { tasks: [], links: [] };

        const payload = { tasks: [], links: [] };
        let linkCounter = 1;

        const rawHeaders = this.parseLine(lines[0]);
        const headers = rawHeaders.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

        function findCol(keywords, fallback) {
            for (const kw of keywords) {
                const cleanKw = kw.toLowerCase().replace(/[^a-z0-9]/g, '');
                const idx = headers.findIndex(h => h === cleanKw);
                if (idx !== -1) return idx;
            }
            for (const kw of keywords) {
                const cleanKw = kw.toLowerCase().replace(/[^a-z0-9]/g, '');
                const idx = headers.findIndex(h => h.includes(cleanKw));
                if (idx !== -1) return idx;
            }
            return fallback;
        }

        const iId = findCol(['id', 'taskid', 'activityid'], 0);
        const iName = findCol(['name', 'activityname', 'taskname', 'description'], 1);
        const iWbs = findCol(['wbs'], 3);
        const iStart = findCol(['startdate', 'start', 'earlystart'], 4);
        const iDur = findCol(['duration', 'originalduration', 'val', 'days'], 6);
        const iPred = findCol(['pred', 'predecessors', 'predecessor', 'logic'], 7);
        const iTrade = findCol(['trade', 'dept', 'department', 'sub', 'contractor', 'resource', 'responsibility'], 8);

        for (let i = 1; i < lines.length; i++) {
            const cols = this.parseLine(lines[i]);
            if (cols.length < 2) continue;

            const id = cols[iId] || `T${i}`;
            const name = cols[iName] || `Task ${id}`;
            const wbs = cols[iWbs] || '';
            const startDate = cols[iStart] || '';
            const duration = parseInt(cols[iDur], 10) || 1;
            const preds = cols[iPred] ? cols[iPred].replace(/"/g, '').split(',') : [];
            const dept = cols[iTrade] || 'General';

            payload.tasks.push({
                id: String(id),
                name: String(name),
                val: duration,
                durationDays: duration,
                wbs: String(wbs),
                dept: String(dept),
                startDate: String(startDate),
                progress: 0,
                completed: false,
                weight_factor: 1
            });

            preds.forEach(p => {
                const pid = p.trim();
                if (pid) {
                    payload.links.push({
                        id: `L${linkCounter++}`,
                        source: String(pid),
                        target: String(id),
                        type: "0"
                    });
                }
            });
        }

        return payload;
    }

    /**
     * Parses a CSV file asynchronously from disk.
     * @param {string} filePath - Absolute or relative path to CSV file
     */
    static async parseFile(filePath) {
        const text = await fs.promises.readFile(filePath, 'utf-8');
        return this.parseString(text);
    }
}

module.exports = { CsvScheduleParser };
