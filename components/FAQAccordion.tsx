'use client';

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || 'General Questions';
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const categories = Object.keys(groupedFaqs);
  const [activeCategory, setActiveCategory] = useState(categories[0] || 'General Questions');

  const currentFaqs = groupedFaqs[activeCategory] || [];

  if (faqs.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400">
        No FAQs available at the moment.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Decorative Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl -z-10" />

      <div className="glass-panel rounded-[2.5rem] md:rounded-[3.5rem] p-4 md:p-10 border-slate-100/80 shadow-2xl shadow-blue-500/5 bg-white/70 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row gap-10 md:gap-16">
          {/* Categories Rail */}
          <div className="lg:w-[35%] space-y-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-8 py-6 rounded-2xl md:rounded-[2rem] transition-all duration-300 flex items-center justify-between group ${
                  activeCategory === category
                    ? 'bg-white shadow-xl shadow-blue-500/10 border border-slate-100 translate-x-2'
                    : 'text-slate-500 hover:bg-white/50 hover:translate-x-1'
                }`}
              >
                <span className={`text-base font-bold transition-colors ${activeCategory === category ? 'text-slate-900' : 'group-hover:text-slate-700'}`}>
                  {category}
                </span>
                <svg 
                  className={`w-5 h-5 transition-all duration-300 ${activeCategory === category ? 'text-blue-600 translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* Accordion Rail */}
          <div className="lg:w-[65%] space-y-4">
            {currentFaqs.map((faq, idx) => (
              <AccordionItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-2xl md:rounded-[2rem] border transition-all duration-500 ${isOpen ? 'border-blue-100 bg-white shadow-lg shadow-blue-500/5' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-8 py-7 md:px-10 flex items-center justify-between gap-6"
      >
        <span className={`text-base md:text-lg font-bold transition-colors duration-300 leading-tight ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>
          {question}
        </span>
        <span className={`shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12M6 12h12" />
            </svg>
          )}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 pb-8 md:px-10 md:pb-10 text-slate-500 leading-relaxed text-sm md:text-base">
          {answer}
        </div>
      </div>
    </div>
  );
}
