'use client';

import { useState, useEffect, useRef } from 'react';

const icons = {
  "Projects delivered": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  "Avg. faster to MVP": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  "Client NPS": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.757c1.27 0 2.539.833 2.539 2.144 0 1.28-1.269 2.083-2.539 2.083H19.01M10 10H5.243c-1.27 0-2.539.833-2.539 2.144 0 1.28 1.269 2.083 2.539 2.083H4.99M15 11l-4 4-4-4" />
    </svg>
  ),
  "System Uptime": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "Active Tech Stacks": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  "Support Response": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

function Counter({ value, label }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  
  const numMatch = value.match(/^[<>]?([0-9.]+)/);
  const target = numMatch ? parseFloat(numMatch[1]) : 0;
  const prefix = value.startsWith('<') ? '<' : value.startsWith('>') ? '>' : '';
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

  return (
    <div ref={countRef} className="flex flex-col items-center group cursor-default">
      {/* Icon */}
      <div className="mb-4 text-slate-600 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110">
        <div className="w-8 h-8">
          {icons[label] || (
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
        </div>
      </div>

      {/* Top Value */}
      <span className="text-2xl lg:text-3xl font-black text-slate-900 tabular-nums tracking-tighter mb-4 transition-transform duration-300 group-hover:-translate-y-1">
        {prefix}{count}{suffix}
      </span>
      
      {/* Intersection Node */}
      <div className="relative h-px w-full bg-slate-100 group-hover:bg-slate-300 transition-colors duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-slate-200 bg-white scale-0 group-hover:scale-100 transition-transform duration-300" />
      </div>
      
      {/* Bottom Label */}
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-6 transition-colors duration-300 group-hover:text-slate-900">
        {label}
      </p>
    </div>
  );
}

export default function AnimatedStats({ stats }) {
  return (
    <section className="bg-white py-16 relative overflow-hidden border-b border-slate-50">
      {/* Static Central Axis Line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-100 -translate-y-1/2" />
      
      <div className="section-shell relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 lg:gap-y-0">
          {stats.map((stat) => (
            <Counter key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
