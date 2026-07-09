import { diseaseAgent } from './agents/diseaseAgent.js';
import { weatherAgent } from './agents/weatherAgent.js';
import { recommendationAgent } from './agents/recommendationAgent.js';

// Hardcoded router for mock hackathon demonstration
export const routeTask = async (agentName, context) => {
    switch (agentName) {
        case 'diseaseAgent': return await diseaseAgent.execute(context);
        case 'weatherAgent': return await weatherAgent.execute(context);
        case 'recommendationAgent': return await recommendationAgent.execute(context);
        default: return { confidence: 0, result: 'Unknown Agent' };
    }
};
