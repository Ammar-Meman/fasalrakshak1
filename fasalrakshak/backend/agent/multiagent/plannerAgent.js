import { generateTaskGraph } from './taskGraph.js';

export const planExecution = async (message, context) => {
    console.log(`[Planner Agent] Planning execution for: "${message}"`);
    // 1. Analyze complexity
    // 2. Break down into DAG
    const graph = generateTaskGraph(message);
    return {
        executionId: `EXEC_${Date.now()}`,
        graph,
        status: 'Planned'
    };
};
