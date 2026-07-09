import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    executionId: { type: String, required: true },
    taskId: { type: String, required: true },
    agentAssigned: { type: String, required: true },
    inputs: { type: Object },
    outputs: { type: Object },
    status: { type: String, enum: ['Pending', 'Running', 'Completed', 'Failed'], default: 'Pending' },
    confidence: { type: Number },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('AgentTask', schema);
