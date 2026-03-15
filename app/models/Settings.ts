import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  siteName: String,
  siteDescription: String,
  contactEmail: String,
  contactPhone: String,
  whatsapp: String,
  address: String,
  pricingBookletUrl: String,
});

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
