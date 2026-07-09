import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    predictionId: { type: String, required: true },
    featuresUsed: { type: Object },
    confidence: { type: Number },
    modelVersion: { type: String },
    actualOutcome: { type: String },
    accuracyDelta: { type: Number },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('PredictionOutcome', schema);
