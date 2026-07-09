import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    executionId: { type: String, required: true },
    conflictDetected: { type: Boolean, default: false },
    resolution: { type: Object },
    finalConfidence: { type: Number },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('AgentConsensus', schema);
