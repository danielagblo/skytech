"use client";

import { useState } from 'react';

export default function FAQAccordion({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No FAQs available yet.</p>
      </div>
    );
  }

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className={`rounded-2xl border transition-all duration-300 ${
            openIndex === idx
              ? 'bg-white border-blue-200 shadow-lg shadow-blue-500/5'
              : 'bg-white border-slate-100 hover:border-slate-200'
          }`}
        >
          <button
            onClick={() => toggle(idx)}
            className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
          >
            <span className={`font-semibold transition-colors pr-4 ${
              openIndex === idx ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
            }`}>
              {faq.question}
            </span>
            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              openIndex === idx
                ? 'bg-blue-600 text-white rotate-180'
                : 'bg-slate-100 text-slate-500'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
