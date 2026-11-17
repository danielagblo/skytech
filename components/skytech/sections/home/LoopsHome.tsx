"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BookMeetingButton from "@/components/skytech/ui/BookMeetingButton";
import { useWhatsAppModal } from "@/components/WhatsAppModal";
import { WEBSITE_OFFERS } from "@/lib/crm/website-offers";
import HeroHeadline, { type HeroHeadlineItem, type HeroHeadlineMode } from "@/components/skytech/ui/HeroHeadline";
import AnimatedCounter from "@/components/skytech/sections/home/AnimatedCounter";

gsap.registerPlugin(useGSAP);

const words = ["websites", "mobile apps", "search", "security"];
const ticker = [
  "A site that actually loads",
  "An app your customers finish",
  "Search that keeps working",
  "Someone still here after launch",
  "Maintenance without a surprise bill",
  "Skytech Ghana, Accra",
];

const chapters = [
  {
    index: "01",
    title: "Websites",
    body: "Corporate, commerce, and content sites, written and built for the way the business actually sells.",
    points: ["Corporate business", "E-commerce", "Blog content", "E-learning"],
    href: "/services",
  },
  {
    index: "02",
    title: "Mobile apps",
    body: "Apps for the work your customers do on a phone, from the first screen to the store listing.",
    points: ["Corporate business", "E-commerce", "Blog content", "E-learning"],
    href: "/services",
  },
  {
    index: "03",
    title: "Search",
    body: "The site is only half of it. Search is how people in Ghana find it after the launch week.",
    points: ["SEO optimization", "Technical SEO", "Keyword strategy", "On and off-page SEO"],
    href: "/seo",
  },
];

export interface LoopsStat {
  value: number;
  suffix: string;
  label: string;
  compact?: boolean;
}

