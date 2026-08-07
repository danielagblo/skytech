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

export default function FAQSection({ faqs = DEFAULT_FAQS }: { faqs?: GroupedFAQs }) {
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
    <section className="section-shell py-16">
      <SectionHeading
        tag="FAQ"
        title="Frequently Asked Questions"
        lead="Everything you need to know about our services, pricing and processes. Can't find an answer? Reach out and our team will help."
        align="center"
        className="mb-10"
      />

      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                isActive
                  ? "bg-brand-600 text-white shadow-soft"
                  : "bg-brand-50 text-slate-600 hover:bg-brand-100 hover:text-brand-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Accordion */}
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-soft">
        {currentFaqs.length === 0 && (
          <p className="px-6 py-10 text-center text-slate-500">No questions in this category yet.</p>
        )}
        {currentFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border-b border-slate-100 last:border-0">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span
                  className={`text-lg transition-colors ${
                    isOpen ? "font-semibold text-brand-700" : "font-medium text-slate-800"
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-2xl font-light transition-all duration-200 ${
                    isOpen ? "rotate-45 bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  &#10010;
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}