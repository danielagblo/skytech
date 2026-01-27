import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchTestimonials } from '../utils/api';

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [pricingBookletUrl, setPricingBookletUrl] = useState('');

  useEffect(() => {
    const loadTestimonials = async () => {
      const data = await fetchTestimonials();
      setTestimonials(data);
    };
    loadTestimonials();

    // Fetch settings to get pricing booklet URL
    const loadSettings = async () => {
      try {
        const response = await fetch('/shared-data/settings.json');
        const data = await response.json();
        setPricingBookletUrl(data.pricingBookletUrl || '');
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    loadSettings();
  }, []);
  return (
    <>
      <Helmet>
        <title>SkyTech - Professional Software Development Solutions</title>
        <meta name="description" content="SkyTech delivers cutting-edge software development solutions for modern businesses. Expert team, innovative technology, proven results." />
        <meta property="og:title" content="SkyTech - Professional Software Development Solutions" />
        <meta property="og:description" content="SkyTech delivers cutting-edge software development solutions for modern businesses." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="software development, web development, mobile apps, cloud solutions" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-20 pt-24 sm:pt-28">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
        </div>
        <div className="section-shell relative grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div className="space-y-6">
            <span className="pill">Software development studio</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Building resilient products that ship fast and scale with you.
            </h1>
            <p className="text-lg text-slate-200/90 max-w-2xl">
              Strategy, design, and engineering in one team. We craft performant web, mobile, and cloud platforms with measurable outcomes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary">Book a discovery call</Link>
              <Link to="/services" className="btn-secondary">View capabilities</Link>
              {pricingBookletUrl && (
                <a
                  href={`http://localhost:3000/api/booklet/view?file=${encodeURIComponent(pricingBookletUrl.split('/').pop())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Pricing
                </a>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-200/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-slate-500">Active sprints</p>
                <p className="text-2xl font-bold text-slate-900">Product Delivery Board</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">Live</span>
            </div>
            <div className="space-y-4">
              {workstreams.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.state === 'In QA' ? 'bg-amber-50 text-amber-700' : item.state === 'In Discovery' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {item.state}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${item.progress}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="section-shell space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">Why teams choose us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Strategy, design, and engineering under one roof.</h2>
            <p className="text-slate-600">We ship measurable outcomes with predictable timelines using modern stacks and calm communication.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/70 bg-white p-7 shadow-lg shadow-blue-500/5 hover:-translate-y-1 transition-transform">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="section-shell space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3">
              <span className="pill">Services</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Purpose-built squads for every stage.</h2>
              <p className="text-slate-600 max-w-2xl">From zero-to-one product builds to platform modernization, we tailor the team to the outcome and integrate with your workflows.</p>
            </div>
            <button className="btn-secondary w-fit">Download service deck</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.name} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700 mb-3">{service.tag}</p>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{service.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{service.description}</p>
                <ul className="space-y-2 text-sm text-slate-500">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-50">
        <div className="section-shell space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">How we work</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Calm, transparent delivery you can rely on.</h2>
            <p className="text-slate-600">Weekly demos, async updates, and measurable milestones keep stakeholders in sync.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((step) => (
              <div key={step.title} className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-sm font-bold text-blue-700">{step.number}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="section-shell space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="space-y-3">
              <span className="pill">Client outcomes</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">What partners say about us</h2>
              <p className="text-slate-600 max-w-2xl">We build long-term partnerships anchored on transparency, speed, and quality.</p>
            </div>
            <button className="btn-secondary w-fit">See case studies</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
                <p className="text-slate-700 leading-relaxed mb-6">"{item.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.author}</p>
                    <p className="text-sm text-slate-500">{item.company}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 border border-slate-100">
                    {Array(item.rating || 5).fill('⭐').join('')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing booklet */}
      <section className="py-16 bg-slate-50">
        <div className="section-shell">
          <div className="glass-panel rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div className="space-y-3 max-w-2xl">
              <span className="pill">Pricing guide</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">View our pricing booklet</h3>
              <p className="text-slate-600">Get a breakdown of typical engagement models, sample scopes, and budget ranges in one PDF.</p>
            </div>
            {pricingBookletUrl && (
              <a
                className="btn-primary bg-blue-700 hover:bg-blue-800"
                href={`http://localhost:3000/api/booklet/view?file=${encodeURIComponent(pricingBookletUrl.split('/').pop())}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Pricing
              </a>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="section-shell relative text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to ship your next release?</h2>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">Let’s align on scope, timelines, and the outcomes that matter to you.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary bg-white text-blue-700 hover:bg-blue-50 shadow-white/30">Start a project</Link>
            <Link to="/about" className="btn-secondary border-white/60 text-white hover:bg-white/10">Meet the team</Link>
          </div>
        </div>
      </section>
    </>
  );
}

const stats = [
  { label: 'Projects delivered', value: '180+' },
  { label: 'Avg. faster to MVP', value: '3x' },
  { label: 'Client NPS', value: '72' },
];

const workstreams = [
  { title: 'Design System rollout', desc: 'Audit + Figma tokens + component library', state: 'In QA', progress: 'w-3/4 bg-amber-400' },
  { title: 'Mobile onboarding v2', desc: 'Experimenting with passkeys + social sign-in', state: 'In Discovery', progress: 'w-2/5 bg-indigo-400' },
  { title: 'Data platform migration', desc: 'ETL hardening and cost optimization', state: 'Shipping', progress: 'w-5/6 bg-emerald-400' },
];

const features = [
  {
    icon: '⚡',
    title: 'Speed without the chaos',
    description: 'Lean squads, weekly demos, and async updates keep you shipping faster without adding noise.'
  },
  {
    icon: '🛠️',
    title: 'Full-stack expertise',
    description: 'Product strategy, UX, frontend, backend, and DevOps in one team so nothing falls through the cracks.'
  },
  {
    icon: '🧭',
    title: 'Outcome-first roadmap',
    description: 'We anchor every sprint on measurable outcomes that ladder to your KPIs and revenue goals.'
  }
];

const services = [
  {
    tag: 'Product Build',
    name: 'Zero-to-one product teams',
    description: 'Validate, design, and launch new products with a compact team of strategists, designers, and engineers.',
    points: ['Discovery & UX flows', 'Technical architecture', 'Iterative delivery to MVP', 'Analytics & observability baked in']
  },
  {
    tag: 'Platform',
    name: 'Modernization & scale',
    description: 'Untangle legacy systems, improve performance, and prepare your platform for the next wave of growth.',
    points: ['Cloud-native refactors', 'API design & governance', 'Performance profiling', 'Cost & reliability tuning']
  },
  {
    tag: 'Mobile',
    name: 'Mobile experiences',
    description: 'Delightful native and cross-platform apps with secure auth, offline support, and smooth animations.',
    points: ['Native iOS & Android', 'React Native expertise', 'Secure auth + payments', 'Launch readiness support']
  },
  {
    tag: 'Data & AI',
    name: 'Data-driven products',
    description: 'Build pipelines and productize AI use-cases with responsible, observable systems.',
    points: ['Data modeling & ETL', 'LLM integrations', 'Feature stores & evaluation', 'MLOps & monitoring']
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Discovery & framing',
    description: 'Workshops to map objectives, success metrics, and risks. We align on scope, guardrails, and timelines.'
  },
  {
    number: '02',
    title: 'Design & build loops',
    description: 'Rapid iterations with tight design-engineering pairing, weekly demos, and async updates for stakeholders.'
  },
  {
    number: '03',
    title: 'Launch & grow',
    description: 'Hardening, performance, analytics, and runbooks so launches are calm and growth is measurable.'
  }
];

