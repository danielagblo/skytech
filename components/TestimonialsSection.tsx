'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  company: string;
  rating?: number;
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const cards = el.querySelectorAll('.testimonial-card');
    const headerItems = el.querySelectorAll('.testimonials-header > *');

    // Set initial states dynamically
    gsap.set(cards, { opacity: 0, y: 30 });
    gsap.set(headerItems, { opacity: 0, y: 35 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=250px',
        toggleActions: 'play reverse play reverse',
      }
    });

    tl.to(headerItems, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
      .to(cards, { opacity: 1, y: 0, duration: 1.1, stagger: 0.2, ease: 'power2.out' }, '-=0.4');

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [showAll]);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="section-shell space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 testimonials-header">
          <div className="space-y-3">
            <span className="pill">Client outcomes</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              What partners say about us
            </h2>
            <p className="text-slate-600 max-w-2xl">
              We build long-term partnerships anchored on transparency, speed,
              and quality.
            </p>
          </div>
          {!showAll && testimonials.length > 3 && (
            <button 
              onClick={() => setShowAll(true)}
              className="btn-secondary w-fit"
            >
              View all testimonials
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTestimonials.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm hover:shadow-md transition-shadow testimonial-card"
            >
              <p className="text-slate-700 leading-relaxed mb-6 italic">
                "{item.quote}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.author}
                  </p>
                  <p className="text-sm text-slate-500">{item.company}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 border border-slate-100">
                  {Array(item.rating || 5)
                    .fill("⭐")
                    .join("")}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {showAll && (
          <div className="text-center pt-8">
            <button 
              onClick={() => setShowAll(false)}
              className="text-blue-600 font-bold text-sm hover:underline"
            >
              Show less
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
