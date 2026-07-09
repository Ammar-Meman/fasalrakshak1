import { planExecution } from './plannerAgent.js';
import { coordinateAgents } from './coordinatorAgent.js';
import { achieveConsensus } from './consensusEngine.js';
import { validateOutput } from './validatorAgent.js';
import { critiqueOutput } from './criticAgent.js';
import { reflectOnExecution } from './reflectionAgent.js';

export const executeMultiAgentWorkflow = async (message, context) => {
    console.log(`[Execution Engine] Initiating Multi-Agent Workflow...`);
    
    // 1. Plan
    const plan = await planExecution(message, context);
    
    // 2. Coordinate (Parallel Execution)
    const agentOutputs = await coordinateAgents(plan, context);
    
    // 3. Consensus
    const consensus = await achieveConsensus(plan.executionId, agentOutputs);
    
    // 4. Validate & Critique
    const validation = validateOutput(consensus.resolution);
    const critique = critiqueOutput(consensus.resolution);
    
    if (!validation.valid || !critique.passed) {
        console.log(`[Execution Engine] Output rejected. Retrying...`);
        return { success: false, reason: 'Validation failed' };
    }
    
    // 5. Reflect
    await reflectOnExecution(plan.executionId, consensus.resolution);
    
    return consensus.resolution;
};
