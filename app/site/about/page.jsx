export const metadata = {
  title: 'About SkyTech - Website & App Team',
  description: "Meet the team that builds websites and mobile apps for businesses.",
};

import { getPageContent } from '../../lib/pages';

export const dynamic = 'force-dynamic';

export default async function About() {
  const pages = getPageContent();
  const aboutContent = pages.about || {};
  return (
    <>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 px-4">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
        </div>
        <div className="section-shell relative space-y-6">
          <span className="pill">About SkyTech</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">{aboutContent.heroTitle || "We build websites and mobile apps for real people."}</h1>
          <p className="text-lg text-white/85 max-w-3xl">{aboutContent.heroSubtitle || "We are a small, skilled team. We listen, build, and stay with you as you grow."}</p>
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
            <h2 className="text-3xl font-extrabold text-slate-900">{aboutContent.missionTitle || "Our mission"}</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {aboutContent.missionSubtitle || "Help you build a website or app that works well and helps your business."}
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
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">What you can expect</p>
            <div className="space-y-4 text-slate-700">
              <div className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm text-blue-700 font-semibold">Clear updates</p>
                <p className="text-sm">We share progress often so you always know what is happening.</p>
              </div>
              <div className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm text-blue-700 font-semibold">Good work</p>
                <p className="text-sm">We test, fix, and document so your product is stable.</p>
              </div>
              <div className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm text-blue-700 font-semibold">Support</p>
                <p className="text-sm">We work with you and stay to help after launch.</p>
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
            <h2 className="text-3xl font-extrabold text-slate-900">{aboutContent.valuesTitle || "How we work"}</h2>
            <p className="text-slate-600">{aboutContent.valuesSubtitle || "Simple, honest, and focused on results."}</p>
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
              <h2 className="text-3xl font-extrabold text-slate-900">Our story</h2>
            </div>
            <p className="text-slate-600 max-w-xl">A few key moments that helped us grow.</p>
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
            <h2 className="text-3xl font-extrabold leading-tight">{aboutContent.teamTitle || "Small team. Big care."}</h2>
            <p className="text-white/80">{aboutContent.teamSubtitle || "You work with real people who care about your success."}</p>
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
    title: 'Clear work',
    description: 'We keep things simple and easy to understand.'
  },
  {
    title: 'Honesty',
    description: 'We tell you the truth, even when it is hard.'
  },
  {
    title: 'Quality',
    description: 'We test and fix things so they work well.'
  }
];

const aboutStats = [
  { label: 'Products launched', value: '180+' },
  { label: 'Team members', value: '42' },
  { label: 'Countries served', value: '12' },
];

const missionPoints = [
  'Clear plan before we start',
  'Regular updates while we build',
  'Support after we launch',
];

const timeline = [
  { year: '2020', title: 'We started', detail: 'Built our first big website' },
  { year: '2021', title: 'Mobile apps', detail: 'Started building iPhone and Android apps' },
  { year: '2023', title: 'More services', detail: 'Expanded our team and tools' },
  { year: '2024', title: 'Global work', detail: 'Helped clients in many countries' },
];

const teamTraits = ['Small team', 'Clear communication', 'Reliable delivery', 'Client first'];

const teamCards = [
  { title: 'Hands-on lead', copy: 'A lead works with you and keeps everything on track.' },
  { title: 'Clear steps', copy: 'We agree on steps and share updates often.' },
  { title: 'Quality checks', copy: 'We test and fix issues before launch.' },
  { title: 'Easy handover', copy: 'We explain things so your team can continue.' },
];
