import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: 'General',
  },
  published: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);
