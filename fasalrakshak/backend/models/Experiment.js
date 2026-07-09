import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    experimentId: { type: String, required: true },
    description: { type: String },
    variants: { type: [String] },
    winningVariant: { type: String },
    completedAt: { type: Date }
});
export default mongoose.model('Experiment', schema);
