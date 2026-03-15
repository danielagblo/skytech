import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
  id: String,
  name: String,
  role: String,
  focus: String,
  note: String,
  avatar: String,
});

export default mongoose.models.TeamMember ||
  mongoose.model("TeamMember", TeamMemberSchema);
