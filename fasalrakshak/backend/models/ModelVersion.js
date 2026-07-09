import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    versionId: { type: String, required: true },
    modelType: { type: String, required: true },
    accuracy: { type: Number, required: true },
    precision: { type: Number },
    recall: { type: Number },
    f1Score: { type: Number },
    status: { type: String, enum: ['Active', 'Deprecated', 'Rollback Candidate', 'Experimental'], default: 'Experimental' },
    trainingDate: { type: Date, default: Date.now }
});
export default mongoose.model('ModelVersion', schema);
