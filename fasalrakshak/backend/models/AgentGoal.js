import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    kisanId: { type: String, required: true },
    goal: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Completed', 'Abandoned'], default: 'Active' },
    progress: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('AgentGoal', schema);
