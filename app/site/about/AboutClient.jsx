"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WhyChooseUsSection from '../../../components/WhyChooseUsSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About({ teamMembers }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Elements
    const heroElements = el.querySelectorAll('.about-hero-el');
    const heroStats = el.querySelectorAll('.about-stat-card');
    const methodHeader = el.querySelectorAll('.method-header > *');
    const methodSteps = el.querySelectorAll('.method-step');
    const historyHeader = el.querySelectorAll('.history-header > *');
    const historyItems = el.querySelectorAll('.history-item');
    const mindsHeader = el.querySelectorAll('.minds-header > *');
    const mindsCards = el.querySelectorAll('.minds-card');
    const teamHeader = el.querySelectorAll('.team-header > *');
    const teamCards = el.querySelectorAll('.team-card');

    // Initial states
    gsap.set(heroElements, { opacity: 0, y: 20 });
    gsap.set(heroStats, { opacity: 0, y: 15 });
    gsap.set(methodHeader, { opacity: 0, y: 35 });
    gsap.set(methodSteps, { opacity: 0, y: 30 });
    gsap.set(historyHeader, { opacity: 0, y: 35 });
    gsap.set(mindsHeader, { opacity: 0, y: 35 });
    gsap.set(mindsCards, { opacity: 0, y: 30 });
    gsap.set(teamHeader, { opacity: 0, y: 35 });
    gsap.set(teamCards, { opacity: 0, y: 30 });

    // Set initial states for timeline points
    gsap.set('.history-item .history-year', { opacity: 0, x: -25 });
    gsap.set('.history-item .history-node', { opacity: 0, scale: 0 });
    gsap.set('.history-item .history-content', { opacity: 0, x: 25 });

    // Timeline for hero entrance
    const tlHero = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tlHero.to(heroElements, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.05 })
      .to(heroStats, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, '-=0.3');

    // Method animations
    const tlMethod = gsap.timeline({
      scrollTrigger: {
        trigger: '.method-section',
        start: 'top bottom-=200px',
        toggleActions: 'play reverse play reverse',
      }
    });
    tlMethod.to(methodHeader, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
      .to(methodSteps, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '-=0.4');

    // History Header Animation
    gsap.to(historyHeader, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.history-section',
        start: 'top bottom-=200px',
        toggleActions: 'play reverse play reverse',
      }
    });

    // History individual item animations
    historyItems.forEach((item) => {
      const year = item.querySelector('.history-year');
      const node = item.querySelector('.history-node');
      const content = item.querySelector('.history-content');

      const tlItem = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top bottom-=120px',
          toggleActions: 'play reverse play reverse',
        }
      });

      tlItem.to(node, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' })
        .to(year, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .to(content, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    });

    // Minds animations
    const tlMinds = gsap.timeline({
      scrollTrigger: {
        trigger: '.minds-section',
        start: 'top bottom-=200px',
        toggleActions: 'play reverse play reverse',
      }
    });
    tlMinds.to(mindsHeader, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
      .to(mindsCards, { opacity: 1, y: 0, duration: 1.0, stagger: 0.18, ease: 'power2.out' }, '-=0.4');

    // Team animations
    const tlTeam = gsap.timeline({
      scrollTrigger: {
        trigger: '.team-section',
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

  const aboutContent = {
    heroTitle: "We build websites and apps that help your business grow.",
    heroSubtitle: "We are a team of expert developers. We focus on good work and clear talk with our partners.",
    missionTitle: "We build it the right way.",
    missionSubtitle: "We don't just make sites. We build professional tools that are fast, safe, and easy to use every day."
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-white">
      {/* Hero Section (Precision Fold Fit - White Editorial) */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white text-slate-900 px-4 pt-32 md:pt-40 pb-20">
        {/* Background Asset with Luminous Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about-hero.png"
            alt="Skytech Innovation Headquarters"
            fill
            className="object-cover opacity-10 grayscale transition-transform duration-[20s] scale-110 hover:scale-100"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white" />
        </div>

        <div className="section-shell relative z-10 space-y-8 flex flex-col items-center text-center">
          <div className="space-y-6 flex flex-col items-center">
            <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[8px] font-bold w-fit about-hero-el">OUR STORY</span>
            <div className="max-w-4xl space-y-4">
              <h1 className="text-4xl lg:text-6xl leading-[1.05] tracking-tighter text-slate-900 font-light about-hero-el">
                We build <span className="font-extrabold text-blue-600">websites and apps</span> <br />
                that help your <span className="font-extrabold text-slate-950">business grow.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto about-hero-el">
                {aboutContent.heroSubtitle}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100/30">
            <div className="flex flex-wrap md:flex-nowrap justify-center gap-4">
              {aboutStats.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative px-8 py-4 rounded-full bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex items-center gap-4 overflow-hidden about-stat-card"
                >
                  {/* Subtle Accent Glow */}
                  <div className="absolute left-0 top-0 w-12 h-full bg-blue-600/5 blur-xl group-hover:bg-blue-600/10 transition-colors" />

                  <div className="relative z-10 flex items-center gap-4">
                    <p className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">
                      {stat.value}
                    </p>
                    <div className="h-4 w-[1px] bg-blue-600/30" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap group-hover:text-slate-900 transition-colors">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Skytech (Atlas Style) */}
      <WhyChooseUsSection />

      {/* How we work */}
      <section className="py-24 bg-white border-t border-slate-100 method-section">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4 method-header">
            <span className="pill bg-blue-50 border-blue-100 text-blue-600 uppercase tracking-widest text-[9px] font-black">OUR METHOD</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
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
                className="group rounded-[2.5rem] bg-slate-50 border border-slate-100 p-10 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500 method-step"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-base font-black text-white shadow-lg shadow-blue-600/20">
                  {step.number}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-505 text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* History Timeline */}
      <section className="py-32 bg-white relative history-section">
        <div className="section-shell space-y-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 border-b border-slate-100 pb-16 history-header">
            <div className="space-y-6">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em]">OUR HISTORY</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tighter">
                A Record of <br />
                <span className="text-blue-600">Reliability.</span>
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm text-base leading-relaxed font-medium border-l-2 border-blue-600/30 pl-6">
              We started with a goal to build better websites and apps in Ghana. Today, we deliver quality digital products for businesses everywhere.
            </p>
          </div>

          <div className="relative max-w-5xl">
            {/* Subtle Vertical Line */}
            <div className="absolute left-[85px] md:left-[115px] top-0 bottom-0 w-[1.5px] bg-slate-100" />

            <div className="space-y-20">
              {timeline.map((item, idx) => (
                <div
                  key={item.year}
                  className="group relative flex items-start gap-8 md:gap-16 history-item"
                >
                  {/* Year Label (Left) */}
                  <div className="w-[50px] md:w-[70px] pt-4">
                    <span className="text-xl md:text-3xl font-black text-blue-600/40 tracking-tighter transition-all group-hover:text-blue-600 block origin-left history-year">
                      {item.year}
                    </span>
                  </div>

                  {/* Node (Middle) */}
                  <div className="relative z-10 pt-3">
                    <div className="relative flex items-center justify-center">
                      {/* Main Node Circle */}
                      <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center transition-all duration-700 group-hover:shadow-xl group-hover:shadow-blue-600/10 history-node">
                        <div className="w-5 h-5 md:w-6 md:h-6 text-blue-600">
                          {idx === 0 ? (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          ) : idx === 1 ? (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          ) : idx === 2 ? (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 011 1V4z" /></svg>
                          ) : (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content (Right) */}
                  <div className="flex-grow pt-3 history-content">
                    <div className="max-w-2xl space-y-2">
                      <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed text-slate-500 font-medium">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Minds */}
      <section className="py-24 bg-white minds-section animate-fix">
        <div className="section-shell space-y-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 minds-header">
            <div className="space-y-6">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">MEET THE MINDS</span>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
                Engineering <br />
                <span className="text-blue-600 text-6xl md:text-7xl">Excellence.</span>
              </h2>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed max-w-sm font-medium border-l-2 border-blue-600/30 pl-6">
              Our leadership team brings together decades of experience in building secure, scalable digital products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group p-12 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-700 minds-card animate-fix-delay"
              >
                <div className="mb-8 w-16 h-16 rounded-2xl bg-blue-600/5 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all overflow-hidden">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{member.name}</h3>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6">{member.role}</p>
                <p className="text-slate-505 leading-relaxed text-slate-500 font-medium">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-slate-50 border-t border-slate-100 relative overflow-hidden team-section">
        <div className="section-shell grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-20 items-center relative z-10">
          <div className="space-y-10 team-header">
            <div className="space-y-6">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">THE TEAM</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tighter">
                Expert Team. <br />
                <span className="text-blue-600">Proven Results.</span>
              </h2>
              <p className="text-slate-500 text-xl leading-relaxed max-w-xl font-medium">
                We are a team of experts. You'll work directly with the people building your project, not salespeople or managers.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {teamTraits.map((trait) => (
                <span
                  key={trait}
                  className="px-6 py-3 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all cursor-default"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teamCards.map((card) => (
              <div
                key={card.title}
                className="group p-10 rounded-[2.5rem] bg-white border border-slate-200 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-700 team-card"
              >
                <div className="mb-6 h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600/60 mb-3">{card.title}</p>
                <p className="text-base text-slate-600 leading-relaxed font-medium">{card.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

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

const teamTraits = ['Expert Developers', 'Direct Talk', 'Honest Work', 'Fast Speed'];

const teamCards = [
  { title: 'Talk to Developers', copy: "You'll talk to a developer on your first call, not a salesperson. We tell you the truth." },
  { title: 'Clear Progress', copy: "We show you exactly how the work is going every step of the way." },
  { title: 'Thorough Testing', copy: "We test everything and check each other's work to make sure it is perfect." },
  { title: 'Training', copy: "We make sure you know exactly how to use your new site before we finish." },
];

const processSteps = [
  {
    number: "01",
    title: "We listen",
    description:
      "You tell us your goals. We ask questions and agree on the plan.",
  },
  {
    number: "02",
    title: "We build",
    description:
      "We design and build while keeping you updated each week.",
  },
  {
    number: "03",
    title: "We launch and support",
    description:
      "We launch, fix issues fast, and help you grow.",
  },
];
