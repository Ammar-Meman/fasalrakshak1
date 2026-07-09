import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    districtName: { type: String, required: true },
    metrics: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('DistrictInsight', schema);
