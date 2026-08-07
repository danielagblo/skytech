"use client";

import React from 'react';
import Image from 'next/image';

const aboutStats = [
  { label: 'Projects Completed', value: '180+' },
  { label: 'Team Members', value: '14' },
  { label: 'Industries Served', value: '8' },
];

const timeline = [
  { year: '2020', title: 'The Start', detail: 'Skytech started with a goal to build better websites and apps in Ghana.' },
  { year: '2021', title: 'Mobile Apps', detail: 'We began building high-quality mobile apps that work perfectly on all phones.' },
  { year: '2023', title: 'Better Tools', detail: 'We built better tools to launch projects faster and more safely.' },
  { year: '2024', title: 'Top Partner', detail: 'Known as the best partner for building successful digital projects.' },
];

const processSteps = [
  {
    number: "01",
    title: "We Listen",
    description: "You tell us your goals. We ask questions and agree on the plan.",
    image: "/images/images/process-planning.png",
  },
  {
    number: "02",
    title: "We Build",
    description: "We design and build while keeping you updated each week.",
    image: "/images/images/process-development.png",
  },
  {
    number: "03",
    title: "We Launch & Support",
    description: "We launch, fix issues fast, and help you grow.",
    image: "/images/images/process-testing.png",
  },
];

export default function AboutClient({ teamMembers }) {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-b from-brand-50/60 to-white pt-32 pb-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-grid-light" />
          <Image
            src="/images/images/AboutBanner.png"
            alt="Skytech About"
            fill
            className="object-cover opacity-[0.06]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
          <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-brand-600/10 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-brand-600/10 blur-[120px]" />
        </div>

        <div className="section-shell relative z-10 space-y-10">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <span className="pill">Our Story</span>
            <h1 className="section-title text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              We build <span className="text-brand-600">websites and apps</span>{" "}
              that help your <span className="text-slate-950">business grow.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500 md:text-xl">
              We are a team of expert developers. We focus on good work and clear talk with our partners.
            </p>
          </div>

          {/* Stats Pills */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            {aboutStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-full border border-brand-100 bg-white px-7 py-3.5 shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
              >
                <span className="font-display text-3xl font-semibold text-brand-600">{stat.value}</span>
                <span className="h-5 w-px bg-brand-100" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="border-t border-slate-100 bg-white py-24">
        <div className="section-shell">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="section-tag">Mission &amp; Vision</span>
                <h2 className="section-title text-4xl sm:text-5xl">
                  Our Strategic Vision{" "}
                  <span className="text-brand-600">For Your Business.</span>
                </h2>
              </div>
              <div className="space-y-5 text-lg leading-relaxed text-slate-600">
                <p>
                  Our mission is to help ambitious teams turn ideas into real products. We&apos;re not just coders—we&apos;re partners who care about your outcomes, move with speed, and communicate with complete honesty.
                </p>
                <p>
                  We envision a digital landscape where businesses in Ghana and beyond have access to world-class software development that is transparent, efficient, and built to last.
                </p>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl shadow-lift ring-1 ring-brand-100">
                <Image
                  src="/images/images/MissionVisionChessImage.png"
                  alt="Strategic Vision"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="bg-slate-50 py-24">
        <div className="section-shell space-y-16">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <span className="section-tag">Our Method</span>
            <h2 className="section-title text-4xl">We plan, build, and launch.</h2>
            <p className="section-lead">You get clear steps and regular updates, so nothing is confusing.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {processSteps.map((step) => (
              <div
                key={step.title}
                className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-soft transition-all duration-500 hover:shadow-lift hover:shadow-brand-600/5"
              >
                {step.image && (
                  <div className="relative mb-6 h-40 w-full overflow-hidden rounded-2xl">
                    <Image src={step.image} alt={step.title} fill className="object-cover" />
                  </div>
                )}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-lg shadow-brand-600/20">
                  {step.number}
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-brand-600">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="bg-white py-24">
        <div className="section-shell space-y-16">
          <div className="space-y-4">
            <span className="section-tag">Our History</span>
            <h2 className="section-title text-4xl sm:text-5xl">
              A Record of <span className="text-brand-600">Reliability.</span>
            </h2>
            <p className="section-lead max-w-lg">We started with a goal to build better websites and apps in Ghana. Today, we deliver quality digital products for businesses everywhere.</p>
          </div>

          <div className="relative max-w-4xl">
            {/* Vertical Line */}
            <div className="absolute top-0 bottom-0 left-[30px] w-px bg-slate-200 md:left-[40px]" />

            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div key={item.year} className="group relative flex items-start gap-8">
                  {/* Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-600 bg-white text-lg font-bold text-brand-600 shadow-sm transition-all group-hover:bg-brand-600 group-hover:text-white md:h-20 md:w-20">
                      {item.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1 pt-4">
                    <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-brand-600 md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="leading-relaxed text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      {teamMembers && teamMembers.length > 0 && (
        <section className="bg-slate-50 py-24">
          <div className="section-shell space-y-16">
            <div className="space-y-4">
              <span className="section-tag">Meet the Team</span>
              <h2 className="section-title text-4xl sm:text-5xl">
                Engineering <span className="text-brand-600">Excellence.</span>
              </h2>
              <p className="section-lead max-w-lg">Our leadership team brings decades of experience in building secure, scalable digital products.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-soft transition-all duration-500 hover:shadow-lift hover:shadow-brand-600/5"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-brand-50 text-brand-600 transition-all group-hover:bg-brand-600 group-hover:text-white">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold">{(member.name || "T")[0]}</span>
                    )}
                  </div>
                  <h3 className="mb-1 text-xl font-bold text-slate-900">{member.name}</h3>
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-600">{member.role}</p>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
