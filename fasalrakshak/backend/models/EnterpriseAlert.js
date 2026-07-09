import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    type: { type: String, required: true }, // Outbreak, Flood, Heatwave
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    region: { type: String },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('EnterpriseAlert', schema);
