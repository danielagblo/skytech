import mongoose from "mongoose";

const PageSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  content: mongoose.Schema.Types.Mixed,
});

export default mongoose.models.Page || mongoose.model("Page", PageSchema);
