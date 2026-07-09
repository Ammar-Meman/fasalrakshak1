import mongoose from 'mongoose';

const reflectionSchema = new mongoose.Schema({
  kisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kisan', required: true, index: true },
  reflection: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Reflection = mongoose.model('Reflection', reflectionSchema);
export default Reflection;
