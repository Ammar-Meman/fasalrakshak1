import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { logAudit } from '../cascade/auditTrail.js';
import { saveMemories } from './memoryTool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Disease Forecast Tool (Phase 7)
 * Executes predict.py to calculate disease risk based on crop and location weather.
 */
export const executeForecastAnalysis = async (kisanId, conversationId, crop, location) => {
  return new Promise((resolve, reject) => {
    try {
      const predictScript = path.join(__dirname, '..', '..', 'ai_models', 'forecast', 'predict.py');
      const safeCrop = crop || 'Unknown';
      const safeLocation = location || 'Unknown';
      
      const cmd = `python "${predictScript}" --crop "${safeCrop}" --location "${safeLocation}"`;
      
      exec(cmd, { cwd: path.join(__dirname, '..', '..', 'ai_models', 'forecast') }, async (error, stdout, stderr) => {
        if (error && !stdout.trim()) {
          console.error('Forecast Tool Error:', stderr || error);
          resolve({ success: false, error: 'Forecast model failed to execute' });
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
              resolve({ success: false, error: 'Invalid output from forecast model' });
              return;
          }
          
          parsedOutput.success = true;

          // 1. CascadeFlow Audit Logging
          if (kisanId && conversationId) {
            logAudit(kisanId, conversationId, 'forecast_tool_execution', {
              inferenceTimeMs: parsedOutput.inference_ms,
              risk: parsedOutput.risk,
              disease: parsedOutput.disease,
              confidence: parsedOutput.confidence,
              modelUsed: parsedOutput.model_used,
              agentDecision: `Forecasted ${parsedOutput.risk} risk for ${parsedOutput.disease} on ${parsedOutput.crop}`
            }).catch(e => console.error("Forecast tool audit log error:", e));
          }

          // 2. Hindsight Memory Storage
          if (kisanId) {
            const memoryFacts = [
              {
                entity: 'CropForecast',
                attribute: parsedOutput.crop,
                value: `Disease Risk: ${parsedOutput.risk}, Probability: ${parsedOutput.probability}%, Disease: ${parsedOutput.disease}, Reason: ${parsedOutput.weather_reason}`,
                confidence: parsedOutput.confidence / 100
              }
            ];
            await saveMemories(kisanId, memoryFacts).catch(e => console.error("Failed to save forecast memory:", e));
          }

          resolve(parsedOutput);
        } catch (e) {
          resolve({ success: false, error: 'Failed to process forecast model output' });
        }
      });
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  });
};
