import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  icon: String,
});

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);
