"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactFormClient from '../../../components/ContactFormClient';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactClient({ settings, teamMembers, contactContent }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Elements
    const heroElements = el.querySelectorAll('.contact-hero-el');
    const infoCards = el.querySelectorAll('.contact-info-card');
    const formCard = el.querySelector('.contact-form-card');
    const teamHeader = el.querySelectorAll('.team-header > *');
    const teamCards = el.querySelectorAll('.team-member-card');

    // Initial GSAP states
    gsap.set(heroElements, { opacity: 0, y: 35 });
    gsap.set(infoCards, { opacity: 0, y: 30 });
    gsap.set(formCard, { opacity: 0, x: 30 });
    gsap.set(teamHeader, { opacity: 0, y: 35 });
    gsap.set(teamCards, { opacity: 0, y: 25 });

    // 1. Hero Animations
    gsap.to(heroElements, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1 });

    // 2. Info Cards (Email, WhatsApp, Maps) and Form
    const tlContact = gsap.timeline({
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top bottom-=150px',
        toggleActions: 'play reverse play reverse',
      }
    });
    tlContact.to(infoCards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: 'power2.out' })
             .to(formCard, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');

    // 3. Team grid scrollTrigger
    const tlTeam = gsap.timeline({
      scrollTrigger: {
        trigger: '.contact-team-section',
        start: 'top bottom-=200px',
        toggleActions: 'play reverse play reverse',
      }
    });
    tlTeam.to(teamHeader, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
          .to(teamCards, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power2.out' }, '-=0.4');

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white text-slate-900 py-24 px-4 border-b border-slate-100">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute left-10 -top-10 h-72 w-72 rounded-full bg-blue-600/5 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/5 blur-3xl" />
        </div>
        <div className="section-shell relative space-y-6">
          <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-bold contact-hero-el">Contact</span>
          <h1 className="text-4xl lg:text-5xl leading-tight max-w-3xl text-slate-900 font-light contact-hero-el">
            Tell us what you <span className="font-extrabold text-blue-600">want to build.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl font-medium contact-hero-el">{contactContent.heroSubtitle || "We will reply fast and guide you step by step."}</p>
          <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 contact-hero-el">
            <span className="rounded-full bg-slate-50 px-4 py-2 border border-slate-100">Reply in 24 hours</span>
            <span className="rounded-full bg-slate-50 px-4 py-2 border border-slate-100">Remote team</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white contact-grid">
        <div className="section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr,1.1fr] gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6 contact-info-card">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-4">{contactContent.contactInfoTitle || "Contact information"}</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Email</h3>
                      <a href={`mailto:${settings.contactEmail}`} className="text-blue-700 text-sm font-semibold hover:underline">{settings.contactEmail}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📱</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Phone</h3>
                      <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="text-blue-700 text-sm font-semibold hover:underline">{settings.contactPhone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">💬</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">WhatsApp</h3>
                      <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} className="text-blue-700 text-sm font-semibold hover:underline">{settings.whatsapp}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📍</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Address</h3>
                      <p className="text-sm text-slate-600">{settings.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm contact-info-card">
                <iframe
                  title="skytechghana on Google Maps"
                  src="https://maps.google.com/maps?q=skytechghana&output=embed"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="rounded-3xl bg-slate-900 text-white p-6 space-y-4 contact-info-card">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-200">Quick call?</p>
                <p className="text-lg">Book a short call and tell us your idea.</p>
                <p className="text-sm text-white/80">Mon–Fri, 9am–6pm PT</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-panel rounded-3xl p-8 contact-form-card">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{contactContent.formTitle || "Tell us about your project"}</h2>
              <p className="text-sm text-slate-600 mb-6">{contactContent.formSubtitle || "Share what you need and when you want it done."}</p>
              <ContactFormClient />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-50 contact-team-section">
        <div className="section-shell space-y-8">
          <div className="space-y-2 team-header">
            <span className="pill">Meet the team</span>
            <h2 className="text-3xl font-extrabold text-slate-900">{contactContent.teamTitle || "Your Skytech Ghana leads"}</h2>
            <p className="text-slate-600 max-w-2xl">{contactContent.teamSubtitle || "Core leaders who guide delivery and keep communication smooth."}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((person) => (
              <div key={person._id} className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm team-member-card">
                <div className="flex items-center gap-4 mb-3">
                  {person.imageUrl ? (
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      className="h-12 w-12 rounded-full object-cover border border-slate-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100">
                      {person.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-900">{person.name}</p>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mt-1">
                      {person.role}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
