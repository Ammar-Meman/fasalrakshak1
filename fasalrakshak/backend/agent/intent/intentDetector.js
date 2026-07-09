/**
 * Intent Detection Module
 * Determines what the user wants to do.
 */

export const detectIntent = async (message) => {
  try {
    const lowerMessage = message.toLowerCase();
    
    // Simple fast-path rule-based intent detection to save LLM calls on basic queries
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
      return { intent: 'Greeting', confidence: 0.9, reason: 'Matched greeting keywords' };
    }
    if (lowerMessage.includes('weather') || lowerMessage.includes('mausam') || lowerMessage.includes('rain')) {
      return { intent: 'Weather', confidence: 0.8, reason: 'Matched weather keywords' };
    }
    if (lowerMessage.includes('disease') || lowerMessage.includes('bimari') || lowerMessage.includes('sick')) {
      return { intent: 'Disease Detection', confidence: 0.8, reason: 'Matched disease keywords' };
    }
    if (lowerMessage.includes('soil') || lowerMessage.includes('mitti') || lowerMessage.includes('npk')) {
      return { intent: 'Soil', confidence: 0.8, reason: 'Matched soil keywords' };
    }
    if (lowerMessage.includes('buy') || lowerMessage.includes('store') || lowerMessage.includes('purchase')) {
      return { intent: 'Store', confidence: 0.8, reason: 'Matched store keywords' };
    }
    if (lowerMessage.includes('seed') || lowerMessage.includes('crop') || lowerMessage.includes('grow')) {
      return { intent: 'Crop Planning', confidence: 0.7, reason: 'Matched crop keywords' };
    }
    
    // Fallback intent
    return { intent: 'General Farming', confidence: 0.5, reason: 'Fallback intent' };
  } catch (error) {
    console.error("Intent Detection Error:", error);
    return { intent: 'Unknown', confidence: 0.0, reason: 'Error in detection' };
  }
};
