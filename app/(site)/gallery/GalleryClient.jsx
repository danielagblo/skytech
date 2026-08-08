"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GalleryClient({ projects }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const headerItems = el.querySelectorAll('.gallery-header-el');
    const projectCards = el.querySelectorAll('.project-card');

    // Set initial GSAP states
    gsap.set(headerItems, { opacity: 0, y: 35 });
    gsap.set(projectCards, { opacity: 0, y: 30 });

    // 1. Header reveal
    gsap.to(headerItems, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1 });

    // 2. Project cards reveal
    gsap.to(projectCards, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.gallery-grid-container',
        start: 'top bottom-=150px',
        toggleActions: 'play none none none',
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen pt-24 pb-20 bg-white">
      <div className="section-shell space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="pill border-brand-600/20 text-brand-600 bg-brand-50 uppercase tracking-[0.2em] text-[10px] font-bold gallery-header-el">Portfolio</span>
          <h1 className="text-4xl lg:text-5xl leading-tight text-slate-900 font-light gallery-header-el">
            Our Work <span className="font-extrabold text-brand-600">in Action</span>
          </h1>
          <p className="text-lg text-slate-600 gallery-header-el">
            A selection of projects where we've helped businesses transform their digital presence.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gallery-grid-container">
            {projects.map((project, idx) => (
              <div
                key={project._id || idx}
                className="group relative overflow-hidden rounded-none bg-slate-100 border border-slate-200 aspect-[4/5] hover:shadow-2xl transition-all duration-500 project-card"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium italic">
                    {project.category} Project Image
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block px-3 py-1 rounded-none bg-slate-950 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {project.description}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-white font-semibold text-sm hover:gap-3 transition-all"
                  >
                    View Case Study
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-none text-slate-400">
            No projects in the gallery yet. Check back soon.
          </div>
        )}
      </div>
    </main>
  );
}
