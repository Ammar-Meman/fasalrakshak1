/**
 * Fallback Manager
 * Wraps tool execution with a try-catch to ensure graceful failure.
 */
export const withFallback = async (executionPromise, node) => {
  try {
    return await executionPromise;
  } catch (error) {
    console.error(`[FALLBACK] ${node.intent} failed:`, error.message);
    return {
      type: node.intent === 'Memory' ? 'memory' : 'tool',
      intent: node.intent,
      fallbackUsed: true,
      error: error.message,
      output: null,
      memories: [],
      reflections: []
    };
  }
};
