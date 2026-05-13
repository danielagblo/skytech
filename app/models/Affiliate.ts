import mongoose from "mongoose";

const AffiliateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'affiliates' });

export default mongoose.models.Affiliate ||
  mongoose.model("Affiliate", AffiliateSchema);
