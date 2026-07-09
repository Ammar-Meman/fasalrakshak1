/**
 * Task Planner
 * Inspects the request to determine which tools are needed.
 * Returns an array of intents/tools required.
 */
export const planTasks = async (message) => {
  const lowerMessage = message.toLowerCase();
  const tasks = [];

  // Always include memory unless specifically opted out
  tasks.push({ intent: 'Memory', type: 'context' });

  if (lowerMessage.includes('weather') || lowerMessage.includes('mausam') || lowerMessage.includes('rain')) {
    tasks.push({ intent: 'Weather', type: 'tool' });
  }
  
  if (lowerMessage.includes('disease') || lowerMessage.includes('bimari') || lowerMessage.includes('sick') || lowerMessage.includes('spot') || lowerMessage.includes('leaves') || lowerMessage.includes('black')) {
    tasks.push({ intent: 'Disease Detection', type: 'tool' });
  }
  
  if (lowerMessage.includes('symptom') || lowerMessage.includes('yellow') || lowerMessage.includes('wilt') || lowerMessage.includes('curl') || lowerMessage.includes('drying') || lowerMessage.includes('browning') || lowerMessage.includes('pila') || lowerMessage.includes('murjha')) {
    tasks.push({ intent: 'Symptom Analysis', type: 'tool' });
  }
  
  if (lowerMessage.includes('prevent') || lowerMessage.includes('future') || lowerMessage.includes('forecast') || lowerMessage.includes('risk') || lowerMessage.includes('season') || lowerMessage.includes('bhavishya') || lowerMessage.includes('aage')) {
    tasks.push({ intent: 'Disease Forecast', type: 'tool' });
  }
  
  if (lowerMessage.includes('soil') || lowerMessage.includes('mitti') || lowerMessage.includes('npk') || lowerMessage.includes('fertilizer')) {
    tasks.push({ intent: 'Soil', type: 'tool' });
  }
  
  if (lowerMessage.includes('buy') || lowerMessage.includes('store') || lowerMessage.includes('purchase') || lowerMessage.includes('fertilizer')) {
    tasks.push({ intent: 'Store', type: 'tool' });
  }

  // If no specific tools were matched, we rely on General Farming knowledge
  if (tasks.filter(t => t.type === 'tool').length === 0) {
    tasks.push({ intent: 'General Farming', type: 'tool' });
  }
  
  return tasks;
};
