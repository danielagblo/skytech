import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  imageUrl: { type: String }, // Optional: If provided, shows photo
  iconType: { type: String, default: "default" }, // Optional: fallback icon type
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TeamMember ||
  mongoose.model("TeamMember", TeamMemberSchema);
