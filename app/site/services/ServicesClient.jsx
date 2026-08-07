"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ServicesClient({ servicesContent, whoWeWorkFor, engagements, stack }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Web', 'Mobile'];

  const filteredServices = activeFilter === 'All'
    ? whoWeWorkFor
    : whoWeWorkFor.filter(s => s.types?.includes(activeFilter));

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-slate-950 text-white pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.3), transparent 50%), radial-gradient(circle at 70% 30%, rgba(56,189,248,0.2), transparent 50%)'
          }} />
        </div>

        <div className="section-shell relative z-10 mx-auto max-w-4xl space-y-6 text-center">
          <span className="pill bg-white/10 text-brand-300 border-white/10">Our Services</span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {servicesContent.heroTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300">
            {servicesContent.heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/site/contact" className="btn-primary border border-white/20">
              Start a Project
            </Link>
            <Link href="/site/services/security-systems" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white transition-all hover:bg-white/10">
              Security Systems →
            </Link>
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="py-24 bg-white">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">What We Build</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              {servicesContent.whatWeDoTitle}
            </h2>
            <p className="text-lg text-slate-600">
              {servicesContent.whatWeDoSubtitle}
            </p>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredServices.map((service, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-soft transition-all duration-500 hover:shadow-lift hover:shadow-brand-600/5 hover:border-brand-100"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-all group-hover:bg-brand-600 group-hover:text-white">
                  {service.icon}
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-600">
                  {service.name}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 bg-slate-50">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">How We Work</span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              {servicesContent.engagementTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {engagements.map((engagement, idx) => (
              <div
                key={idx}
                className="space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-soft transition-all duration-500 hover:shadow-lift"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{engagement.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{engagement.description}</p>
                <ul className="space-y-2">
                  {engagement.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-white">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">Technology</span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Our Tech Stack
            </h2>
            <p className="text-slate-600 text-lg">
              We use modern, battle-tested tools to build reliable digital products.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {stack.map((tech, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:bg-white hover:shadow-soft"
              >
                <div className="relative h-10 w-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-center text-[10px] font-semibold text-slate-500 transition-colors group-hover:text-slate-900">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-24">
        <div className="section-shell">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-12 text-center shadow-soft lg:p-20">
            <div className="relative z-10 mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                Ready to start your project?
              </h2>
              <p className="text-lg leading-relaxed text-brand-100">
                Get in touch and we&apos;ll give you a clear plan and honest estimate.
              </p>
              <Link href="/site/contact" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-brand-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-lift">
                Contact Us Today
              </Link>
            </div>
            <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/4 translate-y-1/3 rounded-full bg-white/5" />
          </div>
        </div>
      </section>
    </main>
  );
}
