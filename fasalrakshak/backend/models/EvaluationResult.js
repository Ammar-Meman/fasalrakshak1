import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    evaluationId: { type: String, required: true },
    modelVersion: { type: String, required: true },
    passedSafetyThreshold: { type: Boolean, required: true },
    biasScore: { type: Number },
    notes: { type: String },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('EvaluationResult', schema);
