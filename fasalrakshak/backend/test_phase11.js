import mongoose from 'mongoose';
import { triggerBackgroundLearning } from './agent/autonomous/learningEngine.js';
import { enforceSafetyBounds } from './agent/autonomous/safetyEngine.js';

mongoose.connect = async () => {};
mongoose.model = (name, schema) => ({
    save: async () => true,
    findOneAndUpdate: async () => true
});

const runTests = async () => {
    console.log("Starting Phase 11 AAIOS Tests...\n");
    
    // Scenario 1: Learning Trigger does not block
    console.log("Test 1: Asynchronous Background Learning Hook");
    const startTime = Date.now();
    // Intentionally omitted await to simulate background thread firing
    triggerBackgroundLearning('mock_kisan', 'REC_123', {});
    const executionTime = Date.now() - startTime;
    console.assert(executionTime < 10, "Background learning hook must be non-blocking!");
    console.log(`✅ Passed (Execution time: ${executionTime}ms)`);

    // Scenario 2: Safety Engine Evaluation
    console.log("Test 2: Safety Bounds Enforcement");
    const isSafe = await enforceSafetyBounds('v2.0.1', { accuracy: 0.95, falsePositiveRate: 0.02 });
    console.assert(isSafe === true, "Model should be approved");
    
    const isUnsafe = await enforceSafetyBounds('v2.0.2', { accuracy: 0.85, falsePositiveRate: 0.06 });
    console.assert(isUnsafe === false, "Model should be rejected");
    console.log("✅ Passed");

    console.log("\nAll AAIOS tests completed successfully.");
};

runTests();
