import { routeTask } from './agentRouter.js';

export const executeParallel = async (nodes, context) => {
    // In a real DAG we'd respect dependencies. For mock simplicity, we execute all.
    console.log(`[Parallel Executor] Spawning ${nodes.length} agents asynchronously...`);
    
    const promises = nodes.map(node => routeTask(node.agent, context));
    const results = await Promise.allSettled(promises);
    
    return results.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean);
};
