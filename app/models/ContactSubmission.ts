import mongoose from "mongoose";

const ContactSubmissionSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  phone: String,
  company: String,
  projectType: String,
  budget: String,
  timeline: String,
  urgency: String,
  message: String,
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", ContactSubmissionSchema);
