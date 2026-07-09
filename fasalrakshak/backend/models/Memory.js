import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
  kisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kisan', required: true, index: true },
  category: { type: String, required: true }, // e.g. Crop, Farm Size, Disease, Treatment, Preferences
  importance: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  fact: { type: String, required: true },
  confidence: { type: Number, default: 1.0 },
  source: { type: String, default: 'conversation' }, // where it came from
  timesUsed: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now },
  timestamp: { type: Date, default: Date.now }
});

// Text index for semantic search using MongoDB
memorySchema.index({ fact: 'text', category: 'text' });

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;
