import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    snapshotId: { type: String, required: true },
    nodeCount: { type: Number },
    edgeCount: { type: Number },
    graphHash: { type: String },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('KnowledgeSnapshot', schema);
