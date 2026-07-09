import { executeDiseaseAnalysis } from './diseaseTool.js';
import { executeSymptomAnalysis } from './symptomTool.js';
import { executeWeatherCheck } from './weatherTool.js';
import { executeForecastAnalysis } from './forecastTool.js';
import { executeSoilAnalysis } from './soilTool.js';
import { executeStoreSearch } from './storeTool.js';
import { executeMemorySearch } from './memoryTool.js';

/**
 * Tool Manager
 * Registers and exposes all available tools to the LLM agent.
 * Dispatches execution based on the detected intent.
 */

export const getAvailableTools = () => {
  return [
    { name: 'diseaseTool', description: 'Analyze crop images for diseases.' },
    { name: 'symptomTool', description: 'Analyze crop disease symptoms via NLP.' },
    { name: 'forecastTool', description: 'Predict future disease risks based on weather.' },
    { name: 'weatherTool', description: 'Get local weather forecasts.' },
    { name: 'soilTool', description: 'Analyze soil health from NPK values.' },
    { name: 'storeTool', description: 'Search AgriStore and add items to cart.' },
    { name: 'memoryTool', description: 'Retrieve past user facts and context (Inactive).' }
  ];
};

export const invokeTool = async (intent, context, payload = {}) => {
  try {
    switch (intent.intent) {
      case 'Disease Detection':
        // Fallback placeholder logic. Real logic would take image from payload.
        return await executeDiseaseAnalysis(context.kisanId, payload.conversationId || null, payload.imageUrl || null);
        
      case 'Symptom Analysis':
        return await executeSymptomAnalysis(context.kisanId, payload.conversationId || null, payload.message || null);
        
      case 'Disease Forecast':
        // The orchestrator typically extracts these from the user's context/memory.
        // We will default to a placeholder if not present.
        return await executeForecastAnalysis(context.kisanId, payload.conversationId || null, payload.crop || 'Unknown', payload.location || 'Unknown');
        
      case 'Weather':
        // Use user profile location if available
        const lat = payload.lat || null;
        const lon = payload.lon || null;
        return await executeWeatherCheck(lat, lon);
        
      case 'Soil':
        return await executeSoilAnalysis(payload.npkData || {});
        
      case 'Store':
        return await executeStoreSearch(payload.query || '');
        
      case 'Memory':
        // Inactive for Phase 1
        return await executeMemorySearch(context.kisanId, payload.query || '');
        
      default:
        // No tool needed
        return null;
    }
  } catch (error) {
    console.error(`Tool execution failed for intent ${intent.intent}:`, error);
    return { success: false, error: 'Tool failed to execute gracefully.' };
  }
};
