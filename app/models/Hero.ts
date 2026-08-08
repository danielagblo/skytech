import mongoose from 'mongoose';

const HeroStatSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  suffix: { type: String, default: "" },
  label: { type: String, required: true },
  compact: { type: Boolean, default: false },
});

const HeroSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  headline: { type: String, default: "MANY YEARS" },
  headlineSub: { type: String, default: "IN OPERATION" },
  subText: { type: String, default: "For Website, Mobile App Development and SEO Growth" },
  stats: { type: [HeroStatSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
