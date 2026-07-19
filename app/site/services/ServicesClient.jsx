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

        <div className="section-shell relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="pill bg-white/10 text-blue-300 border-white/10">Our Services</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            {servicesContent.heroTitle}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {servicesContent.heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/site/contact" className="btn-primary">
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
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((service, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-3xl bg-white border border-slate-100 hover:shadow-xl hover:shadow-blue-600/5 hover:border-blue-100 transition-all duration-500"
              >
                <div className="mb-6 w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engagements.map((engagement, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-slate-100 hover:shadow-xl transition-all duration-500 space-y-6"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{engagement.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{engagement.description}</p>
                <ul className="space-y-2">
                  {engagement.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {stack.map((tech, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:bg-white transition-all duration-300 group"
              >
                <div className="relative w-10 h-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-900 transition-colors text-center">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50">
        <div className="section-shell">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 p-12 lg:p-20 text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Ready to start your project?
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Get in touch and we&apos;ll give you a clear plan and honest estimate.
              </p>
              <Link href="/site/contact" className="inline-flex items-center justify-center rounded-full bg-white text-blue-600 px-8 py-4 font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
                Contact Us Today
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
          </div>
        </div>
      </section>
    </main>
  );
}
