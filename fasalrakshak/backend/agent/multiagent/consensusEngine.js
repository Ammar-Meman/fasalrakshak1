import AgentConsensus from '../../models/AgentConsensus.js';

export const achieveConsensus = async (executionId, agentOutputs) => {
    console.log(`[Consensus Engine] Resolving conflicts...`);
    
    // Simplistic consensus rule: Pick highest confidence
    let bestOutput = null;
    let highestConfidence = 0;
    
    for (const out of agentOutputs) {
        if (out && out.confidence > highestConfidence) {
            highestConfidence = out.confidence;
            bestOutput = out;
        }
    }
    
    const consensus = new AgentConsensus({
        executionId,
        conflictDetected: agentOutputs.length > 1,
        resolution: bestOutput,
        finalConfidence: highestConfidence
    });
    
    await consensus.save();
    return consensus;
};
