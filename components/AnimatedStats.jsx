'use client';

import { useState, useEffect, useRef } from 'react';

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
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  
  const numMatch = value.match(/^[<>]?([0-9.]+)/);
  const target = numMatch ? parseFloat(numMatch[1]) : 0;
  const suffix = value.replace(/^[<>]?[0-9.]+/, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(target % 1 === 0 ? Math.floor(start) : parseFloat(start.toFixed(1)));
            }
          }, 16);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [target]);

  const displayCount = value.startsWith('0') && count < 10 && count >= 0 
    ? `0${count}` 
    : count;

  return (
    <div className="relative flex-1 flex flex-col items-center px-4">
      <div ref={countRef} className="flex flex-col items-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-10 h-10">
            {icons[label] || (
              <svg className="w-full h-full" fill="none" stroke="#00AEEF" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            )}
          </div>
        </div>

        {/* Value */}
        <div className="flex items-start mb-1">
          <span className="text-3xl lg:text-4xl font-black text-[#0B1521] tracking-tighter">
            {displayCount}
          </span>
          <span className="text-lg lg:text-xl font-bold text-[#0B1521] mt-1">
            {suffix}
          </span>
        </div>
        
        {/* Label */}
        <p className="text-[10px] lg:text-[11px] text-[#4A5568] text-center font-medium max-w-[150px] leading-tight">
          {label}
        </p>
      </div>

      {/* Vertical Divider */}
      {!isLast && (
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-slate-100" />
      )}
    </div>
  );
}

export default function AnimatedStats({ stats }) {
  return (
    <section className="bg-white py-20 relative overflow-hidden">
      <div className="section-shell">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-y-12 md:gap-y-0">
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
