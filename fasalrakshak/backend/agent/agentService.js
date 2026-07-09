import { executeCascadeFlow } from './cascade/runtimeManager.js';

/**
 * Central orchestrator for the AI Agent (Refactored for CascadeFlow Phase 3)
 */
export const processAgentRequest = async (message, kisanId, conversationId = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n[AGENT START] Request from user: ${kisanId}`);
    console.log(`[AGENT START] Message: "${message}"`);
  } else {
    console.log(`[AGENT START] Request from ${kisanId}`);
  }

  // Delegate entirely to the new CascadeFlow architecture
  return await executeCascadeFlow(message, kisanId, conversationId);
};
