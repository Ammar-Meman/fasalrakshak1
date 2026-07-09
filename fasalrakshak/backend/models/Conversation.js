import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'agent', 'system', 'tool'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  toolCalls: { type: Array, default: [] }, // For tracking what tools the agent used
});

const conversationSchema = new mongoose.Schema({
  kisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kisan', required: true },
  title: { type: String, default: 'New Conversation' },
  messages: [messageSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (typeof next === 'function') next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
