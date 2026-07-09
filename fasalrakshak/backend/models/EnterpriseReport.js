import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true }, // For Multi-Tenant isolation
    title: { type: String, required: true },
    type: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Seasonal', 'Custom'] },
    data: { type: Object, required: true },
    generatedAt: { type: Date, default: Date.now }
});
export default mongoose.model('EnterpriseReport', schema);
