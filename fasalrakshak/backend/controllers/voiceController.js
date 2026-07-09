import fs from 'fs';
import { executeVoiceAnalysis } from '../agent/tools/voiceTool.js';
import { processAgentRequest } from '../agent/agentService.js';

/**
 * Controller to handle multipart audio upload, execute STT, and route to CascadeFlow
 */
export const handleVoiceTool = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file uploaded' });
    }

    const audioPath = req.file.path;
    const kisanId = req.user ? req.user._id : null;
    const conversationId = req.body ? req.body.conversationId : null;

    // 1. Run STT (Voice Tool)
    const voiceResult = await executeVoiceAnalysis(kisanId, conversationId, audioPath);

    // Clean up uploaded audio file
    fs.unlink(audioPath, (err) => {
      if (err) console.error("Failed to delete temp audio:", err);
    });

    if (!voiceResult || !voiceResult.success) {
      return res.status(500).json({ success: false, message: voiceResult?.error || 'Voice model failed to execute' });
    }

    // 2. Feed Transcript into CascadeFlow Agent Orchestrator
    let agentResponseText = "Transcription completed, but agent processing failed.";
    
    if (voiceResult.transcript) {
        try {
            const agentResponse = await processAgentRequest(voiceResult.transcript, kisanId, conversationId);
            agentResponseText = agentResponse.response;
        } catch (e) {
            console.error("CascadeFlow failed processing transcript:", e);
        }
    }

    // 3. Return JSON with transcript, language, and the agent's text response
    return res.status(200).json({
      success: true,
      transcript: voiceResult.transcript,
      language: voiceResult.language,
      confidence: voiceResult.confidence,
      agentResponse: agentResponseText
    });

  } catch (error) {
    console.error('Voice Tool Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during voice processing' });
  }
};
