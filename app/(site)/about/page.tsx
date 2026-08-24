import Image from "next/image";
import Link from "next/link";

import ProblemCards from "@/components/skytech/sections/about/ProblemCards";
import AwardsStatement from "@/components/skytech/sections/AwardsStatement";
import BookMeetingButton from "@/components/skytech/ui/BookMeetingButton";

const aboutStats = [
  { label: "Projects Completed", value: "180+" },
  { label: "Team Members", value: "14" },
  { label: "Industries Served", value: "8" },
];

function AboutPage() {
  return (
    <div className="overflow-x-hidden bg-white">
      {/* ===== Keep top hero, premium restyle ===== */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-slate-950 pt-28 pb-20">
        <Image
          src="/images/images/AboutBanner.png"
          alt="About Us"
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-grid opacity-20" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[34rem] w-[34rem] rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative z-10 grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6 text-center md:text-left">
            <span className="pill bg-white/10 !text-brand-300 !border-white/10">About Skytech</span>
            <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              Driven by innovation
              <span className="block text-brand-300">powered by people</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-200 md:mx-0">
              With many years of hands-on experience in Digital Business
              Development Solutions and Enterprise Security IT Services,
              we empower businesses to adapt to changing technologies,
              scale operations seamlessly, and thrive in an increasingly
              competitive world.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <BookMeetingButton className="btn-primary !text-sm">BOOK A MEETING</BookMeetingButton>
              <Link href="/case-studies" className="btn-secondary !border-white/25 !bg-white/10 !text-white backdrop-blur-sm hover:!bg-white/20 !text-sm">SEE OUR WORK</Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[20rem] md:max-w-none">
            <div className="absolute inset-0 -m-4 rounded-3xl bg-brand-600/20 blur-2xl" />
            <div className="relative rounded-none border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <Image
                src="/images/images/DrivenByInnovationImage.png"
                alt="Driven by Innovation"
                width={400}
                height={400}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Floating stats band ===== */}
      <section className="relative z-20 -mt-8 px-4 sm:px-8">
        <div className="mx-auto grid max-w-[80rem] grid-cols-2 gap-8 rounded-none border border-slate-200 bg-white p-8 text-center shadow-lift lg:grid-cols-3 md:p-10">
          {aboutStats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <p className="font-display text-5xl font-bold tracking-tighter text-slate-950 md:text-6xl">
                {stat.value}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Origin story ===== */}
      <section className="py-24">
        <div className="section-shell grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[20rem] md:max-w-none">
            <div className="relative aspect-square w-full overflow-hidden rounded-none shadow-lift ring-1 ring-brand-100">
              <Image
                src="/images/images/HowSkytechCameToImage.png"
                alt="How Skytech Came to Be"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="space-y-5">
            <div className="space-y-3">
              <span className="section-tag">Our Story</span>
              <h2 className="section-title text-3xl sm:text-4xl">It all started with frustration</h2>
            </div>
            <p className="section-lead">
              Like many of the world&apos;s most impactful technological ventures, its foundation was
              built on an urgent, exasperated realization that the existing ecosystem was failing the
              people it was meant to serve.
            </p>
            <p className="section-lead">
              Here is the narrative of why Skytech started, detailing the core frustrations that
              sparked its creation and the mission driving its evolution.
            </p>
          </div>
        </div>
      </section>

      {/* ===== The spark ===== */}
      <section className="pb-16">
        <div className="section-shell space-y-4 text-center">
          <span className="section-tag">The Spark</span>
          <h2 className="section-title text-3xl sm:text-4xl text-balance">A trifecta of frustration</h2>
          <p className="section-lead mx-auto max-w-2xl">
            The inception of Skytech Ghana was fueled by three glaring gaps in the regional technological landscape:
          </p>
        </div>
      </section>

      <ProblemCards />

      {/* ===== Turning friction into fuel ===== */}
      <section className="mt-16 bg-gradient-to-b from-white to-brand-50/40 py-20">
        <div className="section-shell mx-auto max-w-4xl space-y-5 text-center">
          <span className="section-tag text-center">Our Mission</span>
          <h2 className="section-title text-3xl sm:text-4xl text-balance">Turning friction into fuel</h2>
          <p className="section-lead">
            Instead of merely complaining about fragmented local systems, the team channeled that
            friction into a clear corporate mission: &quot;Making Your Tech Dreams a Reality.&quot;
          </p>
          <p className="section-lead">
            Skytech Ghana moved away from simply selling &quot;one-size-fits-all&quot; software packages.
            They pivoted to become a comprehensive digital transformation and spatial partner. They
            recognized that true digital evolution requires walking alongside a client - handling
            everything from raw data analysis and spatial information management to building the
            actual applications that streamline everyday business operations.
          </p>
        </div>
      </section>

      {/* ===== Mission & Vision ===== */}
      <section className="py-24">
        <div className="section-shell grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="order-2 space-y-6 md:order-1">
            <div className="rounded-none border border-slate-100 bg-white p-8 shadow-soft">
              <span className="pill">Mission</span>
              <p className="section-lead mt-4">
                We break the cycle of high costs and vanishing developers by serving as a continuous,
                reliable technical partner. Every solution we deploy is built for affordability, backed
                by predictable maintenance costs, and supported by a team that stays by your side long
                after launch day.
              </p>
            </div>
            <div className="rounded-none bg-slate-950 p-8 text-white shadow-soft">
              <span className="pill bg-white/10 text-brand-100 border-white/20">Vision</span>
              <p className="mt-4 text-lg leading-relaxed text-brand-50">
                To be Africa&apos;s most reliable and accessible technology partner, bridging the digital
                divide for small and medium enterprises by transforming complex tech into simple,
                continuous, and affordable operational growth.
              </p>
            </div>
          </div>
          <div className="relative order-1 mx-auto w-full max-w-[20rem] md:order-2 md:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-none shadow-lift ring-1 ring-brand-100">
              <Image
                src="/images/images/MissionVisionChessImage.png"
                alt="Mission and Vision"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <AwardsStatement className="p-6" />
    </div>
  );
}

export default AboutPage;