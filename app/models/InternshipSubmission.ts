import mongoose from "mongoose";

const InternshipSubmissionSchema = new mongoose.Schema(
  {
    id: Number,
    submittedAt: { type: Date, default: Date.now },
  },
  { strict: false },
);

export default mongoose.models.InternshipSubmission ||
  mongoose.model("InternshipSubmission", InternshipSubmissionSchema);
