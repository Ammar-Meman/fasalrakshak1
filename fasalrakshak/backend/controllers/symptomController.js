import { executeSymptomAnalysis } from '../agent/tools/symptomTool.js';

/**
 * Controller to handle NLP symptom analysis
 */
export const handleSymptomTool = async (req, res) => {
  try {
    const { text, conversationId } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Text description of symptoms is required' });
    }

    const kisanId = req.user ? req.user._id : null;

    // Delegate to the agent's symptom tool to ensure audit/memory logging
    const result = await executeSymptomAnalysis(kisanId, conversationId || null, text);

    if (!result || !result.success) {
      return res.status(500).json({ success: false, message: result?.error || 'Symptom model failed to execute' });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Symptom Tool Controller Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during symptom analysis' });
  }
};
