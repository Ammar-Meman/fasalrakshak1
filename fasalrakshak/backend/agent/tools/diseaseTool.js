import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveMemories } from '../memory/memoryWriter.js';
import { logAudit } from '../cascade/auditTrail.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Disease Intelligence Tool (Phase 4)
 * Internally calls the predict.py AI model script.
 */
export const executeDiseaseAnalysis = async (kisanId, conversationId, imageUrl) => {
  return new Promise((resolve, reject) => {
    try {
      // If no image is provided, we use a fallback image or request one.
      // For the hackathon, we assume an image is available in the payload, or we use a sample if null.
      const imagePath = imageUrl || path.join(__dirname, '..', '..', 'ai_service', 'dummy_image.jpg');
      const predictScript = path.join(__dirname, '..', '..', 'ai_models', 'disease', 'predict.py');
      
      const cmd = `python "${predictScript}" "${imagePath}"`;
      
      exec(cmd, { cwd: path.join(__dirname, '..', '..', 'ai_models', 'disease') }, (error, stdout, stderr) => {
        if (error && !stdout.trim()) {
          console.error('Disease Tool Error:', stderr || error);
          resolve({ success: false, error: 'Disease model failed to execute' });
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
              resolve({ success: false, error: 'Invalid output from disease model' });
              return;
          }
          
          parsedOutput.success = true;

          // 1. Store in Hindsight Memory
          if (kisanId) {
            const memoryFacts = [
              { category: 'Disease History', importance: 'High', fact: `Crop: ${parsedOutput.crop}, Disease: ${parsedOutput.disease} (Severity: ${parsedOutput.severity})`, confidence: parsedOutput.confidence / 100 },
              { category: 'Treatment', importance: 'Medium', fact: `Recommended treatment for ${parsedOutput.disease}: ${parsedOutput.treatment}`, confidence: parsedOutput.confidence / 100 }
            ];
            saveMemories(kisanId, memoryFacts).catch(e => console.error("Disease tool memory save error:", e));
          }

          // 2. Store in CascadeFlow Audit Trail
          if (kisanId && conversationId) {
            logAudit(kisanId, conversationId, 'disease_tool_execution', {
              inferenceTimeMs: parsedOutput.inference_ms,
              modelUsed: parsedOutput.model_version,
              confidence: parsedOutput.confidence,
              latency: parsedOutput.inference_ms, // approximate latency
              memorySaved: kisanId ? true : false,
              agentDecision: `Diagnosed ${parsedOutput.disease} with ${parsedOutput.confidence}% confidence`
            }).catch(e => console.error("Disease tool audit log error:", e));
          }

          resolve(parsedOutput);
        } catch (e) {
          resolve({ success: false, error: 'Failed to process disease model output' });
        }
      });
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  });
};
