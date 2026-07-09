import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    cycleId: { type: String, required: true },
    status: { type: String, enum: ['Scheduled', 'Extracting', 'Training', 'Evaluating', 'Completed', 'Failed'], default: 'Scheduled' },
    triggerSource: { type: String },
    oldModelVersion: { type: String },
    newModelVersion: { type: String },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('LearningCycle', schema);
