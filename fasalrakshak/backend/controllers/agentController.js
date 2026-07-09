import { processAgentRequest } from '../agent/agentService.js';

/**
 * Handles incoming chat requests to the agent.
 */
export const handleAgentChat = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const kisanId = req.user._id;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Pass to agent service orchestrator
    const agentResponse = await processAgentRequest(message, kisanId, conversationId);

    // Ensure we always return a 200 with the standardized response format (even on soft failures)
    res.status(200).json(agentResponse);
  } catch (error) {
    console.error('Agent Chat Error:', error);
    res.status(500).json({ success: false, message: 'Agent encountered an error' });
  }
};
