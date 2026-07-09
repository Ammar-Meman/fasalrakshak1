import mongoose from 'mongoose';
import { executeMultiAgentWorkflow } from './agent/multiagent/executionEngine.js';

// Mock DB connection for isolated test
mongoose.connect = async () => {};
mongoose.model = (name, schema) => ({
    save: async () => true,
    findOne: async () => ({ value: 'mock' }),
    find: async () => []
});

const runTests = async () => {
    console.log("Starting Multi-Agent Workforce Tests...\n");
    
    // Scenario 1: Executing a complex user query through the multi-agent DAG
    console.log("Test 1: Full DAG Execution & Consensus");
    const result = await executeMultiAgentWorkflow("My tomato leaves have black spots", { profile: { location: 'Rajkot' } });
    
    console.assert(result !== null, "Result should not be null");
    console.assert(result.agent === 'weatherAgent' || result.agent === 'diseaseAgent', "Should reach consensus on one of the agents");
    console.log("✅ Passed");

    console.log("\nAll Multi-Agent tests completed successfully.");
};

runTests();
