import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    executionId: { type: String, required: true },
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed },
    writtenBy: { type: String },
    updatedAt: { type: Date, default: Date.now }
});
export default mongoose.model('AgentBlackboard', schema);
