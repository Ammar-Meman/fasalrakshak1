import AgentBlackboard from '../../models/AgentBlackboard.js';

export const writeToBlackboard = async (executionId, key, value, writtenBy) => {
    const entry = new AgentBlackboard({ executionId, key, value, writtenBy });
    await entry.save();
    return entry;
};

export const readFromBlackboard = async (executionId, key) => {
    const entry = await AgentBlackboard.findOne({ executionId, key }).sort({ updatedAt: -1 });
    return entry ? entry.value : null;
};
