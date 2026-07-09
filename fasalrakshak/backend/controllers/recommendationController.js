import { executeCascadeFlow } from '../agent/cascade/runtimeManager.js';

/**
 * Controller to handle standalone enterprise recommendations
 */
export const handleRecommendation = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required for intent planning.' });
    }

    const kisanId = req.user ? req.user._id : null;

    // Use mode 'recommend' to return raw JSON instead of LLM text
    const result = await executeCascadeFlow(message, kisanId, conversationId || null, 'recommend');

    if (!result || !result.success) {
      return res.status(500).json({ success: false, message: result?.error || 'Recommendation Engine failed to execute' });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Recommendation Controller Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during recommendation generation' });
  }
};
