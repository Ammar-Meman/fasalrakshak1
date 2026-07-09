import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    sourceNode: { type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeNode', required: true },
    targetNode: { type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeNode', required: true },
    relation: { type: String, required: true }, // e.g. "AFFECTED_BY", "TREATED_WITH"
    weight: { type: Number, default: 1.0 }
});
export default mongoose.model('KnowledgeEdge', schema);
