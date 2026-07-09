import { executeForecastAnalysis } from '../agent/tools/forecastTool.js';

/**
 * Controller to handle NLP symptom analysis
 */
export const handleForecastTool = async (req, res) => {
  try {
    const { crop, location, conversationId } = req.body;
    
    if (!crop) {
      return res.status(400).json({ success: false, message: 'Crop type is required for forecasting' });
    }

    const kisanId = req.user ? req.user._id : null;

    // Delegate to the agent's forecast tool to ensure audit/memory logging
    const result = await executeForecastAnalysis(kisanId, conversationId || null, crop, location);

    if (!result || !result.success) {
      return res.status(500).json({ success: false, message: result?.error || 'Forecast model failed to execute' });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Forecast Tool Controller Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during disease forecasting' });
  }
};
