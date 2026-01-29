import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About SkyTech - Our Mission & Values</title>
        <meta name="description" content="Learn about SkyTech's mission, values, and expertise in software development." />
        <meta property="og:title" content="About SkyTech - Our Mission & Values" />
        <meta property="og:description" content="Learn about SkyTech's mission, values, and expertise in software development." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 px-4">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
        </div>
        <div className="section-shell relative space-y-6">
          <span className="pill">About SkyTech</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">
            We are a product-minded engineering studio focused on measurable outcomes.
          </h1>
          <p className="text-lg text-white/85 max-w-3xl">
            SkyTech blends strategy, design, and engineering to help teams ship faster without sacrificing quality. We integrate like an internal squad and stay until the results are real.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {aboutStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="section-shell grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900">Our mission</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              Empower teams to build, launch, and scale digital products with clarity, speed, and a calm delivery rhythm. Every engagement is anchored on measurable business outcomes and a partnership mindset.
            </p>
            <ul className="space-y-3 text-slate-600">
              {missionPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel rounded-3xl p-8 space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">What we promise</p>
            <div className="space-y-4 text-slate-700">
              <div className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm text-blue-700 font-semibold">Predictability</p>
                <p className="text-sm">Weekly demos, clear scope, and transparent progress so stakeholders stay aligned.</p>
              </div>
              <div className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm text-blue-700 font-semibold">Quality</p>
                <p className="text-sm">Code reviews, testing, observability, and documentation are part of every sprint.</p>
              </div>
              <div className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm text-blue-700 font-semibold">Partnership</p>
                <p className="text-sm">We integrate with your rituals and communicate early to avoid surprises.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="section-shell space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="pill">Our principles</span>
            <h2 className="text-3xl font-extrabold text-slate-900">The way we think and build.</h2>
            <p className="text-slate-600">We favor momentum, clarity, and craftsmanship.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="rounded-3xl bg-white border border-slate-100 p-7 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="section-shell space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="space-y-3">
              <span className="pill">Track record</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Milestones that shaped us.</h2>
            </div>
            <p className="text-slate-600 max-w-xl">From early product builds to enterprise platform work, we keep a bias toward impact and learning.</p>
          </div>
          <div className="space-y-6">
            {timeline.map((item) => (
              <div key={item.year} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
                <span className="text-sm font-semibold text-blue-700">{item.year}</span>
                <p className="text-slate-800 font-semibold">{item.title}</p>
                <p className="text-sm text-slate-600 sm:ml-auto">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="section-shell grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
          <div className="space-y-4">
            <span className="pill">Team DNA</span>
            <h2 className="text-3xl font-extrabold leading-tight">Small, senior teams that integrate fast.</h2>
            <p className="text-white/80">Every squad blends strategy, design, engineering, and QA to keep delivery smooth and accountable.</p>
            <div className="flex flex-wrap gap-3 text-sm">
              {teamTraits.map((trait) => (
                <span key={trait} className="rounded-full bg-white/10 px-4 py-2 border border-white/15">{trait}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamCards.map((card) => (
              <div key={card.title} className="rounded-3xl bg-white/5 border border-white/10 p-5">
                <p className="text-sm text-blue-200 font-semibold mb-2">{card.title}</p>
                <p className="text-sm text-white/85 leading-relaxed">{card.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const values = [
  {
    title: 'Innovation',
    description: 'We stay ahead of technology trends and continuously innovate to provide cutting-edge solutions.'
  },
  {
    title: 'Quality',
    description: 'We maintain the highest standards of code quality and craftsmanship in everything we build.'
  },
  {
    title: 'Partnership',
    description: 'We view our clients as partners and work collaboratively to achieve shared success.'
  }
];

const aboutStats = [
  { label: 'Products launched', value: '180+' },
  { label: 'Team members', value: '42' },
  { label: 'Countries served', value: '12' },
];

const missionPoints = [
  'Outcome-driven roadmaps aligned to business KPIs',
  'Design-engineering pairing for faster cycles',
  'Observability, QA, and documentation baked into delivery',
];

const timeline = [
  { year: '2020', title: 'Studio founded', detail: 'Lean squad builds first enterprise-grade platform' },
  { year: '2021', title: 'Mobile practice launched', detail: 'Native and cross-platform expertise formalized' },
  { year: '2023', title: 'Cloud & data expansion', detail: 'DevOps and data platform teams added' },
  { year: '2024', title: 'Global delivery', detail: 'Remote-first pods serving 12 countries' },
];

const teamTraits = ['Design + build mindset', 'Calm communication', 'Systems thinking', 'Senior-led squads'];

const teamCards = [
  { title: 'Leadership involvement', copy: 'Every engagement has a hands-on lead who removes blockers and keeps delivery smooth.' },
  { title: 'Embedded rituals', copy: 'We mirror your standups, sprint reviews, and docs to keep collaboration seamless.' },
  { title: 'Quality gates', copy: 'Peer review, automated checks, and measurable acceptance criteria each sprint.' },
  { title: 'Documentation by default', copy: 'Runbooks, architecture notes, and handover guides stay updated as we ship.' },
];
