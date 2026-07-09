'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedHero({ imageUrl, title, subtitle }) {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const titleRef = useRef(null);
  const tagRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 })
        .fromTo(tagRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35')
        .fromTo(buttonsRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');

      // 2. Parallax Scroll Animation
      gsap.to(bgRef.current, {
        yPercent: 20,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative overflow-hidden bg-white text-slate-900 min-h-screen flex items-center"
    >
      {/* Parallax Background */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 will-change-transform scale-110"
      >
        <Image
          src={imageUrl}
          alt="Skytech Tech Infrastructure"
          fill
          className="object-cover opacity-100"
          priority
        />
        {/* Dark Overlay - Left Aligned Gradient */}
        <div className="absolute inset-0 bg-slate-900/40 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent z-0 pointer-events-none" />
      </div>

      <div className="relative z-10 pt-20 pl-4 sm:pl-8 lg:pl-16 w-full">
        <div className="flex items-center justify-start min-h-[70vh]">
          <div className="max-w-6xl space-y-12 text-left flex flex-col items-start">
            <div className="space-y-8">
              {/* Animated Title */}
              <h1 
                ref={titleRef}
                className="text-4xl lg:text-6xl leading-[1.1] tracking-tight text-white font-light opacity-0"
              >
                World Class <br />
                <span className="font-extrabold text-white">Software solutions</span> <br />
                for all <span className="font-extrabold text-blue-400">businesses.</span>
              </h1>

              {/* Animated Tag/Subtitle */}
              <div 
                ref={tagRef}
                className="inline-flex flex-col items-start rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden opacity-0"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10 w-full">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
                    {subtitle}
                  </span>
                </div>
                <div className="px-5 py-3">
                  <p className="text-sm sm:text-base text-white font-bold tracking-tight">
                    Get a website that ranks No. 1 on Google.
                  </p>
                </div>
              </div>
            </div>

            {/* Animated Action Buttons */}
            <div 
              ref={buttonsRef}
              className="flex flex-wrap justify-start gap-6 pt-4 opacity-0"
            >
              <Link
                className="btn-primary px-10 py-5 text-base font-bold rounded-full shadow-2xl shadow-blue-600/20 active:scale-95 transition-all"
                href="/site/contact"
              >
                Start Your Project
              </Link>
              <Link
                className="btn-secondary bg-white text-blue-600 border-none hover:bg-slate-50 px-10 py-5 text-base font-bold rounded-full shadow-lg transition-all active:scale-95"
                href="/site/pricing"
              >
                View Rate Card
              </Link>
            </div>
          </div>
        </div>

        {/* Bouncing Scroll Arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/40 to-white/0" />
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
