export interface FAQItem {
  question: string;
  answer: string;
}

export type GroupedFAQs = Record<string, FAQItem[]>;

export interface RawFAQ {
  question: string;
  answer: string;
  category?: string;
}

export function groupFAQs(faqs: RawFAQ[]): GroupedFAQs {
  const grouped: GroupedFAQs = {};
  for (const faq of faqs) {
    const cat = faq.category || "General";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ question: faq.question, answer: faq.answer });
  }
  return grouped;
}
