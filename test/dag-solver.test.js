// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - DAGSolver Unit Tests
 * Verifies domain physics & topological volume distribution mathematics.
 */

const assert = require('assert');
const { DAGSolver } = require('../src/core/dag-solver');

console.log("Running: DAGSolver Unit Tests...");

// Test Case 1: Empty or Invalid Tasks
{
    const res = DAGSolver.distributeVolume(50, []);
    assert.deepStrictEqual(res, [], "Empty tasks should return empty array");
}

// Test Case 2: Linear Chain Progression (T1 -> T2 -> T3)
{
    const tasks = [
        { id: "1", durationDays: 1, timeLayer: 1 },
        { id: "2", durationDays: 1, timeLayer: 2 },
        { id: "3", durationDays: 1, timeLayer: 3 }
    ];
    const links = [
        { source: "1", target: "2" },
        { source: "2", target: "3" }
    ];

    // Weights:
    // T1: dur 1 + (1 outDegree * 2.5) = 3.5
    // T2: dur 1 + (1 outDegree * 2.5) = 3.5
    // T3: dur 1 + (0 outDegree * 2.5) = 1.0
    // Total weight = 8.0

    // At 0%: none complete
    const r0 = DAGSolver.distributeVolume(0, tasks, links);
    assert.strictEqual(r0.filter(t => t.completed).length, 0);

    // At 50%: target weight = 4.0. T1 (weight 3.5) completes, then cumulative=3.5 < 4.0 so T2 (weight 3.5) begins and finishes -> total cumulative 7.0 >= 4.0 -> breaks.
    const r50 = DAGSolver.distributeVolume(50, tasks, links);
    const completedIds50 = r50.filter(t => t.completed).map(t => t.id);
    assert.ok(completedIds50.includes("1"), "T1 must complete at 50%");
    assert.ok(completedIds50.includes("2"), "T2 must complete at 50%");
    assert.ok(!completedIds50.includes("3"), "T3 must NOT complete at 50%");

    // At 100%: all complete
    const r100 = DAGSolver.distributeVolume(100, tasks, links);
    assert.strictEqual(r100.filter(t => t.completed).length, 3, "All tasks must complete at 100%");
}

// Test Case 3: Out-Degree Structural Weight Prioritization
{
    // Node with high fan-out (outDegree = 4) vs linear leaf node
    const tasks = [
        { id: "ROOT", durationDays: 2, timeLayer: 0 },
        { id: "LEAF1", durationDays: 1, timeLayer: 1 },
        { id: "LEAF2", durationDays: 1, timeLayer: 1 },
        { id: "LEAF3", durationDays: 1, timeLayer: 1 },
        { id: "LEAF4", durationDays: 1, timeLayer: 1 }
    ];
    const links = [
        { source: "ROOT", target: "LEAF1" },
        { source: "ROOT", target: "LEAF2" },
        { source: "ROOT", target: "LEAF3" },
        { source: "ROOT", target: "LEAF4" }
    ];

    // ROOT weight = 2 + (4 * 2.5) = 12.0
    // Each LEAF weight = 1.0
    // Total = 16.0
    // 25% target = 4.0. ROOT completes (weight 12 >= 4) and immediately satisfies target.
    const res = DAGSolver.distributeVolume(25, tasks, links);
    assert.strictEqual(res.find(t => t.id === "ROOT").completed, true);
    assert.strictEqual(res.filter(t => t.completed).length, 1);
}

console.log("✓ DAGSolver Unit Tests Passed Successfully.");
