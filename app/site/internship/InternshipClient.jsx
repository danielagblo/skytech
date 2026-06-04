"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InternshipFormClient from "../../../components/InternshipFormClient";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InternshipClient({ internshipContent }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Elements
    const heroElements = el.querySelectorAll('.internship-hero-el');
    const infoCards = el.querySelectorAll('.info-card-block');
    const formCard = el.querySelector('.form-card-block');

    // Initial GSAP states
    gsap.set(heroElements, { opacity: 0, y: 35 });
    gsap.set(infoCards, { opacity: 0, y: 30 });
    gsap.set(formCard, { opacity: 0, x: 30 });

    // 1. Hero Animations
    gsap.to(heroElements, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1 });

    // 2. Info Cards and Form
    const tlMain = gsap.timeline({
      scrollTrigger: {
        trigger: '.internship-form-section',
        start: 'top bottom-=150px',
        toggleActions: 'play reverse play reverse',
      }
    });
    tlMain.to(infoCards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: 'power2.out' })
          .to(formCard, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white text-slate-900 py-24 px-4 border-b border-slate-100">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-blue-600/5 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/5 blur-3xl" />
        </div>
        <div className="section-shell relative space-y-6">
          <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-bold internship-hero-el">Internship / Attachment</span>
          <h1 className="text-4xl lg:text-5xl leading-tight max-w-3xl text-slate-900 font-light internship-hero-el">
            Apply for an <span className="font-extrabold text-blue-600">internship</span> <br />
            or <span className="font-extrabold text-slate-950">attachment.</span>
          </h1>
          <p className="text-lg text-slate-505 max-w-3xl font-medium text-slate-500 internship-hero-el">{internshipContent.heroSubtitle || "Fill the form below. We will review your request and contact you."}</p>
        </div>
      </section>

      <section className="py-20 bg-white internship-form-section">
        <div className="section-shell grid grid-cols-1 lg:grid-cols-[0.9fr,1.1fr] gap-12">
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6 info-card-block">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">{internshipContent.whoCanApplyTitle || "Who can apply"}</h2>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />Students or recent graduates</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />Basic skills in web or mobile</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />Ready to learn and work with a team</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-slate-900 text-white p-6 space-y-3 info-card-block">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-200">{internshipContent.responseTimeLabel || "Response time"}</p>
              <p className="text-lg">{internshipContent.responseTimeText || "We reply within 1–3 business days."}</p>
              <p className="text-sm text-white/80">Mon–Fri, 9am–6pm</p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 form-card-block">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{internshipContent.formTitle || "Internship form"}</h2>
            <p className="text-sm text-slate-600 mb-6">{internshipContent.formSubtitle || "Please fill in your details."}</p>
            <InternshipFormClient />
          </div>
        </div>
      </section>
    </main>
  );
}
