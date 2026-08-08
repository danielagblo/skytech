import Image from "next/image";
import Link from "next/link";

interface Initiative {
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
}

const initiatives: Initiative[] = [
  {
    title: "Orphanage IT Training",
    tagline: "Unlocking careers for foster youth",
    description: "We deliver structured software development, design, and hardware literacy bootcamps to kids in foster care. By partnering directly with local orphanages, we give these students the specialized training they need to enter the digital economy.",
    icon: (
      <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    title: "Tech Bootcamps for Underserved Youth",
    tagline: "Empowering local communities",
    description: "We host free community workshops covering modern web technologies, programming fundamentals, and essential digital toolkits. Our bootcamps target youth who lack access to premium tech education.",
    icon: (
      <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  {
    title: "Rural School Computer Labs",
    tagline: "Expanding technological horizons",
    description: "No student should learn computer science from a blackboard. We coordinate hardware donations, refurbish devices, and install computing infrastructure in rural schools, opening up a world of online resources.",
    icon: (
      <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Internship Placements & Careers",
    tagline: "Connecting learning with livelihood",
    description: "The journey doesn't end with training. We bridge the gap between classroom and workplace by transitioning high-performing graduates into internships and junior roles at Skytech and partner tech firms.",
    icon: (
      <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

export default function FoundationPage() {
  return (
    <div className="overflow-x-hidden bg-white text-slate-800">
      {/* ===== Hero Section ===== */}
      <section className="relative w-full min-h-[50vh] bg-slate-950 overflow-hidden flex items-center mt-0 pt-[140px] md:pt-[180px] pb-16">
        <Image
          src="/images/images/AboutBanner.png"
          alt="Skytech Foundation Hero"
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-grid opacity-20" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[34rem] w-[34rem] rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative z-10 w-full max-w-5xl text-center">
          <span className="inline-flex items-center rounded-none bg-brand-500 px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white mb-6">Skytech Foundation</span>
          <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl mt-4">
            Bridging the Digital Divide
            <span className="block text-brand-300">Through Real Action</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">
            We believe that high-quality technology education is the ultimate equalizer. Through structured IT labs, vocational coding bootcamps, and career placement, we empower local youth and foster kids to build secure digital futures.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary !text-sm bg-brand-500 hover:bg-brand-600">
              DONATE NOW
            </Link>
            <Link href="/internship" className="btn-secondary !border-white/25 !bg-white/10 !text-white backdrop-blur-sm hover:!bg-white/20 !text-sm">
              JOIN INTERN PROGRAM
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Overview Intro ===== */}
      <section className="py-20 bg-slate-50" id="overview">
        <div className="section-shell grid grid-cols-1 gap-12 items-center md:grid-cols-2">
          <div className="space-y-6">
            <span className="section-tag">Who We Are</span>
            <h2 className="section-title text-3xl sm:text-4xl">Creating sustainable pathways to technology careers</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              At Skytech, our core competency is building advanced digital systems. Through the Skytech Foundation, we take that same professional excellence and deploy it to uplift communities. We don't just supply laptops; we teach curriculum, foster mentorship, and offer direct internship positions.
            </p>
            <p className="text-slate-600">
              Our flagship program focuses heavily on orphans, providing structured, long-term training that leads directly to vocational stability. Alongside this, we coordinate rural school infrastructure setups and community workshops to build broad-based technological literacy.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[28rem] md:max-w-none">
            <div className="relative aspect-video w-full overflow-hidden rounded-none shadow-lift ring-1 ring-brand-100 bg-slate-900">
              <Image
                src="/images/images/educationtechImage.png"
                alt="Impactful Education"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Initiatives (The Pillars) ===== */}
      <section className="py-24 bg-white" id="initiatives">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="section-tag">Key Initiatives</span>
            <h2 className="section-title text-3xl sm:text-4xl">Our Core Impact Programs</h2>
            <p className="text-slate-600">
              We focus our efforts on sustainable, verified activities that deliver concrete skills to those who need them most.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {initiatives.map((init) => (
              <div
                key={init.title}
                className="flex flex-col justify-between p-8 border border-slate-100 bg-white hover:border-brand-200 transition-all duration-300 group hover:shadow-soft"
              >
                <div className="space-y-4">
                  <div className="p-3 w-fit bg-brand-50 rounded-none group-hover:bg-brand-100 transition-colors">
                    {init.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">{init.title}</h3>
                  <p className="text-sm font-semibold text-brand-600 tracking-wide uppercase">{init.tagline}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{init.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
