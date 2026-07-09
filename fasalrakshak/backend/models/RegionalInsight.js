import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    regionName: { type: String, required: true },
    metrics: { type: Object, required: true }, // diseaseRate, avgYield, etc
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('RegionalInsight', schema);
