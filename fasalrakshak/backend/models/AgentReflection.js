import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    executionId: { type: String, required: true },
    lessonsLearned: { type: [String] },
    mistakes: { type: [String] },
    successes: { type: [String] },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('AgentReflection', schema);
