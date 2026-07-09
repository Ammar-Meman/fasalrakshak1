import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    agentName: { type: String, required: true },
    executionTimeMs: { type: Number },
    success: { type: Boolean },
    confidence: { type: Number },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('AgentPerformance', schema);
