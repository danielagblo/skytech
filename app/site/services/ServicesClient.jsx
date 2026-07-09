"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesClient({ servicesContent, whoWeWorkFor, engagements, stack }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Elements
    const heroElements = el.querySelectorAll('.services-hero-el');
    const verticalsHeader = el.querySelectorAll('.verticals-header > *');
    const verticalCards = el.querySelectorAll('.vertical-card');
    const stackHeader = el.querySelectorAll('.service-stack-header > *');
    const serviceCards = el.querySelectorAll('.service-card');
    const engagementHeader = el.querySelectorAll('.engagement-header > *');
    const engagementCards = el.querySelectorAll('.engagement-card');
    const toolsHeader = el.querySelectorAll('.tools-header > *');
    const toolBadgeCards = el.querySelectorAll('.tool-badge-card');
    const ctaHeader = el.querySelectorAll('.cta-header > *');

    // Initial GSAP states
    gsap.set(heroElements, { opacity: 0, y: 35 });
    gsap.set(verticalsHeader, { opacity: 0, y: 30 });
    gsap.set(verticalCards, { opacity: 0, y: 25 });
    gsap.set(stackHeader, { opacity: 0, y: 30 });
    gsap.set(serviceCards, { opacity: 0, y: 25 });
    gsap.set(engagementHeader, { opacity: 0, y: 30 });
    gsap.set(engagementCards, { opacity: 0, y: 25 });
    gsap.set(toolsHeader, { opacity: 0, y: 30 });
    gsap.set(toolBadgeCards, { opacity: 0, scale: 0.85, opacity: 0 });
    gsap.set(ctaHeader, { opacity: 0, y: 35 });

    // 1. Hero Animations
    gsap.to(heroElements, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1 });

    // 2. Verticals
    const tlVerticals = gsap.timeline({
      scrollTrigger: {
        trigger: '.verticals-section',
        start: 'top bottom-=150px',
        toggleActions: 'play reverse play reverse',
      }
    });
    tlVerticals.to(verticalsHeader, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' })
               .to(verticalCards, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out' }, '-=0.4');

    // 3. Service Stack
    const tlStack = gsap.timeline({
      scrollTrigger: {
        trigger: '.service-stack-section',
        start: 'top bottom-=150px',
        toggleActions: 'play reverse play reverse',
      }
    });
    tlStack.to(stackHeader, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' })
           .to(serviceCards, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power2.out' }, '-=0.4');

    // 4. Engagements
    const tlEngage = gsap.timeline({
      scrollTrigger: {
        trigger: '.engagement-section',
        start: 'top bottom-=150px',
        toggleActions: 'play reverse play reverse',
      }
    });
    tlEngage.to(engagementHeader, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' })
            .to(engagementCards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '-=0.4');

    // 5. Tools Grid
    const tlTools = gsap.timeline({
      scrollTrigger: {
        trigger: '.tools-section',
        start: 'top bottom-=150px',
        toggleActions: 'play reverse play reverse',
      }
    });
    tlTools.to(toolsHeader, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' })
           .to(toolBadgeCards, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(1.2)' }, '-=0.4');

    // 6. CTA Section
    gsap.to(ctaHeader, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top bottom-=180px',
        toggleActions: 'play reverse play reverse',
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-white">
      {/* Hero Section (The Capability Statement) */}
      <section className="relative overflow-hidden bg-white text-slate-900 py-32 px-4 border-b border-slate-100">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute left-10 -top-10 h-[500px] w-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-[500px] w-[500px] bg-cyan-400/5 rounded-full blur-[120px]" />
        </div>

        <div className="section-shell relative space-y-10">
          <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-bold services-hero-el">Our Capabilities</span>
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl lg:text-6xl leading-[1.1] tracking-tight text-slate-900 font-light services-hero-el">
              Websites, apps, <span className="font-extrabold text-blue-600">SEO</span> <br />
              <span className="font-extrabold text-slate-950">& maintenance — all in one place.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium services-hero-el">
              {servicesContent.heroSubtitle || "We build fast, secure websites and mobile apps. We also help you rank on Google and keep your site running smoothly."}
            </p>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-24 bg-white border-b border-slate-100 verticals-section">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4 verticals-header">
            <span className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.3em]">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">What We Do.</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We offer a full range of digital services — from building new websites and apps to improving and maintaining existing ones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whoWeWorkFor.map((item) => (
              <div key={item.name} className="group p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 vertical-card">
                <div className="mb-6 w-12 h-12 rounded-xl bg-blue-600/5 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.name}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  {item.types.map((type) => (
                    <span key={type} className="text-[9px] font-black uppercase tracking-widest text-blue-600/60">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Architectures (The Grid) */}
      <section className="py-24 bg-slate-50 service-stack-section">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4 service-stack-header">
            <span className="pill bg-white border-slate-200 text-slate-500 uppercase tracking-widest text-[9px] font-bold">Our Process</span>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">{servicesContent.whatWeDoTitle || "What We Build."}</h2>
            <p className="text-lg text-slate-600">{servicesContent.whatWeDoSubtitle || "From simple business websites to full online stores and mobile apps — we handle the full process."}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stack.slice(0, 4).map((service, idx) => (
              <div key={service.name + idx} className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl transition-all duration-500 service-card">
                <div className="flex items-start justify-between mb-8">
                  <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">⚡</span>
                  <span className="h-2 w-2 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">{service.name}</h3>
                <p className="text-slate-555 text-sm md:text-base leading-relaxed text-slate-500 mb-6">
                  {service.name} — built with modern tools, tested thoroughly, and delivered on time.
                </p>
                <div className="pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                  <span>Learn More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 bg-white engagement-section">
        <div className="section-shell space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 border-b border-slate-100 pb-10 engagement-header">
            <div className="space-y-4">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em]">How We Work</span>
              <h2 className="text-4xl font-black text-slate-900 leading-tight">{servicesContent.engagementTitle || "Simple Process, Clear Results."}</h2>
            </div>
            <p className="text-slate-600 max-w-xl text-sm leading-relaxed">
              Whether you need a new site, improvements to an existing one, or ongoing support — we have a plan for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engagements.map((item) => (
              <div key={item.title} className="group p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all engagement-card">
                <h3 className="text-xl font-black text-slate-900 mb-4">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed italic">"{item.description}"</p>
                <ul className="space-y-4">
                  {item.items.map((line) => (
                    <li key={line} className="flex items-center gap-3 text-xs font-bold text-slate-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Infrastructure (Tech Stack) */}
      <section className="py-24 bg-slate-50 tools-section">
        <div className="section-shell space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4 tools-header">
            <span className="pill bg-white border-slate-200 text-slate-500 uppercase tracking-widest text-[9px] font-black">Tech Stack</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Technologies We Use.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {stack.map((tech) => (
              <div key={tech.name} className="group p-6 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center gap-4 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-500 tool-badge-card">
                <div className="relative w-10 h-10 transition-all duration-500 group-hover:scale-110">
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="w-full h-full object-contain transition-all duration-500"
                  />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (The Lead Path) */}
      <section className="py-24 bg-slate-950 relative overflow-hidden cta-section">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px]" />
        <div className="section-shell relative z-10 text-center space-y-10 cta-header">
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="pill border-blue-600/20 text-blue-400 bg-blue-600/10 uppercase tracking-[0.2em] text-[10px] font-black">Get Started</span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              {servicesContent.ctaTitle || "Ready to build something great?"}
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              {servicesContent.ctaSubtitle || "Tell us about your project. We'll give you a clear plan and a fixed price."}
            </p>
          </div>

          <div className="flex justify-center gap-4 flex-wrap pt-6">
            <a href="/site/contact" className="px-10 py-5 bg-blue-600 text-white rounded-full font-black text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
              Start Your Project
            </a>
            <a href="/site/pricing" className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-black text-base hover:bg-white/10 transition-all">
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
