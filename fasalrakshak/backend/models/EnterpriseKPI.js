import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    kpiName: { type: String, required: true }, // e.g. "Disease Rate", "Revenue Saved"
    value: { type: Number, required: true },
    unit: { type: String },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('EnterpriseKPI', schema);
