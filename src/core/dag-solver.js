// SPDX-License-Identifier: AGPL-3.0-only
/**
 * CMS Triad Engine - Directed Acyclic Graph (DAG) Volume Solver
 * Domain Physics: Topological volume distribution & structural weighting
 */

class DAGSolver {
    /**
     * Distributes a calculated structural percentage across task dependencies.
     * The mathematical state logic and weighting formulas represent intentional domain physics.
     * 
     * @param {number} structuralPercentage - Target percentage (0 - 100)
     * @param {Array<Object>} tasks - Array of task nodes with id, durationDays/val, timeLayer
     * @param {Array<Object>} links - Array of dependency edges { source, target }
     * @returns {Array<Object>} Updated tasks with completed status resolved
     */
    static distributeVolume(structuralPercentage, tasks, links = []) {
        if (!Array.isArray(tasks) || tasks.length === 0) return [];
        let newTasks = JSON.parse(JSON.stringify(tasks));
        const nodeMap = new Map();
        const adjList = new Map();
        const inDegree = new Map();
        let totalWeight = 0;

        newTasks.forEach(t => {
            nodeMap.set(String(t.id), { ...t, completed: false, outDegree: 0 });
            adjList.set(String(t.id), []);
            inDegree.set(String(t.id), 0);
        });

        links.forEach(l => {
            const sid = String(l.s || l.source);
            const tid = String(l.t || l.target);
            if (adjList.has(sid) && inDegree.has(tid)) {
                adjList.get(sid).push(tid);
                inDegree.set(tid, inDegree.get(tid) + 1);
                nodeMap.get(sid).outDegree += 1;
            }
        });

        newTasks.forEach(t => {
            const node = nodeMap.get(String(t.id));
            let dur = t.durationDays || t.val || 1;
            let structuralWeight = Math.max(1, dur + (node.outDegree * 2.5));
            node.weight = structuralWeight;
            totalWeight += structuralWeight;
        });

        const queue = [];
        inDegree.forEach((degree, id) => { if (degree === 0) queue.push(id); });
        
        const targetWeight = totalWeight * (Math.max(0, Math.min(100, structuralPercentage)) / 100);
        let cumulativeWeight = 0;

        while (queue.length > 0 && cumulativeWeight < targetWeight) {
            queue.sort((a, b) => (nodeMap.get(a).timeLayer || 0) - (nodeMap.get(b).timeLayer || 0));
            const currentId = queue.shift();
            const node = nodeMap.get(currentId);
            cumulativeWeight += node.weight;
            node.completed = true;
            if (cumulativeWeight >= targetWeight) break;
            
            (adjList.get(currentId) || []).forEach(neighbor => {
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) === 0) queue.push(neighbor);
            });
        }

        newTasks.forEach(t => { 
            t.completed = nodeMap.get(String(t.id))?.completed || false; 
        });

        return newTasks;
    }
}

module.exports = { DAGSolver };
