export const generateTaskGraph = (message) => {
    // Generates a Directed Acyclic Graph based on the prompt
    // Hardcoded example for demonstration
    return {
        nodes: [
            { id: 'task_disease', agent: 'diseaseAgent', dependencies: [] },
            { id: 'task_weather', agent: 'weatherAgent', dependencies: [] },
            { id: 'task_recommendation', agent: 'recommendationAgent', dependencies: ['task_disease', 'task_weather'] }
        ]
    };
};
