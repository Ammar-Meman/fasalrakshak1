import fs from 'fs';
import { executeDiseaseAnalysis } from '../agent/tools/diseaseTool.js';

/**
 * Controller to handle multipart image upload and execute the disease tool
 */
export const handleDiseaseTool = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const imagePath = req.file.path;
    const kisanId = req.user ? req.user._id : null;
    const conversationId = req.body ? req.body.conversationId : null;

    // Use the central disease tool to ensure memory and audit logs are recorded
    const result = await executeDiseaseAnalysis(kisanId, conversationId, imagePath);

    // Clean up uploaded file
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Failed to delete temp image:", err);
    });

    if (!result || !result.success) {
      return res.status(500).json({ success: false, message: result?.error || 'Disease model failed to execute' });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Disease Tool Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during disease detection' });
  }
};
