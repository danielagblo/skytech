import dbConnect from "./mongodb";
import Testimonial from "../models/Testimonial";

export interface ITestimonial {
  _id?: string;
  author: string;
  company: string;
  quote: string;
  rating?: number;
}

export async function getTestimonials(): Promise<ITestimonial[]> {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({}).lean();
    return JSON.parse(JSON.stringify(testimonials));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function saveTestimonials(testimonials: ITestimonial[]): Promise<void> {
  try {
    await dbConnect();
    await Testimonial.deleteMany({});
    if (testimonials.length > 0) {
      await Testimonial.insertMany(testimonials.map(t => ({
        author: t.author,
        company: t.company,
        quote: t.quote,
        rating: t.rating || 5
      })));
    }
  } catch (error) {
    console.error("Error saving testimonials:", error);
    throw error;
  }
}

