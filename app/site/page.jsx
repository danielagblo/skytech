/* eslint-disable react-refresh/only-export-components */
import Link from "next/link";
import { fetchTestimonials, fetchSettings } from "../../utils/api";
import PDFViewer from "../../components/PDFViewer";

export const metadata = {
  title: "SkyTech - Website & Mobile App Developers",
  description:
    "SkyTech builds websites and mobile apps for businesses. Simple, clear, and focused on results.",
};

export default async function Home() {
  const testimonials = await fetchTestimonials();
  const settings = await fetchSettings();
  const pricingBookletUrl = settings.pricingBookletUrl || "";
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-20 pt-24 sm:pt-28">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
        </div>
        <div className="section-shell relative grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div className="space-y-6">
            <span className="pill">Website & mobile app developers</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              We build simple, fast websites and mobile apps.
            </h1>
            <p className="text-lg text-slate-200/90 max-w-2xl">
              Tell us what you need. We plan it, build it, and launch it. We stay to help you grow.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/site/contact" className="btn-primary">
                Book a discovery call
              </Link>
              <Link href="/site/services" className="btn-secondary">
                View capabilities
              </Link>
              {pricingBookletUrl && (
                <PDFViewer
                  src={`/api/booklet/view?file=${encodeURIComponent(
                    pricingBookletUrl.split("/").pop()
                  )}`}
                />
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
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
                <p className="text-2xl font-bold text-slate-900">
                  Product Delivery Board
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                Live
              </span>
            </div>
            <div className="space-y-4">
              {workstreams.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${item.state === "In QA" ? "bg-amber-50 text-amber-700" : item.state === "In Discovery" ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"}`}
                    >
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
            <span className="pill">Why people choose us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              We keep it simple and honest.
            </h2>
            <p className="text-slate-600">
              Clear updates, clean work, and results you can see.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/70 bg-white p-7 shadow-lg shadow-blue-500/5 hover:-translate-y-1 transition-transform"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
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
              <span className="pill">What we do</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                We build and improve websites and apps.
              </h2>
              <p className="text-slate-600 max-w-2xl">
                New product or old one, we help you make it work better.
              </p>
            </div>
            <button className="btn-secondary w-fit">
              Download service deck
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700 mb-3">
                  {service.tag}
                </p>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {service.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
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
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              We plan, build, test, and launch.
            </h2>
            <p className="text-slate-600">
              You get clear steps and regular updates, so nothing is confusing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-sm font-bold text-blue-700">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
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
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                What partners say about us
              </h2>
              <p className="text-slate-600 max-w-2xl">
                We build long-term partnerships anchored on transparency, speed,
                and quality.
              </p>
            </div>
            <button className="btn-secondary w-fit">See case studies</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm"
              >
                <p className="text-slate-700 leading-relaxed mb-6">
                  "{item.quote}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.author}
                    </p>
                    <p className="text-sm text-slate-500">{item.company}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 border border-slate-100">
                    {Array(item.rating || 5)
                      .fill("⭐")
                      .join("")}
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
              <span className="pill">Pricing</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                See what a project can cost
              </h3>
              <p className="text-slate-600">
                Simple price ranges and clear options. No hidden fees.
              </p>
            </div>
            {pricingBookletUrl && (
              <PDFViewer
                src={`/api/booklet/view?file=${encodeURIComponent(
                  pricingBookletUrl.split("/").pop()
                )}`}
              />
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
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to build your website or app?
          </h2>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">
            Tell us what you need. We will give you a clear plan and next steps.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/site/contact"
              className="btn-primary bg-white text-blue-700 hover:bg-blue-50 shadow-white/30"
            >
              Start a project
            </Link>
            <Link
              href="/site/about"
              className="btn-secondary border-white/60 text-white hover:bg-white/10"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const stats = [
  { label: "Projects delivered", value: "180+" },
  { label: "Avg. faster to MVP", value: "3x" },
  { label: "Client NPS", value: "72" },
];

const workstreams = [
  {
    title: "Design System rollout",
    desc: "Audit + Figma tokens + component library",
    state: "In QA",
    progress: "w-3/4 bg-amber-400",
  },
  {
    title: "Mobile onboarding v2",
    desc: "Experimenting with passkeys + social sign-in",
    state: "In Discovery",
    progress: "w-2/5 bg-indigo-400",
  },
  {
    title: "Data platform migration",
    desc: "ETL hardening and cost optimization",
    state: "Shipping",
    progress: "w-5/6 bg-emerald-400",
  },
];

const features = [
  {
    icon: "⚡",
    title: "Fast and clear",
    description:
      "We move fast and keep you updated, so you always know what is happening.",
  },
  {
    icon: "🤝",
    title: "We work with you",
    description:
      "We listen, ask questions, and build what your customers need.",
  },
  {
    icon: "📈",
    title: "Real results",
    description:
      "We build things that help your business grow.",
  },
];

const services = [
  {
    tag: "Building",
    name: "New websites and apps",
    description:
      "We plan, design, and build from scratch, then launch with you.",
    points: [
      "Simple planning",
      "Clean design",
      "Fast launch",
      "Easy to grow later",
    ],
  },
  {
    tag: "Scaling",
    name: "Improve what you have",
    description:
      "We fix slow apps, reduce costs, and make things more reliable.",
    points: [
      "Faster speed",
      "Lower cost",
      "Stronger security",
      "Better uptime",
    ],
  },
  {
    tag: "Mobile",
    name: "Mobile apps",
    description:
      "iPhone and Android apps that are easy to use and fast.",
    points: [
      "iOS + Android",
      "Login and payments",
      "App store ready",
      "Ongoing support",
    ],
  },
  {
    tag: "AI & Data",
    name: "Simple automation",
    description:
      "We automate repeat tasks and turn data into clear answers.",
    points: [
      "Save time",
      "Reduce errors",
      "Clear reports",
      "Smarter decisions",
    ],
  },
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
