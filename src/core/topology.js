// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Hierarchical Topology Compiler
 * Aggregates task arrays into structural strata (floors/levels/layers) and target milestones.
 */

function buildTopologyGroups(tasks) {
    if (!Array.isArray(tasks) || tasks.length === 0) return {};
    const hierarchy = {};

    tasks.forEach(t => {
        const textToMatch = `${t.name || ''} ${t.wbs || ''}`;
        const match = textToMatch.match(/(level|floor|lvl|flr|l|b)[\s-]*([0-9a-z]+)/i);
        const group = match 
            ? match[0].toUpperCase() 
            : (t.wbs ? t.wbs.split('.')[0] : `LAYER ${Math.floor(t.timeLayer || 0)}`);

        if (!hierarchy[group]) {
            hierarchy[group] = { total: 0, completed: 0, dates: [], tasks: [] };
        }
        hierarchy[group].total++;
        hierarchy[group].tasks.push(t.id);
        if (t.completed) hierarchy[group].completed++;
        if (t.startDate) {
            const time = new Date(t.startDate).getTime();
            if (!isNaN(time)) hierarchy[group].dates.push(time);
        }
    });

    return hierarchy;
}

function buildHierarchicalTopology(tasks) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
        return "Project Topology is empty.";
    }

    const hierarchy = buildTopologyGroups(tasks);
    let topoStr = "PROJECT SCHEDULE (Aggregated by Floors/Levels):\n";

    for (const [group, data] of Object.entries(hierarchy)) {
        const expectedDate = data.dates.length > 0 
            ? new Date(Math.max(...data.dates)).toISOString().split('T')[0] 
            : 'Unknown';
        topoStr += `- [${group}]: ${data.total} tasks. Target Completion Date: ${expectedDate}\n`;
    }

    return topoStr;
}

module.exports = {
    buildTopologyGroups,
    buildHierarchicalTopology
};
