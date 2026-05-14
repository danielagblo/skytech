import dbConnect from './mongodb';
import FAQ from '../models/FAQ';

export interface IFAQ {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  published: boolean;
}

export async function getFAQs() {
  try {
    await dbConnect();
    const faqs = await FAQ.find({ published: true }).sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(faqs));
  } catch (error) {
    console.error("Error fetching FAQs from MongoDB:", error);
    return [];
  }
}

export async function getAllFAQs() {
  try {
    await dbConnect();
    const faqs = await FAQ.find({}).sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(faqs));
  } catch (error) {
    console.error("Error fetching all FAQs from MongoDB:", error);
    return [];
  }
}

export async function saveFAQs(faqs: IFAQ[]) {
  try {
    await dbConnect();
    
    const preservedIds = [];
    const updatedFaqs = [];

    for (const faq of faqs) {
      if (faq._id && faq._id.length > 20) { // MongoDB ID check
        const updated = await FAQ.findByIdAndUpdate(faq._id, faq, { upsert: true, new: true });
        preservedIds.push(updated._id.toString());
        updatedFaqs.push(JSON.parse(JSON.stringify(updated)));
      } else {
        const { _id, ...rest } = faq;
        const created = await FAQ.create(rest);
        preservedIds.push(created._id.toString());
        updatedFaqs.push(JSON.parse(JSON.stringify(created)));
      }
    }
    
    // Remove ones not in the list
    await FAQ.deleteMany({ _id: { $nin: preservedIds } });
    
    return { success: true, faqs: updatedFaqs };
  } catch (error) {
    console.error("Error saving FAQs to MongoDB:", error);
    throw error;
  }
}
