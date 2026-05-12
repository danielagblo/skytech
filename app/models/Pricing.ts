import mongoose from 'mongoose';

const PricingPackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tier: { type: String, required: true },
  price: { type: String, required: true },
  usd: { type: String, required: true },
  renewal: { type: String, required: true },
  interval: { type: String }, // e.g., "mo"
  featured: { type: Boolean, default: false },
  highlights: [{ type: String }],
});

const PricingSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true }, // "web", "mobile", "marketing", "branding"
  label: { type: String, required: true }, // Display name: "Web Development"
  packages: [PricingPackageSchema],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);
