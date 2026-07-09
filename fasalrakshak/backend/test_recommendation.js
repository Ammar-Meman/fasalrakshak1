import { executeDecisionEngine } from './agent/recommendation/decisionEngine.js';
import mongoose from 'mongoose';

// Mock MongoDB connection to prevent errors during isolated test
mongoose.connect = async () => {};
mongoose.model = (name, schema) => ({
    save: async () => true
});

const runTests = async () => {
    console.log("Starting Recommendation Engine Tests...\n");

    const baseContext = {
        kisanId: '12345',
        profile: { farmSize: 2, farmingType: 'Chemical', budget: 'Medium' }
    };

    // Scenario 1: Disease + Weather (Rain overriding pesticide)
    console.log("Test 1: Rain overrides chemical pesticide");
    const outputs1 = {
        'Disease Detection': { disease: 'Early Blight', confidence: 95 },
        'Weather': { forecast: 'Heavy Rain expected' }
    };
    const rec1 = await executeDecisionEngine(outputs1, baseContext, "Help");
    console.assert(rec1.pesticide.action.includes('Delay'), "Pesticide should be delayed due to rain");
    console.log("✅ Passed");

    // Scenario 2: Organic Farmer overriding chemicals
    console.log("Test 2: Organic farmer gets Neem Oil instead of chemicals");
    const organicContext = { ...baseContext, profile: { farmingType: 'Organic' } };
    const outputs2 = {
        'Disease Detection': { disease: 'Leaf Curl', confidence: 90 },
        'Weather': { forecast: 'Clear skies' }
    };
    const rec2 = await executeDecisionEngine(outputs2, organicContext, "Help");
    console.assert(rec2.pesticide.name.includes('Neem'), "Organic farmer should get Neem Oil");
    console.log("✅ Passed");

    // Scenario 3: Soil Nitrogen deficiency
    console.log("Test 3: Soil deficiency triggers Urea recommendation");
    const outputs3 = {
        'Soil': { success: true, analysis: 'Severe Nitrogen deficiency detected.' }
    };
    const rec3 = await executeDecisionEngine(outputs3, baseContext, "Help");
    console.assert(rec3.fertilizer.name.includes('Urea'), "Fertilizer should be Urea for N deficiency");
    console.log("✅ Passed");

    // Scenario 4: Low Budget Cost Optimization
    console.log("Test 4: Low budget triggers cost reduction");
    const budgetContext = { ...baseContext, profile: { budget: 'Low', farmSize: 10 } };
    const outputs4 = {
        'Disease Detection': { disease: 'Mildew', confidence: 85 },
        'Soil': { success: true, analysis: 'Phosphorus deficiency' } // Will trigger DAP
    };
    const rec4 = await executeDecisionEngine(outputs4, budgetContext, "Help");
    console.assert(rec4.estimatedCost < (10 * 1300), "Cost should be reduced for low budget"); // 10 * (500 + 800) = 13000, 13000 * 0.6 = 7800
    console.log("✅ Passed");
    
    // Scenario 5: Harvest proximity stripping chemicals
    console.log("Test 5: Near harvest strips chemical sprays");
    const harvestContext = { ...baseContext, profile: { cropStage: 'Harvest' } };
    const outputs5 = {
        'Disease Detection': { disease: 'Late Blight', confidence: 90 }
    };
    const rec5 = await executeDecisionEngine(outputs5, harvestContext, "Help");
    console.assert(!rec5.pesticide, "Chemical pesticide should be stripped near harvest");
    console.assert(rec5.harvest.waitingPeriod.includes('Safe'), "Harvest advice should indicate safe");
    console.log("✅ Passed");

    console.log("\nAll tests completed successfully.");
};

runTests();
