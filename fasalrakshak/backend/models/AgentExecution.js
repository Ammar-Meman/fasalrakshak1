import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    executionId: { type: String, required: true },
    plannerOutput: { type: Object },
    status: { type: String, enum: ['Pending', 'Running', 'Completed', 'Failed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});
export default mongoose.model('AgentExecution', schema);
