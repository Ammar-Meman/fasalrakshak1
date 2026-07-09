// Simulated registry pattern
const registry = new Map();

export const registerAgent = (name, agentModule) => {
    registry.set(name, agentModule);
};

export const getAgent = (name) => {
    return registry.get(name);
};
