import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    runId: { type: String, required: true },
    modelType: { type: String, required: true }, // e.g. "Disease Classifier"
    status: { type: String, enum: ['Pending', 'Running', 'Completed', 'Failed'], default: 'Pending' },
    datasetVersion: { type: String },
    epochs: { type: Number },
    metrics: { type: Object }, // accuracy, loss
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});
export default mongoose.model('TrainingRun', schema);
