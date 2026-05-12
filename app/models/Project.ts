import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '/images/hero-1.png',
  },
  client: {
    type: String,
    default: "Global Client",
  },
  impact: {
    type: String,
    default: "Accelerated Growth",
  },
  metrics: {
    type: [String],
    default: ["Next.js", "React", "Cloud"],
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
