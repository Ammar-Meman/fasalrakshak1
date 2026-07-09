import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    label: { type: String, required: true }, // e.g. "Tomato", "Early Blight", "Rajkot"
    type: { type: String, required: true }, // e.g. "Crop", "Disease", "Location"
    properties: { type: Object }
});
export default mongoose.model('KnowledgeNode', schema);
