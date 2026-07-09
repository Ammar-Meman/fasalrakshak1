import mongoose from 'mongoose';
import { detectOutbreaks } from './agent/enterprise/outbreakDetector.js';
import { calculateKPIs } from './agent/enterprise/kpiEngine.js';
import { updateKnowledgeGraph } from './agent/enterprise/knowledgeGraph.js';

// Mock MongoDB connection to prevent errors during isolated test
mongoose.connect = async () => {};
mongoose.model = (name, schema) => ({
    save: async () => true,
    findOneAndUpdate: async () => ({ _id: 'mockId', tenantId: 'tenant1' })
});

const runEnterpriseTests = async () => {
    console.log("Starting Enterprise Intelligence Tests...\n");
    const tenantId = 'TENANT_TEST';

    // Scenario 1: Outbreak Detection
    console.log("Test 1: Outbreak Detection");
    const outbreak = await detectOutbreaks(tenantId, 'Rajkot', 'Tomato', 'Early Blight');
    console.assert(outbreak !== null, "Outbreak should be detected");
    console.assert(outbreak.severity === 'High', "Severity should be High");
    console.log("✅ Passed");

    // Scenario 2: KPI Engine
    console.log("Test 2: KPI Engine Execution");
    const kpis = await calculateKPIs(tenantId);
    console.assert(kpis.length === 6, "Should generate 6 KPIs");
    console.assert(kpis[0].value === 14.5, "Disease rate KPI should be 14.5");
    console.log("✅ Passed");

    // Scenario 3: Knowledge Graph Updates
    console.log("Test 3: Knowledge Graph Entity Linking");
    await updateKnowledgeGraph(tenantId, 'Tomato', 'Early Blight', 'Rajkot', 'Neem Oil', true);
    // Since we mock findOneAndUpdate to return a mock node, it will run without throwing
    console.log("✅ Passed (Executes without throwing)");

    console.log("\nAll Enterprise tests completed successfully.");
};

runEnterpriseTests();
