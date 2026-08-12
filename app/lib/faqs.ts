import { isMysql } from './db';
import * as mysql from './mysql';
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

function mapFaqRow(r: any): IFAQ {
  return {
    _id: r.id,
    question: r.question || "",
    answer: r.answer || "",
    category: r.category || "General",
    order: r.sort_order ?? 0,
    published: mysql.fromBool(r.published),
  };
}

async function getAllFAQsMysql() {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, question, answer, category, sort_order, published FROM faqs ORDER BY sort_order ASC, created_at DESC",
  );
  return rows.map(mapFaqRow);
}

async function getFAQsMysql() {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, question, answer, category, sort_order, published FROM faqs WHERE published = 1 ORDER BY sort_order ASC, created_at DESC",
  );
  return rows.map(mapFaqRow);
}

async function saveFAQsMysql(faqs: IFAQ[]) {
  await mysql.initSchema();
  const preservedIds: string[] = [];
  const updatedFaqs: IFAQ[] = [];

  for (const faq of faqs) {
    if (faq._id && faq._id.length > 20) {
      await mysql.update("faqs", faq._id, {
        question: faq.question,
        answer: faq.answer,
        category: faq.category || "General",
        sort_order: faq.order ?? 0,
        published: mysql.toBool(faq.published),
      });
      preservedIds.push(faq._id);
      updatedFaqs.push({ ...faq });
    } else {
      const { _id, ...rest } = faq;
      const id = await mysql.insert("faqs", {
        question: rest.question,
        answer: rest.answer,
        category: rest.category || "General",
        sort_order: rest.order ?? 0,
        published: mysql.toBool(rest.published),
      });
      preservedIds.push(id);
      updatedFaqs.push({ ...rest, _id: id });
    }
  }

  if (preservedIds.length > 0) {
    const placeholders = preservedIds.map(() => "?").join(", ");
    await mysql.query(`DELETE FROM faqs WHERE id NOT IN (${placeholders})`, preservedIds);
  } else {
    await mysql.clear("faqs");
  }

  return { success: true, faqs: updatedFaqs };
}

export async function getFAQs() {
  if (isMysql()) {
    try {
      return await getFAQsMysql();
    } catch (error) {
      console.error("Error fetching FAQs from MySQL:", error);
      return [];
    }
  }
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
  if (isMysql()) {
    try {
      return await getAllFAQsMysql();
    } catch (error) {
      console.error("Error fetching all FAQs from MySQL:", error);
      return [];
    }
  }
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
  if (isMysql()) {
    return saveFAQsMysql(faqs);
  }
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