/**
 * Execution Graph
 * Builds a dependency graph of the required tasks and identifies
 * which tasks can be run in parallel.
 */
export const buildExecutionGraph = (tasks) => {
  // For Phase 3, we simply separate tasks into independent nodes that can be 
  // executed in parallel, as Memory, Weather, Disease, etc., don't depend on each other's outputs.
  
  const parallelTasks = tasks.map(task => ({
    ...task,
    dependsOn: [] // In future phases, you could have dependencies
  }));
  
  return {
    nodes: parallelTasks,
    isParallel: parallelTasks.length > 1
  };
};
