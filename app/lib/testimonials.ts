import { isMysql } from "./db";
import * as mysql from "./mysql";
import dbConnect from "./mongodb";
import Testimonial from "../models/Testimonial";

export interface ITestimonial {
  _id?: string;
  author: string;
  company: string;
  quote: string;
  rating?: number;
}

async function getTestimonialsMysql(): Promise<ITestimonial[]> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, author, company, quote, rating FROM testimonials ORDER BY created_at ASC, id ASC",
  );
  return rows.map((r) => ({
    _id: r.id,
    author: r.author || "",
    company: r.company || "",
    quote: r.quote || "",
    rating: r.rating != null ? r.rating : 5,
  }));
}

async function saveTestimonialsMysql(
  testimonials: ITestimonial[],
): Promise<void> {
  await mysql.initSchema();
  await mysql.clear("testimonials");
  for (const t of testimonials) {
    await mysql.insert("testimonials", {
      author: t.author,
      company: t.company,
      quote: t.quote,
      rating: t.rating ?? 5,
    });
  }
}

export async function getTestimonials(): Promise<ITestimonial[]> {
  if (isMysql()) {
    try {
      return await getTestimonialsMysql();
    } catch (error) {
      console.error("Error fetching testimonials (mysql):", error);
      return [];
    }
  }
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
  if (isMysql()) {
    await saveTestimonialsMysql(testimonials);
    return;
  }
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