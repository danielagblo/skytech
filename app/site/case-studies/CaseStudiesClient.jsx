"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CaseStudiesClient({ projects }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Elements
    const heroElements = el.querySelectorAll('.case-hero-el');
    const caseItems = el.querySelectorAll('.case-study-item');
    const ctaHeader = el.querySelectorAll('.case-cta-el');

    // Initial GSAP states
    gsap.set(heroElements, { opacity: 0, y: 35 });
    gsap.set(ctaHeader, { opacity: 0, y: 35 });

    // 1. Hero Entrance
    gsap.to(heroElements, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1 });

    // 2. Individual Case Study Item Animations on scroll
    caseItems.forEach((item) => {
      const visualSpotlight = item.querySelector('.visual-spotlight');
      const textNarrative = item.querySelectorAll('.text-narrative > *');

      // Set initial states for child elements
      gsap.set(visualSpotlight, { opacity: 0, scale: 0.95, y: 20 });
      gsap.set(textNarrative, { opacity: 0, y: 25 });

      const tlItem = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top bottom-=150px',
          toggleActions: 'play reverse play reverse',
        }
      });

      tlItem.to(visualSpotlight, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power2.out' })
            .to(textNarrative, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' }, '-=0.4');
    });

    // 3. Global CTA Section
    gsap.to(ctaHeader, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.case-cta-section',
        start: 'top bottom-=180px',
        toggleActions: 'play reverse play reverse',
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-white pt-32 pb-24">
      <div className="section-shell space-y-32">
        {/* Header Block */}
        <div className="max-w-4xl space-y-6">
          <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-bold case-hero-el">Proven Architectures</span>
          <h1 className="text-4xl lg:text-6xl leading-[1.1] tracking-tight text-slate-900 font-light case-hero-el">
            Engineering <span className="font-extrabold text-blue-600">results,</span> <br />
            <span className="font-extrabold text-slate-950">not just features.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium case-hero-el">
            A forensic selection of technical deployments where we combined elite engineering with measurable business impact.
          </p>
        </div>

        {/* Impact List */}
        <div className="space-y-40">
          {projects.length > 0 ? (
            projects.map((study, idx) => (
              <div key={study._id || idx} className={`flex flex-col lg:flex-row gap-16 items-center case-study-item ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Visual Spotlight */}
                <div className="w-full lg:w-1/2 group relative visual-spotlight">
                  <div className="aspect-[16/10] rounded-[3rem] bg-slate-50 border border-slate-100 overflow-hidden relative shadow-2xl shadow-blue-600/5">
                    {study.image ? (
                      <img 
                        src={study.image} 
                        alt={study.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200 font-extrabold text-2xl uppercase tracking-[0.2em] -rotate-12">
                        Technical Blueprint
                      </div>
                    )}
                    <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors z-10" />
                  </div>
                  {/* Impact Chip */}
                  <div className="absolute -bottom-6 -right-6 lg:right-auto lg:-left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 mb-1">Impact Result</p>
                    <p className="text-xl font-extrabold text-slate-900">{study.impact || "Accelerated Growth"}</p>
                  </div>
                </div>

                {/* Technical Narrative */}
                <div className="w-full lg:w-1/2 space-y-8 text-narrative">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">{study.category}</span>
                      <div className="h-px flex-1 bg-slate-100" />
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-600">{study.client || "Global Brand"}</span>
                    </div>
                    <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{study.title}</h3>
                    <p className="text-lg text-slate-500 leading-relaxed font-medium">
                      {study.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {study.metrics?.map(metric => (
                      <span key={metric} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
                        {metric}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6">
                    <Link href="/site/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-extrabold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
                      Request Technical Demo
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-400">
              No case studies published yet. Add them in the dashboard.
            </div>
          )}
        </div>

        {/* Global CTA */}
        <div className="rounded-[4rem] bg-slate-950 p-16 md:p-24 text-center space-y-10 relative overflow-hidden case-cta-section">
          <div className="absolute inset-0 bg-blue-600/10 blur-[120px]" />
          <div className="relative z-10 space-y-4 max-w-3xl mx-auto case-cta-el">
            <span className="text-blue-400 text-[10px] font-extrabold uppercase tracking-[0.4em]">Future Proofing</span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white">Your architecture <br /> is next.</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Join the brands that prioritized technical integrity and measurable growth. Let's build your technical legacy.
            </p>
          </div>
          <div className="relative z-10 case-cta-el">
            <Link href="/site/contact" className="inline-flex items-center gap-3 px-12 py-6 bg-blue-600 text-white rounded-full font-extrabold text-lg hover:bg-white hover:text-slate-955 transition-all shadow-2xl shadow-blue-600/20">
              Start Technical Audit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
