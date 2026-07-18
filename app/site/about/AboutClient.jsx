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
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-white pt-32 pb-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/images/AboutBanner.png"
            alt="Skytech About"
            fill
            className="object-cover opacity-8"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        </div>

        <div className="section-shell relative z-10 space-y-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="pill">Our Story</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              We build <span className="text-blue-600">websites and apps</span>{" "}
              that help your <span className="text-slate-950">business grow.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              We are a team of expert developers. We focus on good work and clear talk with our partners.
            </p>
          </div>

          {/* Stats Pills */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            {aboutStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500"
              >
                <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                <span className="w-px h-5 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="pill">Mission & Vision</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                Our Strategic Vision{" "}
                <span className="text-blue-600">For Your Business.</span>
              </h2>
              <div className="space-y-5 text-slate-600 text-lg leading-relaxed">
                <p>
                  Our mission is to help ambitious teams turn ideas into real products. We&apos;re not just coders—we&apos;re partners who care about your outcomes, move with speed, and communicate with complete honesty.
                </p>
                <p>
                  We envision a digital landscape where businesses in Ghana and beyond have access to world-class software development that is transparent, efficient, and built to last.
                </p>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
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
      <section className="py-24 bg-slate-50">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">Our Method</span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              We plan, build, and launch.
            </h2>
            <p className="text-slate-500 text-lg">
              You get clear steps and regular updates, so nothing is confusing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <div
                key={step.title}
                className="group rounded-3xl bg-white border border-slate-100 p-8 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-500"
              >
                {step.image && (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-6">
                    <Image src={step.image} alt={step.title} fill className="object-cover" />
                  </div>
                )}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-white">
        <div className="section-shell space-y-16">
          <div className="space-y-4">
            <span className="pill">Our History</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              A Record of <span className="text-blue-600">Reliability.</span>
            </h2>
            <p className="text-slate-500 max-w-lg text-lg leading-relaxed">
              We started with a goal to build better websites and apps in Ghana. Today, we deliver quality digital products for businesses everywhere.
            </p>
          </div>

          <div className="relative max-w-4xl">
            {/* Vertical Line */}
            <div className="absolute left-[30px] md:left-[40px] top-0 bottom-0 w-px bg-slate-200" />

            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div key={item.year} className="group relative flex items-start gap-8">
                  {/* Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center font-bold text-lg text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                      {item.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-4 space-y-1">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed">
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
        <section className="py-24 bg-slate-50">
          <div className="section-shell space-y-16">
            <div className="space-y-4">
              <span className="pill">Meet the Team</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                Engineering <span className="text-blue-600">Excellence.</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
                Our leadership team brings decades of experience in building secure, scalable digital products.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="group p-8 rounded-3xl bg-white border border-slate-100 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-500"
                >
                  <div className="mb-6 w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all overflow-hidden">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold">{(member.name || "T")[0]}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">{member.role}</p>
                  <p className="text-slate-500 leading-relaxed text-sm">
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
