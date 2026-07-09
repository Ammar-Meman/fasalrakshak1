import { executeParallel } from './parallelExecutor.js';

export const coordinateAgents = async (executionPlan, context) => {
    console.log(`[Coordinator Agent] Orchestrating execution: ${executionPlan.executionId}`);
    // Manages the DAG execution
    const results = await executeParallel(executionPlan.graph.nodes, context);
    return results;
};
