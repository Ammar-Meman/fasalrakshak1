import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { logAudit } from '../cascade/auditTrail.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Voice Intelligence Tool (Phase 6)
 * Executes predict.py to transcribe audio and detect language.
 */
export const executeVoiceAnalysis = async (kisanId, conversationId, audioPath) => {
  return new Promise((resolve, reject) => {
    try {
      if (!audioPath) {
         resolve({ success: false, error: 'No audio provided' });
         return;
      }
      
      const predictScript = path.join(__dirname, '..', '..', 'ai_models', 'voice', 'predict.py');
      const cmd = `python "${predictScript}" "${audioPath}"`;
      
      exec(cmd, { cwd: path.join(__dirname, '..', '..', 'ai_models', 'voice') }, (error, stdout, stderr) => {
        if (error && !stdout.trim()) {
          console.error('Voice Tool Error:', stderr || error);
          resolve({ success: false, error: 'Voice STT model failed to execute' });
          return;
        }
        
        try {
          const outputLines = stdout.trim().split('\n');
          let parsedOutput = null;
          
          for (let i = outputLines.length - 1; i >= 0; i--) {
              try {
                  parsedOutput = JSON.parse(outputLines[i]);
                  break;
              } catch (e) {}
          }
          
          if (!parsedOutput) {
              resolve({ success: false, error: 'Invalid output from voice model' });
              return;
          }
          
          parsedOutput.success = true;

          // Store in CascadeFlow Audit Trail
          if (kisanId && conversationId) {
            logAudit(kisanId, conversationId, 'voice_tool_execution', {
              inferenceTimeMs: parsedOutput.inference_ms,
              language: parsedOutput.language,
              confidence: parsedOutput.confidence,
              latency: parsedOutput.inference_ms,
              modelUsed: parsedOutput.model_used,
              agentDecision: `Audio transcribed to text: "${parsedOutput.transcript.substring(0, 30)}..."`
            }).catch(e => console.error("Voice tool audit log error:", e));
          }

          resolve(parsedOutput);
        } catch (e) {
          resolve({ success: false, error: 'Failed to process voice model output' });
        }
      });
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  });
};
