import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  type: String,
  page: String,
  sessionId: String,
  source: String,
  deviceType: String,
  browser: String,
  timestamp: Date,
  action: String,
});

export default mongoose.models.Analytics ||
  mongoose.model("Analytics", AnalyticsSchema);
