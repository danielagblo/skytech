import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  id: String,
  author: String,
  company: String,
  quote: String,
  rating: Number,
});

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);
