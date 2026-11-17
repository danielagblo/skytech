"use client";

import { useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import type { GroupedFAQs } from "./faqGroup";

const DEFAULT_FAQS: GroupedFAQs = {
  Hosting: [
    { question: "How Long does my hosting last", answer: "Your hosting package lasts for 1 year and renews at GH₵1,000/yr." },
    { question: "Does hosting include pass", answer: "Yes, hosting includes SSL and domain management." },
    { question: "Frequently Asked Questions", answer: "You can find all FAQs in this section categorised by topic." },
    { question: "How Long does my hosting last", answer: "Your hosting package lasts for 1 year and renews at GH₵1,000/yr." },
    { question: "Does hosting include pass", answer: "Yes, hosting includes SSL and domain management." },
    { question: "Frequently Asked Questions", answer: "You can find all FAQs in this section categorised by topic." },
  ],
  Domain: [
    { question: "How do I register a domain?", answer: "We handle domain registration as part of your package." },
    { question: "Can I transfer my existing domain?", answer: "Yes, domain transfers are supported. Contact us to initiate." },
  ],
  Maintenance: [
    { question: "What does maintenance include?", answer: "Regular updates, bug fixes, and content changes are covered." },
    { question: "How often is maintenance done?", answer: "Maintenance is performed monthly or on demand." },
  ],
  Payment: [
    { question: "What payment methods are accepted?", answer: "We accept Mobile Money, bank transfer, and cash." },
    { question: "Is there a payment plan?", answer: "Yes, installment plans are available on request." },
  ],
};

export default function FAQSection({ faqs = DEFAULT_FAQS, showHeading = true }: { faqs?: GroupedFAQs; showHeading?: boolean }) {
  const categories = Object.keys(faqs);
  const defaultCategory = categories.includes("General") ? "General" : categories[0] || "General";
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setOpenIndex(null);
  };

  const currentFaqs = faqs[activeCategory] || [];

  return (
    <section className="border-t border-[#E3DDD4] bg-[#F6F4F0] py-24 md:py-32">
      <div className="section-shell">
        {showHeading && (
          <SectionHeading
            tag="FAQ"
            title="Frequently asked questions"
            lead="Clear answers on services, pricing, and how we work. If you need something more specific, write to us."
            className="mb-12 max-w-2xl"
          />
        )}

        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 border-b border-[#E3DDD4]">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`-mb-px border-b pb-3 text-sm transition-colors ${
                  isActive
                    ? "border-[#1E5AC8] font-medium text-[#141413]"
                    : "border-transparent text-[#6B6560] hover:text-[#141413]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="max-w-3xl border-t border-[#E3DDD4]">
          {currentFaqs.length === 0 && (
            <p className="py-10 text-[#5C574F]">No questions in this category yet.</p>
          )}
          {currentFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-[#E3DDD4]">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className={`text-base sm:text-lg ${isOpen ? "font-medium text-[#141413]" : "text-[#141413]"}`}>
                    {faq.question}
                  </span>
                  <span className={`text-sm ${isOpen ? "text-[#1E5AC8]" : "text-[#6B6560]"}`} aria-hidden>
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-[#5C574F] leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
