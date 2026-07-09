import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    conversationId: { type: String, required: true },
    turnCount: { type: Number, default: 0 },
    context: { type: Object },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('AgentConversation', schema);
