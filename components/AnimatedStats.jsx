'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const icons = {
  "10 years on the Ghanaian market": (
    <svg className="w-10 h-10" fill="none" stroke="#00AEEF" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12 A8 8 0 1 0 4 12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l-2 2m2-2l2 2" />
    </svg>
  ),
  "Satisfied customers": (
    <svg className="w-10 h-10" fill="none" stroke="#00AEEF" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
    </svg>
  ),
  "Unique projects and still counting": (
    <svg className="w-10 h-10" fill="none" stroke="#00AEEF" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  "Continental experience": (
    <svg className="w-10 h-10" fill="none" stroke="#00AEEF" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
};

function Counter({ value, label, isLast }) {
  const numMatch = value.match(/^[<>]?([0-9.]+)/);
  const target = numMatch ? parseFloat(numMatch[1]) : 0;
  const suffix = value.replace(/^[<>]?[0-9.]+/, '');
  const prefix = value.startsWith('0') ? '0' : '';

  return (
    <div className="relative flex-1 flex flex-col items-center px-4 stat-counter-item">
      <div className="flex flex-col items-center text-center">
        {/* Value */}
        <div className="flex items-baseline justify-center mb-2">
          <span 
            className="text-5xl md:text-6xl font-black text-[#0B1521] tracking-tight counter-value-num"
            data-target={target}
            data-prefix={prefix}
          >
            0
          </span>
          <span className="text-2xl md:text-3xl font-extrabold text-[#0B1521] ml-0.5">
            {suffix}
          </span>
        </div>
        
        {/* Label */}
        <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.15em] text-[#0b172a]/80 text-center max-w-[180px] leading-snug">
          {label}
        </p>
      </div>

      {/* Vertical Divider */}
      {!isLast && (
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-20 w-px bg-slate-100" />
      )}
    </div>
  );
}

export default function AnimatedStats({ stats }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = el.querySelectorAll('.stat-counter-item');
    if (items.length === 0) return;

    // Set initial position for staggered slide up
    gsap.set(items, { opacity: 0, y: 45 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=250px',
        toggleActions: 'play reverse play reverse',
      }
    });

    items.forEach((item, idx) => {
      const numEl = item.querySelector('.counter-value-num');
      if (!numEl) return;

      const targetVal = parseFloat(numEl.getAttribute('data-target')) || 0;
      const prefix = numEl.getAttribute('data-prefix') || '';
      const obj = { val: 0 };

      // Slide up + Fade in and Count up in parallel, staggered one by one
      tl.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, idx * 0.22); // staggered delay

      tl.to(obj, {
        val: targetVal,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          const currentVal = targetVal % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(1);
          numEl.innerText = (prefix && currentVal < 10) ? `${prefix}${currentVal}` : currentVal;
        }
      }, idx * 0.22); // starts counting exactly as it begins to slide up
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="bg-white py-16 md:py-20 relative overflow-hidden">
      <div className="section-shell">
        <div className="grid grid-cols-2 md:flex md:flex-row items-stretch justify-between gap-y-12 md:gap-y-0 gap-x-4">
          {stats.map((stat, idx) => (
            <Counter 
              key={stat.label} 
              {...stat} 
              isLast={idx === stats.length - 1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
