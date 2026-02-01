/* eslint-disable react-refresh/only-export-components */
import Link from "next/link";
import { fetchTestimonials, fetchSettings } from "../../utils/api";
import PDFViewer from "../../components/PDFViewer";

export const metadata = {
  title: "SkyTech - Professional Software Development Solutions",
  description:
    "SkyTech delivers cutting-edge software development solutions for modern businesses. Expert team, innovative technology, proven results.",
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
            <span className="pill">Your digital partner</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Ideas into products people actually love.
            </h1>
            <p className="text-lg text-slate-200/90 max-w-2xl">
              We're builders, not just coders. From your first spark of an idea to scaling your platform, we're here as true partners in your success.
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
            <span className="pill">Why partners choose us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              We care about your success more than the hype.
            </h2>
            <p className="text-slate-600">
              We deliver real outcomes: faster time-to-market, happy customers, and sustainable growth. No buzzwords, just results.
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
                From idea to growth—we handle the heavy lifting.
              </h2>
              <p className="text-slate-600 max-w-2xl">
                Whether you're building something new or scaling what you've got, we adapt our team to fit your exact needs and timeline.
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
            <span className="pill">How we partner with you</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Calm, honest delivery you can trust.
            </h2>
            <p className="text-slate-600">
              No surprises, no scope creep, no radio silence. Clear roadmaps, weekly visibility, and partners who care about your win.
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
              <span className="pill">Investment guide</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Understand project costs upfront
              </h3>
              <p className="text-slate-600">
                Get clear pricing, engagement models, and budget ranges. No hidden fees, just honest conversations about your investment.
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
            Let's build something great together.
          </h2>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">
            Chat with us about your goals, timeline, and what success looks like. We'll put together a clear plan to get you there.
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
    title: "Speed + Clarity",
    description:
      "No silos, no blockers. Weekly demos and transparent updates keep everyone aligned and moving forward together.",
  },
  {
    icon: "🤝",
    title: "True Partnership",
    description:
      "We're invested in your success. You get a dedicated team that understands your business, not just your code.",
  },
  {
    icon: "📈",
    title: "Measurable Impact",
    description:
      "Every feature, every sprint ties to outcomes that matter. We track metrics, not just features shipped.",
  },
];

const services = [
  {
    tag: "Building",
    name: "New product launches",
    description:
      "Validate your idea, design something people want, and launch confidently. We handle the complexity so you focus on your business.",
    points: [
      "User research & validation",
      "Design & prototyping",
      "Fast MVP launch",
      "Built-in analytics from day one",
    ],
  },
  {
    tag: "Scaling",
    name: "Platform growth",
    description:
      "Your product is working. Now it needs to handle more users, work faster, and cost less. We'll modernize and optimize.",
    points: [
      "Performance improvements",
      "Cost optimization",
      "Modern infrastructure",
      "Rock-solid reliability",
    ],
  },
  {
    tag: "Mobile",
    name: "Mobile-first experiences",
    description:
      "Native apps that feel fast, beautiful, and intuitive. Apps your customers actually open every day.",
    points: [
      "iOS & Android apps",
      "Cross-platform options",
      "Secure authentication",
      "App store ready",
    ],
  },
  {
    tag: "AI & Data",
    name: "Smart automation",
    description:
      "Let AI handle the repetitive work. Build systems that learn and improve over time with your data.",
    points: [
      "Intelligent automation",
      "Predictive analytics",
      "Custom AI models",
      "Data pipelines that work",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Let's understand your world",
    description:
      "We dive deep into your business, your users, and what you're trying to achieve. Then we map out scope, realistic timelines, and what success looks like.",
  },
  {
    number: "02",
    title: "Build and iterate together",
    description:
      "Weekly demos keep you in the loop. Designers and engineers work hand-in-hand. Feedback flows freely. No surprises, no waiting.",
  },
  {
    number: "03",
    title: "Launch strong, then grow",
    description:
      "We don't disappear at launch. You get runbooks, analytics, and support to ensure your product lands well and keeps improving.",
  },
];
