'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}


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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const sidebarBtns = el.querySelectorAll('.faq-sidebar-btn');
    const accordionItems = el.querySelectorAll('.faq-accordion-item');

    gsap.set(sidebarBtns, { opacity: 0, x: -15 });
    gsap.set(accordionItems, { opacity: 0, x: 15 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=150px',
        toggleActions: 'play none none none',
      }
    });

    tl.to(sidebarBtns, { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' })
      .to(accordionItems, { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, '-=0.35');

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Stagger entry when switching active categories
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const accordionItems = el.querySelectorAll('.faq-accordion-item');
    if (accordionItems.length > 0) {
      gsap.fromTo(accordionItems,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  }, [activeCategory]);

  if (faqs.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400">
        No FAQs available at the moment.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Dynamic Background Decorative Blobs - Carefully placed to match image */}
      <div className="absolute top-1/4 -left-32 w-[35rem] h-[35rem] bg-pink-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-100/30 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-purple-100/20 rounded-full blur-[100px] -z-10" />

      {/* Floating accent dots from the image */}
      <div className="absolute top-20 left-[15%] w-3 h-3 bg-blue-400/30 rounded-full blur-sm" />
      <div className="absolute bottom-40 right-[10%] w-4 h-4 bg-cyan-400/20 rounded-full blur-sm" />
      <div className="absolute top-1/2 right-12 w-2 h-2 bg-pink-400/20 rounded-full blur-xs" />

      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-slate-100/50">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Categories Sidebar */}
          <div className="lg:w-[35%] space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-8 py-5 rounded-2xl transition-all duration-400 flex items-center justify-between group faq-sidebar-btn ${activeCategory === category
                    ? 'bg-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] border border-slate-100 ring-1 ring-slate-100/50'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <span className={`text-base font-bold transition-colors duration-300 ${activeCategory === category ? 'text-slate-800' : ''}`}>
                  {category}
                </span>
                <svg
                  className={`w-4 h-4 transition-all duration-300 ${activeCategory === category ? 'text-slate-400' : 'text-slate-300 group-hover:translate-x-1'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* Accordion Content */}
          <div className="lg:w-[65%] space-y-3">
            {currentFaqs.map((faq, idx) => (
              <div key={idx} className="faq-accordion-item">
                <AccordionItem question={faq.question} answer={faq.answer} />
              </div>
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
    <div className={`rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen
        ? 'bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border border-slate-100'
        : 'bg-[#f8faff] border border-transparent hover:border-slate-200'
      }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-8 py-6 md:px-10 md:py-7 flex items-center justify-between gap-6"
      >
        <span className={`text-[15px] md:text-[17px] font-bold transition-colors duration-500 leading-snug ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>
          {question}
        </span>
        <span className={`shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-0' : 'rotate-0'}`}>
          {isOpen ? (
            <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
            </svg>
          )}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 pb-8 md:px-10 md:pb-10 text-slate-500 leading-relaxed text-[14px] md:text-[15px]">
          {answer}
        </div>
      </div>
    </div>
  );
}
