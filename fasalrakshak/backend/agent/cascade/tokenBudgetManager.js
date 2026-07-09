/**
 * Token Budget Manager
 * Optimizes prompt by trimming unnecessary context to fit within token limits.
 */
export const optimizeContext = (context, memories, toolResults) => {
  // Rough approximation: 1 word ~ 1.3 tokens
  // A real implementation might use an actual tokenizer like tiktoken.
  
  // Here we limit memories to the most recent/relevant ones
  const maxMemories = 5;
  const trimmedMemories = memories ? memories.slice(0, maxMemories) : [];
  
  // Estimate tokens
  const estimatedTokenCount = JSON.stringify({ context, trimmedMemories, toolResults }).length / 4;

  return {
    trimmedMemories,
    estimatedTokenCount
  };
};
