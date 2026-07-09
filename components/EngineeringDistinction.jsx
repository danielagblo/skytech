'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EngineeringDistinction() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const leftContent = el.querySelector('.distinction-left');
    const rightContent = el.querySelector('.distinction-right');
    const cards = el.querySelectorAll('.distinction-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=150px',
        toggleActions: 'play none none none',
      }
    });

    // Set initial GSAP states dynamically
    gsap.set([leftContent, rightContent], { opacity: 0, y: 20 });
    gsap.set(cards, { opacity: 0, y: 15 });

    // Animate header parts and cards in timeline sequence
    tl.to(leftContent, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .to(rightContent, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.3');

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white border-t border-slate-50">
      <div className="section-shell space-y-16">
        {/* Top Header Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 distinction-left">
            <span className="text-blue-600 text-[10px] font-extrabold uppercase tracking-[0.3em]">Recognition</span>
            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Trusted by <br />
              <span className="text-blue-600 font-extrabold">businesses in Ghana</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              We've built a reputation for delivering quality digital products on time. Our track record speaks for itself.
            </p>
          </div>
          <div className="relative flex justify-center lg:justify-end distinction-right">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-200/50 animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="w-full h-full bg-blue-50/50 rounded-full flex items-center justify-center border border-blue-100 shadow-inner relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-cyan-400/5 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-48 h-48 md:w-64 md:h-64 transition-transform duration-700 group-hover:scale-110 mix-blend-multiply">
                    <Image
                      src="/images/awards.png"
                      alt="Skytech Engineering Award"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distinction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              category: "Industry Recognition",
              title: "Best Web & Mobile Development Agency 2023",
              desc: "Recognized for delivering high-quality websites and mobile apps for businesses across Ghana and West Africa.",
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              )
            },
            {
              category: "Quality Service",
              title: "Top-Rated Digital Solutions Partner",
              desc: "Voted as a trusted partner for building secure, scalable websites, mobile apps, and digital platforms.",
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )
            },
            {
              category: "Client Trust",
              title: "Ghana's Most Trusted Digital Partner 2022",
              desc: "Awarded for consistent quality, transparent communication, and reliable delivery on digital projects.",
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )
            }
          ].map((award, idx) => (
            <div key={idx} className="group p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500 distinction-card">
              <div className="mb-8 w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                {award.icon}
              </div>
              <div className="space-y-4">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-blue-600/60">{award.category}</span>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {award.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {award.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

