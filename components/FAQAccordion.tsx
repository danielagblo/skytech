'use client';

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => (
        <AccordionItem key={idx} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
}

function AccordionItem({ question, answer }: FAQ) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-3xl border transition-all duration-300 ${isOpen ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-8 py-6 flex items-center justify-between gap-4"
      >
        <span className="text-lg font-bold text-slate-900">{question}</span>
        <span className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border border-slate-200 bg-white transition-transform duration-300 ${isOpen ? 'rotate-180 border-blue-200 text-blue-600' : 'text-slate-400'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 pb-8 text-slate-600 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}
