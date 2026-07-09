import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    policyName: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    enforcementCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('PolicyDecision', schema);
