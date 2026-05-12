import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  imageUrl: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
