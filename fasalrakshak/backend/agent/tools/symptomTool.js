import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveMemories } from '../memory/memoryWriter.js';
import { logAudit } from '../cascade/auditTrail.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Symptom Intelligence Tool (Phase 5)
 * Internally calls the predict.py NLP AI model script.
 */
export const executeSymptomAnalysis = async (kisanId, conversationId, text) => {
  return new Promise((resolve, reject) => {
    try {
      if (!text || text.trim() === '') {
         resolve({ success: false, error: 'No symptom text provided' });
         return;
      }
      
      const predictScript = path.join(__dirname, '..', '..', 'ai_models', 'symptom', 'predict.py');
      // Escape quotes for command line safety
      const safeText = text.replace(/"/g, '\\"');
      const cmd = `python "${predictScript}" "${safeText}"`;
      
      exec(cmd, { cwd: path.join(__dirname, '..', '..', 'ai_models', 'symptom') }, (error, stdout, stderr) => {
        if (error && !stdout.trim()) {
          console.error('Symptom Tool Error:', stderr || error);
          resolve({ success: false, error: 'Symptom NLP model failed to execute' });
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
              resolve({ success: false, error: 'Invalid output from symptom model' });
              return;
          }
          
          parsedOutput.success = true;

          // 1. Store in Hindsight Memory
          if (kisanId && parsedOutput.possible_diseases && parsedOutput.possible_diseases.length > 0) {
            const topDisease = parsedOutput.possible_diseases[0];
            const memoryFacts = [
              { 
                 category: 'Symptom History', 
                 importance: 'High', 
                 fact: `Reported symptoms: "${text}". Suspected: ${topDisease.name} on ${parsedOutput.crop}. Severity: ${parsedOutput.severity}`, 
                 confidence: topDisease.confidence / 100 
              }
            ];
            saveMemories(kisanId, memoryFacts).catch(e => console.error("Symptom tool memory save error:", e));
          }

          // 2. Store in CascadeFlow Audit Trail
          if (kisanId && conversationId) {
            logAudit(kisanId, conversationId, 'symptom_tool_execution', {
              inferenceTimeMs: parsedOutput.inference_ms,
              modelUsed: parsedOutput.model_used,
              language: parsedOutput.language,
              confidence: parsedOutput.possible_diseases?.[0]?.confidence || 0,
              latency: parsedOutput.inference_ms,
              memorySaved: kisanId ? true : false,
              agentDecision: `Symptom analyzed via NLP. Suspected ${parsedOutput.possible_diseases?.[0]?.name}`
            }).catch(e => console.error("Symptom tool audit log error:", e));
          }

          resolve(parsedOutput);
        } catch (e) {
          resolve({ success: false, error: 'Failed to process symptom model output' });
        }
      });
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  });
};
