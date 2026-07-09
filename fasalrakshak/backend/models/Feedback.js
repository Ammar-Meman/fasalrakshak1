import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    recommendationId: { type: String, required: true },
    kisanId: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Applied', 'Observed', 'Successful', 'Failed', 'Unknown'], default: 'Pending' },
    farmerRating: { type: Number },
    diseaseReduced: { type: Boolean },
    yieldIncreased: { type: Boolean },
    costReduced: { type: Boolean },
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('Feedback', schema);
