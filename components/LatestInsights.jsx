'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LatestInsights({ latestPosts }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const headerItems = el.querySelectorAll('.insights-header > *');
    const cards = el.querySelectorAll('.insight-card');

    // Set initial GSAP states dynamically
    gsap.set(headerItems, { opacity: 0, y: 35 });
    gsap.set(cards, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=150px',
        toggleActions: 'play none none none',
      }
    });

    tl.to(headerItems, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
      .to(cards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.25');

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white border-t border-slate-50">
      <div className="section-shell space-y-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 insights-header">
          <div className="space-y-4 max-w-2xl text-left">
            <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-widest text-[10px] font-bold">Latest Insights</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Latest from the lab
            </h2>
            <p className="text-lg text-slate-505 leading-relaxed text-slate-500">
              Strategies and insights from our engineering team to help you navigate the digital landscape.
            </p>
          </div>
          <Link className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold transition-all hover:bg-blue-600 active:scale-95 shadow-xl shadow-slate-900/10" href="/site/insights">
            Read All Entries
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.map((post, idx) => (
            <Link
              key={post._id || idx}
              href={`/site/insights/${post.slug}`}
              className="group flex flex-col bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 insight-card"
            >
              {/* Image Top */}
              {post.coverImage ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 border-b border-slate-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ) : (
                <div className="relative aspect-[16/10] bg-slate-50 flex items-center justify-center border-b border-slate-100">
                  <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">No Image</span>
                </div>
              )}

              {/* Content Area */}
              <div className="p-6 md:p-8 flex flex-col flex-grow space-y-4">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                  {post.category || 'INSIGHT'}
                </span>
                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                  {post.title}
                </h3>
                <p className="text-sm line-clamp-4 leading-relaxed text-slate-500">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
