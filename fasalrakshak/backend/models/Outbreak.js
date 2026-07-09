import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    disease: { type: String, required: true },
    region: { type: String, required: true },
    affectedFarmers: { type: Number, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    confidence: { type: Number },
    suggestedAction: { type: String },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('Outbreak', schema);
