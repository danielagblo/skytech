"use client";

import { useState } from "react";
import Link from "next/link";

export default function FAQPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="section-shell max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <span className="pill">Support</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600">
            Everything you need to know about our process, pricing, and services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="glass-panel rounded-[2.5rem] p-12 text-center space-y-6 border-slate-100 bg-slate-50/50">
          <h2 className="text-2xl font-bold text-slate-900">Still have questions?</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Can't find the answer you're looking for? Reach out to our team and we'll get back to you as soon as possible.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/site/contact" className="btn-primary">Contact Support</Link>
            <Link href="/site/services" className="btn-secondary">View Services</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function AccordionItem({ question, answer }) {
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

const faqs = [
  {
    question: "How long does a typical website project take?",
    answer: "Project timelines vary based on complexity. A Basic Website usually takes 3-8 weeks, while more complex E-commerce or Corporate platforms can take 3-6 months. We agree on a timeline during the planning phase and provide weekly updates.",
  },
  {
    question: "Do you offer custom app development for both iOS and Android?",
    answer: "Yes, we specialize in cross-platform development (typically using React Native or Flutter) which allows us to build high-performance apps for both iOS and Android simultaneously, saving you time and budget.",
  },
  {
    question: "What is included in your SEO Growth Plan?",
    answer: "Our SEO Growth Plan includes keyword research and ranking, high-quality backlink building, blog content creation, technical SEO audits, and monthly performance reports to track your growth and ROI.",
  },
  {
    question: "Do I own the code and design once the project is finished?",
    answer: "Absolutely. Once final payment is made, you own full intellectual property rights to the custom code, designs, and assets created for your project. We also provide documentation for easy handover.",
  },
  {
    question: "What kind of support do you offer after launch?",
    answer: "We provide dedicated support periods (ranging from 1 to 6 months depending on the package) to fix any bugs and ensure everything runs smoothly. We also offer ongoing maintenance retainers for long-term support.",
  },
  {
    question: "Can you help with rebranding or logo design?",
    answer: "Yes, we often include brand kit creation (logos, typography, color palettes) as part of our Premium Corporate and App packages to ensure a cohesive digital identity across all platforms.",
  },
];
