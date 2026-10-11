// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - CSV Parser Unit Tests
 */

const assert = require('assert');
const { CsvScheduleParser } = require('../src/ingestion/csv-parser');

console.log("Running: CSV Parser Unit Tests...");

// Test Case 1: Line parsing with quotes and commas
{
    const line = '1.1,"Excavation, Core & Pit",Level 0,2026-03-01,5,"1.0,1.0b",Civil';
    const cols = CsvScheduleParser.parseLine(line);
    assert.strictEqual(cols.length, 7);
    assert.strictEqual(cols[1], 'Excavation, Core & Pit');
    assert.strictEqual(cols[5], '1.0,1.0b');
}

// Test Case 2: Full Schedule Ingestion with Predecessors
{
    const csvContent = `
TaskID,ActivityName,WBS,StartDate,DurationDays,Predecessors,Responsibility
A1,Substructure Pour,Level 1,2026-01-01,10,,Concrete
A2,Superstructure Framing,Level 2,2026-01-11,15,A1,Steel
A3,Curtain Wall,Level 2,2026-01-26,5,"A1,A2",Facade
`.trim();

    const result = CsvScheduleParser.parseString(csvContent);
    assert.strictEqual(result.tasks.length, 3);
    assert.strictEqual(result.links.length, 3); // A1->A2, A1->A3, A2->A3

    assert.strictEqual(result.tasks[0].id, "A1");
    assert.strictEqual(result.tasks[0].durationDays, 10);
    assert.strictEqual(result.tasks[0].dept, "Concrete");

    const a3Predecessors = result.links.filter(l => l.target === "A3").map(l => l.source);
    assert.ok(a3Predecessors.includes("A1"));
    assert.ok(a3Predecessors.includes("A2"));
}

console.log("✓ CSV Parser Unit Tests Passed Successfully.");