export default function LoopsHome({
  headlines,
  headlineMode,
  subText,
  stats,
  children,
}: {
  headlines?: HeroHeadlineItem[];
  headlineMode?: HeroHeadlineMode;
  subText?: string;
  stats: LoopsStat[];
  children?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const { open: openLead } = useWhatsAppModal();
  const money = (amount: number) => `GH₵${amount.toLocaleString("en-GH")}`;

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const track = root.current?.querySelector<HTMLElement>("[data-word-track]");
      const word = track?.querySelector<HTMLElement>("span");
      if (!track || !word) return;
      const height = word.offsetHeight;
      const timeline = gsap.timeline({ repeat: -1 });
      timeline.to({}, { duration: 1.35 });
      for (let step = 1; step <= words.length; step += 1) {
        timeline.to(track, {
          y: -height * step,
          duration: 0.55,
          ease: "power3.inOut",
        });
        timeline.to({}, { duration: 1.35 });
      }
      timeline.set(track, { y: 0 });
    });
    return () => motion.revert();
  }, { scope: root });

  const loopWords = [...words, words[0]];

  return (
    <article ref={root}>
      <section className="flex flex-col bg-[#1E5AC8] px-5 pb-16 pt-[140px] text-white sm:px-8 md:pb-20 md:pt-[168px]">
        <div className="mx-auto flex w-full max-w-[80rem] flex-col">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/70">
            Websites · Apps · Search · Care
          </p>
          <div className="mt-8 max-w-5xl [&_h1]:animate-none">
            <HeroHeadline headlines={headlines} mode={headlineMode} />
          </div>
          <p className="mt-8 flex flex-wrap items-end gap-x-3 text-2xl font-medium leading-none tracking-tight text-white sm:text-4xl">
            <span>Skytech Ghana for</span>
            <span className="inline-block h-[1.15em] overflow-hidden">
              <span data-word-track className="block">
                {loopWords.map((word, index) => (
                  <span key={`${word}-${index}`} className="block h-[1.15em] leading-none text-[#D7E4FF]">
                    {word}
                  </span>
                ))}
              </span>
            </span>
          </p>
          {subText ? (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {subText}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <BookMeetingButton className="!rounded-full !bg-[#141413] !px-6 !py-3 !text-sm !text-white hover:!bg-black">
              Book a meeting
            </BookMeetingButton>
            <a
              href="#offers"
              className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              See the offers
            </a>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 border-t border-white/20 pt-6 text-sm text-white/80 sm:grid-cols-4">
            {["Edits", "Build", "Search", "Care"].map((item) => (
              <p key={item} className="uppercase tracking-[0.16em]">{item}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-[#141413] py-4 text-white">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap text-sm uppercase tracking-[0.18em]">
          {[...ticker, ...ticker].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="bg-[#F4F1EA] py-20 text-[#141413] md:py-28">
        <div className="section-shell grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#1E5AC8]">What Skytech does</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
              The website, the app, and the search after it. Skytech Ghana, still here next year.
            </h2>
          </div>
          <div className="flex items-end gap-6">
            <div className="relative h-28 w-20">
              <Image src="/images/images/homePageAward2.png" fill className="object-contain" alt="" />
            </div>
            <div className="relative h-36 w-28">
              <Image src="/images/images/homePageAward.png" fill className="object-contain" alt="Award" />
            </div>
          </div>
        </div>
      </section>

      {children}

      {stats.length > 0 ? (
        <section className="border-y border-[#141413]/10 bg-[#F4F1EA]">
          <div className="section-shell grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-5xl font-medium tracking-tight text-[#141413] sm:text-6xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} compact={stat.compact} />
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#5C574F]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="offers" className="bg-[#141413] py-20 text-white md:py-28">
        <div className="section-shell">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E4FF]">
            Start here
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            Pick the offer. We take it from there.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
            Each price is the full first year: software, hosting, domain, SEO, and maintenance. Tell us which one, and the next message is a start date.
          </p>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {WEBSITE_OFFERS.map((offer) => {
              const featured = offer.id === "standard";
              return (
                <article
                  key={offer.id}
                  className={`flex flex-col border p-6 ${featured ? "border-[#1E5AC8] bg-[#1E5AC8]" : "border-white/15 bg-white/5"}`}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                    {featured ? "Most businesses start here" : "Website offer"}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-medium tracking-tight">{offer.name}</h3>
                  <p className="mt-4 font-display text-4xl tracking-tight">{money(offer.total)}</p>
                  <ul className="mt-6 space-y-2 border-t border-white/20 pt-5 text-sm text-white/85">
                    {offer.items.map((item) => (
                      <li key={item.description} className="flex items-center justify-between gap-4">
                        <span>{item.description}</span>
                        <span>{money(item.unitPrice)}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() =>
                      openLead({
                        packageName: offer.name,
                        packagePrice: money(offer.total),
                      })
                    }
                    className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${featured ? "bg-[#141413] text-white hover:bg-black" : "bg-white text-[#141413] hover:bg-[#F4F1EA]"}`}
                  >
                    Claim this offer
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-[#141413] md:py-28">
        <div className="section-shell">
          <div className="flex items-end justify-between gap-6">
            <h2 className="max-w-xl font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Everything around the build, handled.
            </h2>
            <p className="hidden text-sm text-[#5C574F] md:block">01 — 03</p>
          </div>
          <div className="mt-12 divide-y divide-[#141413]/10 border-y border-[#141413]/10">
            {chapters.map((chapter) => (
              <article key={chapter.index} className="grid gap-6 py-10 md:grid-cols-[8rem_1fr_16rem] md:items-start">
                <p className="font-display text-3xl text-[#1E5AC8]">{chapter.index}</p>
                <div>
                  <h3 className="font-display text-3xl font-medium tracking-tight">{chapter.title}</h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-[#5C574F]">{chapter.body}</p>
                  <Link href={chapter.href} className="mt-5 inline-flex text-sm font-semibold text-[#1E5AC8]">
                    Explore
                  </Link>
                </div>
                <ul className="space-y-2 text-sm text-[#141413]">
                  {chapter.points.map((point) => (
                    <li key={point} className="border-b border-[#141413]/10 pb-2">{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1E5AC8] py-20 text-white md:py-28">
        <div className="section-shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <h2 className="max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            Go back to running the business. We’ll take the build.
          </h2>
          <BookMeetingButton className="!rounded-full !bg-[#141413] !px-6 !py-3 !text-sm !text-white hover:!bg-black">
            Book a meeting
          </BookMeetingButton>
        </div>
      </section>
    </article>
  );
}
