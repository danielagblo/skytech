"use client";

import Image from "next/image";
import Link from "next/link";
import BookMeetingButton from "@/components/skytech/ui/BookMeetingButton";
import TeamHang, { type HangMember } from "@/components/skytech/sections/home/TeamHang";
import { useRise } from "@/components/skytech/motion/useRise";

const stats = [
  { value: "Still here", label: "From the first call to next year" },
  { value: "Accra", label: "Built here, and still looked after here" },
  { value: "After launch", label: "Hosting, search, and someone who answers" },
];

export default function FilmAbout({ members = [] }: { members?: HangMember[] }) {
  const ref = useRise<HTMLDivElement>();

  return (
    <div ref={ref} className="px-5 pb-8 pt-2 md:px-8">
      <header data-rise className="grid items-end gap-10 py-8 md:grid-cols-[1.2fr_.8fr] md:py-12">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">About</p>
          <h1 className="mt-3 max-w-xl font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
            Skytech Ghana, in Accra.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-black/60">
            Skytech Ghana builds websites, mobile apps, SEO, virtual tours, and CRM for businesses here. Virtual tours are for hospitality and property. The work does not end when the site goes live.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookMeetingButton className="rounded-full bg-[#161616] px-5 py-2.5 text-sm font-medium text-white">
              Book a meeting
            </BookMeetingButton>
            <Link href="/services" className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium">
              See the work
            </Link>
          </div>
        </div>
        <div className="relative h-72 overflow-hidden rounded-[28px] md:h-80">
          <Image src="/images/images/HowSkytechCameToImage.png" alt="Skytech Ghana" fill className="object-cover" sizes="480px" />
        </div>
      </header>

      <section data-rise className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-[24px] bg-white p-6">
            <p className="font-display text-3xl font-medium tracking-tight">{stat.value}</p>
            <p className="mt-2 text-sm text-black/55">{stat.label}</p>
          </article>
        ))}
      </section>

      <section data-rise className="mt-4 grid items-center gap-8 rounded-[28px] bg-white p-6 md:grid-cols-2 md:p-10">
        <div className="relative h-72 overflow-hidden rounded-[24px]">
          <Image src="/images/images/corporateTableImage.png" alt="A working session" fill className="object-cover" sizes="520px" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">Why we started</p>
          <h2 className="mt-3 font-display text-4xl font-medium tracking-tight">The work used to vanish.</h2>
          <p className="mt-4 text-sm leading-relaxed text-black/60">
            Businesses paid for a site, then the people who built it were gone. Updates stalled. Search went quiet. Skytech Ghana started so the build and the care could stay in Accra.
          </p>
        </div>
      </section>

      <section data-rise className="mt-4 grid gap-3 md:grid-cols-2">
        <article className="rounded-[28px] bg-[#161616] p-8 text-white">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Mission</p>
          <p className="mt-4 font-display text-3xl font-medium tracking-tight">Stay after the invoice.</p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            A site, an app, and the search around them, still looked after once they are live.
          </p>
        </article>
        <article className="rounded-[28px] bg-[#d5f5a8] p-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-black/50">Vision</p>
          <p className="mt-4 font-display text-3xl font-medium tracking-tight">Useful a year from now.</p>
          <p className="mt-4 text-sm leading-relaxed text-black/70">
            The launch week is the start. The measure is whether the business is still found, and still answered, next year.
          </p>
        </article>
      </section>

      <div className="mt-4">
        <TeamHang members={members} />
      </div>
    </div>
  );
}
