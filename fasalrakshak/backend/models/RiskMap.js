import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    region: { type: String, required: true },
    heatmapData: { type: Object, required: true }, // grid of risk scores
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('RiskMap', schema);
