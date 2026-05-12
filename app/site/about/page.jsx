"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WhyChooseUsSection from '../../../components/WhyChooseUsSection';


// Custom Hook for Scroll Reveal
function useIntersectionObserver(options = {}) {
  const [elements, setElements] = useState([]);
  const [entries, setEntries] = useState([]);

  const observer = useRef(null);

  useEffect(() => {
    if (elements.length > 0) {
      observer.current = new IntersectionObserver((observedEntries) => {
        setEntries(observedEntries);
      }, options);

      elements.forEach((element) => observer.current.observe(element));
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [elements, options]);

  return [setElements, entries];
}

export default function About() {
  const [setRevealRefs, revealEntries] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
  });

  const timelineRefs = useRef([]);
  const [refCount, setRefCount] = useState(0);

  useEffect(() => {
    // Force a re-scan of the refs whenever the count changes or on mount
    const validRefs = timelineRefs.current.filter(ref => ref !== null);
    if (validRefs.length > 0) {
      setRevealRefs(validRefs);
    }
  }, [setRevealRefs, refCount]);

  // Update ref count on mount to ensure a scan
  useEffect(() => {
    setRefCount(timelineRefs.current.filter(r => r !== null).length);
  }, []);

  // Track which items are visible
  const [visibleItems, setVisibleItems] = useState({});

  useEffect(() => {
    revealEntries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('data-id');
        setVisibleItems(prev => ({ ...prev, [id]: true }));
      }
    });
  }, [revealEntries]);

  const aboutContent = {
    heroTitle: "We build websites and apps that help your business grow.",
    heroSubtitle: "We are a team of expert developers. We focus on good work and clear talk with our partners.",
    missionTitle: "We build it the right way.",
    missionSubtitle: "We don't just make sites. We build professional tools that are fast, safe, and easy to use every day."
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section (Precision Fold Fit - White Editorial) */}
      <section className="relative h-screen flex flex-col justify-center overflow-hidden bg-white text-slate-900 px-4">
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

        <div className="section-shell relative z-10 space-y-8">
          <div className="space-y-6">
            <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[8px] font-bold w-fit">OUR STORY</span>
            <div className="max-w-4xl space-y-4">
              <h1 className="text-4xl lg:text-6xl leading-[1.05] tracking-tighter text-slate-900 font-light">
                We build <span className="font-extrabold text-blue-600">websites and apps</span> <br />
                that help your <span className="font-extrabold text-slate-950">business grow.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium max-w-2xl">
                {aboutContent.heroSubtitle}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100/30">
            <div className="flex flex-wrap md:flex-nowrap justify-center gap-4">
              {aboutStats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="group relative px-8 py-4 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-xl hover:bg-white/60 hover:-translate-y-1 transition-all duration-700 flex items-center gap-4 overflow-hidden"
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

      {/* How we work (Methodology Relocated) */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
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
                className="group rounded-[2.5rem] bg-slate-50 border border-slate-100 p-10 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-base font-black text-white shadow-lg shadow-blue-600/20">
                  {step.number}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
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


      {/* History Timeline (Clean Editorial Blue with Scroll Reveal) */}
      <section className="py-32 bg-white relative">
        <div className="section-shell space-y-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 border-b border-slate-100 pb-16">
            <div className="space-y-6">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em]">OUR HISTORY</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tighter">
                A Record of <br />
                <span className="text-blue-600">Reliability.</span>
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm text-base leading-relaxed font-medium border-l-2 border-blue-600/30 pl-6">
              We started with a goal to build better software in Ghana. Today, we deliver high-quality systems for partners everywhere.
            </p>
          </div>

          <div className="relative max-w-5xl">
            {/* Subtle Vertical Line */}
            <div className="absolute left-[85px] md:left-[115px] top-0 bottom-0 w-[1.5px] bg-slate-100" />

            <div className="space-y-20">
              {timeline.map((item, idx) => (
                <div
                  key={item.year}
                  data-id={idx}
                  ref={el => timelineRefs.current[idx] = el}
                  className={`group relative flex items-start gap-8 md:gap-16 transition-all duration-1000 ease-out ${visibleItems[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                    }`}
                >
                  {/* Year Label (Left) */}
                  <div className="w-[50px] md:w-[70px] pt-4">
                    <span className="text-xl md:text-3xl font-black text-blue-600/40 tracking-tighter transition-all group-hover:text-blue-600 block origin-left">
                      {item.year}
                    </span>
                  </div>

                  {/* Node (Middle) */}
                  <div className="relative z-10 pt-3">
                    <div className="relative flex items-center justify-center">
                      {/* Main Node Circle */}
                      <div className={`relative w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border-2 flex items-center justify-center transition-all duration-700 ${visibleItems[idx] ? 'border-blue-600 scale-100' : 'border-slate-100 scale-50'
                        } group-hover:shadow-xl group-hover:shadow-blue-600/10`}>
                        <div className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-700 ${visibleItems[idx] ? 'text-blue-600' : 'text-slate-300'
                          }`}>
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
                  <div className="flex-grow pt-3">
                    <div className="max-w-2xl space-y-2">
                      <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
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

      {/* Meet the Minds (Minimalist Avatar Design) */}
      <section className="py-24 bg-white">
        <div className="section-shell space-y-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
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
            {[
              {
                name: "Edmund K. Mensah",
                role: "CEO & Lead Architect",
                bio: "15+ years building secure systems for global brands. Focused on high-performance infrastructure.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                name: "Kofi Antwi",
                role: "CTO & Cloud Specialist",
                bio: "Expert in scalable backend architectures and bank-grade security. Managing our core cloud engineering.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                name: "Ama Boateng",
                role: "Head of Product Design",
                bio: "Focused on high-performance UX that drives business growth. Leading our visual systems strategy.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                )
              }
            ].map((member, idx) => {
              const memberId = `member-${idx}`;
              return (
                <div
                  key={member.name}
                  data-id={memberId}
                  ref={el => timelineRefs.current[20 + idx] = el}
                  className={`group p-12 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-700 ${visibleItems[memberId] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="mb-8 w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    {member.icon}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</h3>
                      <p className="text-blue-600/60 text-[10px] font-black uppercase tracking-[0.2em]">{member.role}</p>
                    </div>
                    <p className="text-slate-500 text-base leading-relaxed font-medium">
                      {member.bio}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section (Clean Editorial Design with Reveal) */}
      <section className="py-32 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
        <div className="section-shell grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-20 items-center relative z-10">
          <div
            data-id="team-header"
            ref={el => timelineRefs.current[10] = el}
            className={`space-y-10 transition-all duration-1000 ease-out ${visibleItems["team-header"] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
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
              {teamTraits.map((trait, idx) => (
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
            {teamCards.map((card, idx) => {
              const cardId = `team-card-${idx}`;
              return (
                <div
                  key={card.title}
                  data-id={cardId}
                  ref={el => timelineRefs.current[11 + idx] = el}
                  className={`group p-10 rounded-[2.5rem] bg-white border border-slate-200 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-700 ${visibleItems[cardId] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                    }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="mb-6 h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600/60 mb-3">{card.title}</p>
                  <p className="text-base text-slate-600 leading-relaxed font-medium">{card.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

const values = [
  {
    title: 'Strong Systems',
    description: 'We build websites that are safe and can grow as your business gets bigger.',
    icon: '🏗️'
  },
  {
    title: 'Clear Talk',
    description: 'Talk directly to our developers. No middleman, just clear updates every day.',
    icon: '👁️'
  },
  {
    title: 'Good Quality',
    description: 'We test everything carefully to make sure it works perfectly for you.',
    icon: '⚡'
  }
];

const aboutStats = [
  { label: 'Work Finished', value: '180+' },
  { label: 'Lead Developers', value: '14' },
  { label: 'Types of Businesses', value: '8' },
];

const missionPoints = [
  'Careful planning',
  'Updates every week',
  'Support after launch',
  'High safety standards',
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

