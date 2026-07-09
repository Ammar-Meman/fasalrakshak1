import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    entity: { type: String, required: true }, // "Farm", "Region", "Crop"
    entityName: { type: String, required: true },
    predictedYield: { type: Number },
    unit: { type: String, default: "Tonnes" },
    confidence: { type: Number },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('YieldPrediction', schema);
