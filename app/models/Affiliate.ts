import mongoose from "mongoose";

const AffiliateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  colSpan: { type: Number, default: 1 },
  rowSpan: { type: Number, default: 1 },
  logoScale: { type: Number, default: 100 },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'affiliates' });

export default mongoose.models.Affiliate ||
  mongoose.model("Affiliate", AffiliateSchema);
