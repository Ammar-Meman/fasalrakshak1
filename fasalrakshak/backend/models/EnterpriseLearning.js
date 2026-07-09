import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    learnedInsight: { type: String, required: true },
    confidenceIncrease: { type: Number },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('EnterpriseLearning', schema);
