/**
 * Cost Manager
 * Tracks estimated tokens and API costs for the request.
 */
export const calculateCost = (tokenCount) => {
  // Rough estimate: Gemini Pro costs approx $0.000125 per 1k input tokens
  const costPerToken = 0.000000125;
  return {
    estimatedTokens: tokenCount,
    estimatedCostUsd: tokenCount * costPerToken
  };
};
