"use client";

import { useRef } from "react";
import Image from "next/image";
import FilmNav from "@/components/skytech/layout/FilmNav";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import BookMeetingButton from "@/components/skytech/ui/BookMeetingButton";
import PartnersTrust from "@/components/skytech/sections/home/PartnersTrust";
import HowItWorks from "@/components/skytech/sections/home/HowItWorks";
import ServiceOffers from "@/components/skytech/sections/ServiceOffers";
import CustomerSay, { type CustomerStory } from "@/components/skytech/sections/home/CustomerSay";
import TeamHang, { type HangMember } from "@/components/skytech/sections/home/TeamHang";
import ThankYouFooter from "@/components/skytech/layout/ThankYouFooter";
import type { ServiceMenu } from "@/lib/crm/service-offers";
import type { FilmServiceItem } from "@/app/lib/services-shared";
import type { HomeStatement } from "@/app/lib/home-statements-shared";
import { DEFAULT_HOME_STATEMENTS } from "@/app/lib/home-statements-shared";

function moneyLabel(amount: number | null | undefined) {
  if (amount == null) return null;
  return `GH₵${amount.toLocaleString("en-GH")}`;
}

function menuOffer(menus: ServiceMenu[] | undefined, serviceId: string, offerId?: string) {
  const menu = menus?.find((item) => item.id === serviceId);
  if (!menu?.offers?.length) return null;
  if (offerId) {
    return (
      menu.offers.find((offer) => offer.id === offerId) ||
      menu.offers.find((offer) => offer.name.toLowerCase().includes(offerId)) ||
      null
    );
  }
  return menu.offers.find((offer) => offer.featured) || menu.offers[0] || null;
}

function serviceById(services: FilmServiceItem[] | undefined, id: string) {
  return services?.find((item) => item.id === id) || null;
}

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ribbon = ["Website", "Mobile app", "SEO", "Virtual tour", "CRM"];
const tourIndustries = ["Hospitality", "Hotels", "Apartments", "Airbnb", "Event centres", "Real estate"];
const crmPoints = ["Customer names", "What they asked for", "Who to follow up", "Paid or not"];

const roadmapSteps = [
  {
    year: "Upon entry",
    title: "Market Entry",
    body: "Product launch, early traction, initial customer base.",
  },
  {
    year: "Year 2",
    title: "Optimization",
    body: "Operational improvements and revenue acceleration.",
  },
  {
    year: "Year 3",
    title: "Expansion",
    body: "New markets and product extensions.",
  },
  {
    year: "Year 4",
    title: "Leadership",
    body: "Strategic growth and long-term profitability.",
  },
];

const solutionConcepts = [
  {
    id: "efficiency",
    label: "Efficiency",
    detail: "Faster delivery. Cleaner systems. Less wasted spend.",
  },
  {
    id: "innovation",
    label: "Innovation",
    detail: "New products and channels that open the next sale.",
  },
  {
    id: "scalability",
    label: "Scalability",
    detail: "Growth that holds after launch, not only on day one.",
  },
];

const growthMetrics = [
  { label: "User Growth", value: "35%" },
  { label: "Conversion Rate", value: "+15%" },
  { label: "Retention Target", value: "190%" },
];

export interface FilmPartner {
  name: string;
  logoUrl: string;
  colSpan?: number;
  rowSpan?: number;
  logoScale?: number;
  visible?: boolean;
}

export default function FilmHome({
  partners = [],
  reviews = [],
  members = [],
  menus,
  services = [],
  statements = DEFAULT_HOME_STATEMENTS.statements,
}: {
  partners: FilmPartner[];
  reviews?: CustomerStory[];
  members?: HangMember[];
  menus?: ServiceMenu[];
  services?: FilmServiceItem[];
  statements?: HomeStatement[];
}) {
  const root = useRef<HTMLElement>(null);
  const statementLines = statements.length ? statements : DEFAULT_HOME_STATEMENTS.statements;
  const websiteOffer = menuOffer(menus, "website", "standard") || menuOffer(menus, "website");
  const websitePrice = moneyLabel(websiteOffer?.total) || "GH₵8,399";
  const websitePricePlain = websitePrice.replace("GH₵", "GHS ");
  const tourService = serviceById(services, "tour");
  const crmService = serviceById(services, "crm");
  const crmOffer = menuOffer(menus, "crm");
  const tourPrice =
    tourService?.price?.replace(/^For only\s+/i, "") ||
    moneyLabel(menuOffer(menus, "tour", "space")?.total) ||
    "GH₵8,799";
  const crmMonthly =
    moneyLabel(crmOffer?.total) ||
    crmService?.price?.match(/GH₵[\d,]+/)?.[0] ||
    "GH₵200";
  const crmYearly =
    crmOffer?.total != null ? moneyLabel(crmOffer.total * 12) : "GH₵2,400";
  const tourTags = tourService?.note
    ? tourService.note.split("·").map((part) => part.trim()).filter(Boolean)
    : tourIndustries;

  useLenis(() => {
    ScrollTrigger.update();
  });

  useGSAP((_, contextSafe) => {
    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const open = gsap.timeline({ defaults: { ease: "power3.out" } });
      open.fromTo("[data-hero-item]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.05 });
      if (contextSafe) {
        open.call(contextSafe(() => {
          gsap.utils.toArray<HTMLElement>("[data-pill]:not([data-hero-swap])").forEach((pill, index) => {
            gsap.to(pill, {
              backgroundColor: index % 2 === 0 ? "#b7dff6" : "#d5f5a8",
              duration: 2.8,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.7,
            });
          });

          const heroShell = root.current?.querySelector<HTMLElement>("[data-hero-swap]");
          const heroWords = gsap.utils.toArray<HTMLElement>("[data-hero-word]", heroShell || undefined);
          if (heroShell && heroWords.length > 1) {
            gsap.killTweensOf([heroShell, ...heroWords]);

            const metrics = heroWords.map((word) => ({
              width: Math.ceil(word.scrollWidth),
              height: Math.ceil(word.scrollHeight),
            }));

            gsap.set(heroShell, {
              width: metrics[0].width,
              height: metrics[0].height,
              overflow: "hidden",
            });
            gsap.set(heroWords, {
              position: "absolute",
              left: 0,
              top: 0,
              x: 0,
              y: 0,
              yPercent: 0,
              opacity: 0,
              visibility: "visible",
              zIndex: 1,
            });
            gsap.set(heroWords[0], { opacity: 1, zIndex: 2 });

            const swap = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });
            const holds = [4.2, 1.35, 1.35];
            heroWords.forEach((word, index) => {
              const nextIndex = (index + 1) % heroWords.length;
              const next = heroWords[nextIndex];
              swap.to({}, { duration: holds[index] ?? 1.2 });
              swap.to(word, { opacity: 0, yPercent: -55, duration: 0.4, ease: "power2.in", zIndex: 1 }, ">");
              swap.to(
                heroShell,
                {
                  width: metrics[nextIndex].width,
                  height: metrics[nextIndex].height,
                  duration: 0.5,
                  ease: "power2.inOut",
                },
                "<",
              );
              swap.fromTo(
                next,
                { opacity: 0, yPercent: 55, zIndex: 2 },
                { opacity: 1, yPercent: 0, duration: 0.46, ease: "power2.out", zIndex: 2 },
                "<0.05",
              );
            });
          }
        }));
      }

      const lines = gsap.utils.toArray<HTMLElement>("[data-statement]");
      const reel = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-lines]",
          start: "top 12%",
          end: "+=210%",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
      });
      lines.forEach((line, index) => {
        if (index === 0) {
          reel.to({}, { duration: 0.45 });
          return;
        }
        reel.to(lines[index - 1], { autoAlpha: 0, y: -18, duration: 0.28 });
        reel.fromTo(
          line,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.35 },
          "<0.08",
        );
        reel.to({}, { duration: 0.42 });
      });

      const performance = document.querySelector<HTMLElement>("[data-performance]");
      const slides = gsap.utils.toArray<HTMLElement>("[data-perf-slide]");
      const concepts = gsap.utils.toArray<HTMLElement>("[data-concept]");
      const progressFill = document.querySelector<HTMLElement>("[data-roadmap-progress]");
      const roadmapNodes = gsap.utils.toArray<HTMLElement>("[data-roadmap-node]");
      const roadmapCards = gsap.utils.toArray<HTMLElement>("[data-roadmap-card]");
      const roadmapChecks = gsap.utils.toArray<HTMLElement>("[data-roadmap-check]");
      const roadmapNums = gsap.utils.toArray<HTMLElement>("[data-roadmap-num]");

      if (performance && slides.length > 1) {
        gsap.set(slides, { autoAlpha: 0 });
        gsap.set(slides[0], { autoAlpha: 1 });
        if (progressFill) gsap.set(progressFill, { scaleX: 0, transformOrigin: "left center" });
        if (roadmapNodes.length) {
          gsap.set(roadmapNodes, {
            backgroundColor: "#ffffff",
            borderColor: "rgba(255,255,255,0.35)",
            scale: 1,
          });
          gsap.set(roadmapChecks, { autoAlpha: 0, scale: 0.6 });
          gsap.set(roadmapNums, { autoAlpha: 1 });
          gsap.set(roadmapNodes[0], {
            backgroundColor: "#4ADE80",
            borderColor: "#4ADE80",
          });
          if (roadmapChecks[0]) gsap.set(roadmapChecks[0], { autoAlpha: 1, scale: 1 });
          if (roadmapNums[0]) gsap.set(roadmapNums[0], { autoAlpha: 0 });
        }
        if (roadmapCards.length) {
          gsap.set(roadmapCards, { autoAlpha: 0.45, y: 12 });
          gsap.set(roadmapCards[0], { autoAlpha: 1, y: 0 });
        }
        if (concepts.length) {
          gsap.set(concepts, { y: 8, autoAlpha: 0.45, scale: 1 });
          gsap.set(concepts[0], { y: 0, autoAlpha: 1, scale: 1 });
        }

        const stageCount = Math.max(roadmapCards.length, roadmapNodes.length, 4);
        const show = gsap.timeline({
          scrollTrigger: {
            trigger: performance,
            start: "top 10%",
            end: "+=380%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });

        show.to({}, { duration: 0.35 });
        for (let index = 1; index < stageCount; index += 1) {
          const progress = index / (stageCount - 1);
          show.to(progressFill, { scaleX: progress, duration: 0.55, ease: "none" });
          if (roadmapNodes[index]) {
            show.to(
              roadmapNodes[index],
              { backgroundColor: "#4ADE80", borderColor: "#4ADE80", duration: 0.25 },
              "<0.2",
            );
          }
          if (roadmapChecks[index]) {
            show.to(roadmapChecks[index], { autoAlpha: 1, scale: 1, duration: 0.2 }, "<");
          }
          if (roadmapNums[index]) {
            show.to(roadmapNums[index], { autoAlpha: 0, duration: 0.15 }, "<");
          }
          if (roadmapCards[index]) {
            show.to(roadmapCards[index], { autoAlpha: 1, y: 0, duration: 0.3 }, "<");
          }
          show.to({}, { duration: 0.28 });
        }
        show.to({}, { duration: 0.35 });

        show.to(slides[0], { autoAlpha: 0, duration: 0.35 });
        show.fromTo(slides[1], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, "<0.05");
        show.to({}, { duration: 0.35 });
        concepts.forEach((concept, index) => {
          if (index === 0) {
            show.to({}, { duration: 0.45 });
            return;
          }
          show.to(concepts[index - 1], { y: 0, autoAlpha: 0.45, scale: 1, duration: 0.28 });
          show.to(concept, { y: 0, autoAlpha: 1, scale: 1, duration: 0.28 }, "<");
          show.to({}, { duration: 0.42 });
        });

        show.to(slides[1], { autoAlpha: 0, duration: 0.35 });
        show.fromTo(slides[2], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, "<0.05");
        show.fromTo(
          "[data-metric]",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.35 },
          "<0.1",
        );
        show.to({}, { duration: 0.7 });
      }

      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((panel) => {
        gsap.from(panel, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Founder's Remark — same pin/scrub stack as statement + performance cards
      const founderPin = document.querySelector<HTMLElement>("[data-founder-pin]");
      const founderSteps = gsap.utils.toArray<HTMLElement>("[data-founder-step]");
      const founderIcons = gsap.utils.toArray<HTMLElement>("[data-founder-icon]");
      const founderLine = document.querySelector<HTMLElement>("[data-founder-line]");
      if (founderPin && founderSteps.length > 1) {
        gsap.set(founderSteps, { opacity: 0.34, y: 14 });
        gsap.set(founderSteps[0], { opacity: 1, y: 0 });
        gsap.set(founderIcons, {
          backgroundColor: "#ffffff",
          borderColor: "rgba(0,0,0,0.1)",
        });
        gsap.set(founderIcons[0], {
          backgroundColor: "#d5f5a8",
          borderColor: "transparent",
        });
        if (founderLine) {
          gsap.set(founderLine, { scaleY: 1 / founderSteps.length, transformOrigin: "top center" });
        }

        const founder = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: founderPin,
            start: "top 12%",
            end: "+=160%",
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        founder.to({}, { duration: 0.3 });
        for (let index = 1; index < founderSteps.length; index += 1) {
          const progress = (index + 1) / founderSteps.length;
          founder.to(founderSteps[index - 1], { opacity: 0.36, y: 0, duration: 0.35 });
          founder.to(founderSteps[index], { opacity: 1, y: 0, duration: 0.4 }, "<");
          if (founderIcons[index]) {
            founder.to(
              founderIcons[index],
              { backgroundColor: "#d5f5a8", borderColor: "transparent", duration: 0.28 },
              "<",
            );
          }
          if (founderIcons[index - 1]) {
            founder.to(
              founderIcons[index - 1],
              { backgroundColor: "#f3f3f1", borderColor: "transparent", duration: 0.25 },
              "<",
            );
          }
          if (founderLine) {
            founder.to(founderLine, { scaleY: progress, duration: 0.4 }, "<");
          }
          founder.to({}, { duration: 0.32 });
        }
        founder.to({}, { duration: 0.25 });
      }
    });

    motion.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-hero-item]", { opacity: 1, y: 0 });
      gsap.set("[data-statement]", { opacity: 1, y: 0, position: "relative" });
      gsap.set("[data-perf-slide]", { opacity: 1, position: "relative" });
      gsap.set("[data-concept]", { opacity: 1, y: 0, scale: 1 });
      gsap.set("[data-metric]", { opacity: 1, y: 0 });
      gsap.set("[data-roadmap-progress]", { scaleX: 1 });
      gsap.set("[data-roadmap-node]", { backgroundColor: "#4ADE80", borderColor: "#4ADE80" });
      gsap.set("[data-roadmap-check]", { opacity: 1, scale: 1 });
      gsap.set("[data-roadmap-num]", { opacity: 0 });
      gsap.set("[data-roadmap-card]", { opacity: 1, y: 0 });
      gsap.set("[data-founder-step]", { opacity: 1, y: 0 });
      gsap.set("[data-founder-line]", { scaleY: 1 });
    });

    return () => {
      motion.revert();
    };
  }, { scope: root });

  return (
    <article ref={root} className="relative bg-[#e8e8ea] text-[#161616]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, transparent 0 46px, rgba(255,255,255,.65) 47px, transparent 48px), radial-gradient(circle at 80% 90%, transparent 0 70px, rgba(255,255,255,.7) 71px, transparent 72px)",
          backgroundSize: "280px 180px, 360px 240px",
        }}
      />

      <section className="relative min-h-[100dvh]">
        <div className="flex min-h-[100dvh] items-stretch px-3 py-3 md:px-5 md:py-5">
          <div className="relative mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-[1180px] flex-col rounded-[28px] bg-[#f6f6f4] p-4 shadow-[0_20px_60px_rgba(20,20,20,.06)] md:p-8">
            <header data-hero-item>
              <FilmNav />
            </header>

            <div className="flex flex-1 flex-col justify-center py-8 md:py-10">
              <h1
                data-hero-item
                className="font-display text-[clamp(3.85rem,15.5vw,5.4rem)] font-medium leading-[0.88] tracking-tight md:text-[clamp(2.5rem,8.2vw,6.6rem)]"
              >
                <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  Sites
                  <span data-pill className="inline-flex items-center rounded-full bg-[#d5f5a8] px-[0.38em] py-[0.02em]">
                    that earn
                  </span>
                </span>
                <span className="mt-[0.08em] flex flex-wrap items-center gap-x-3 gap-y-2">
                  your next
                  <span
                    data-pill
                    data-hero-swap
                    className="relative inline-block align-middle overflow-hidden"
                  >
                    <span
                      className="invisible inline-flex items-center whitespace-nowrap rounded-full px-[0.38em] py-[0.02em]"
                      aria-hidden
                    >
                      massive
                    </span>
                    {[
                      { word: "big", tone: "bg-[#b7dff6]" },
                      { word: "better", tone: "bg-[#d5f5a8]" },
                      { word: "massive", tone: "bg-[#b7dff6]" },
                    ].map((item) => (
                      <span
                        key={item.word}
                        data-hero-word
                        className={`absolute left-0 top-0 inline-flex items-center whitespace-nowrap rounded-full px-[0.38em] py-[0.02em] text-[#161616] ${item.tone}`}
                      >
                        {item.word}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="mt-[0.12em] flex flex-wrap items-center gap-3 md:gap-5">
                  <span data-pill className="inline-flex items-center gap-[0.2em] rounded-full bg-[#d5f5a8] px-[0.42em] py-[0.02em]">
                    sale
                    <span aria-hidden>✦</span>
                  </span>
                </span>
              </h1>
              <div data-hero-item className="mt-8 flex flex-wrap gap-3">
                <BookMeetingButton className="inline-flex items-center gap-2 rounded-full bg-[#161616] px-5 py-2.5 text-sm font-medium text-white">
                  Book a meeting
                </BookMeetingButton>
                <a href="#offers" className="inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium">
                  See the offers
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-lines className="relative px-3 pb-4 md:px-5">
        <div className="relative mx-auto flex min-h-[78vh] max-w-[1180px] items-center justify-center overflow-hidden rounded-[28px] bg-[#f6f6f4] px-6">
          {statementLines.map((line, index) => (
            <h2
              key={line.id || `${line.mark}-${index}`}
              data-statement
              className={`absolute left-6 right-6 text-center font-display text-3xl font-medium leading-tight tracking-tight md:text-5xl ${index === 0 ? "" : "opacity-0"}`}
            >
              {line.lead}{" "}
              <span className="rounded-full bg-[#d5f5a8] px-3">{line.mark}</span>{" "}
              {line.rest}
            </h2>
          ))}
        </div>
      </section>

      <section className="relative px-3 pb-4 md:px-5">
        <div data-rise className="mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-[#f6f6f4] px-5 py-12 md:px-10 md:py-16">
          <h2 className="font-display text-[clamp(2rem,5.2vw,4.2rem)] font-medium leading-[0.92] tracking-tight">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              Customers
              <span data-pill className="inline-flex items-center rounded-full bg-[#b7dff6] px-[0.38em] py-[0.02em]">
                find you
              </span>
            </span>
            <span className="mt-[0.08em] flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <span>when they search.</span>
              <span className="max-w-[14rem] pb-1 text-[12px] font-normal leading-snug tracking-normal text-black/55 md:max-w-xs md:text-sm">
                Your page takes the enquiry, the booking, or the order.
              </span>
            </span>
            <span className="mt-[0.12em] flex flex-wrap items-center gap-3 md:gap-4">
              <span className="grid h-[2.6rem] w-[2.6rem] shrink-0 place-items-center rounded-full border border-[#8dce3a] text-center text-[7px] font-medium uppercase leading-tight tracking-[0.12em] md:h-[3.4rem] md:w-[3.4rem] md:text-[9px]">
                Then
                <br />
                they
              </span>
              <span data-pill className="inline-flex items-center gap-[0.2em] rounded-full bg-[#d5f5a8] px-[0.42em] py-[0.02em]">
                pay you
                <span aria-hidden>✦</span>
              </span>
            </span>
          </h2>
        </div>
      </section>

      <section className="relative px-3 pb-4 md:px-5">
        <div
          data-rise
          className="mx-auto grid max-w-[1180px] items-end overflow-hidden rounded-[28px] bg-[#f6f6f4] md:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]"
        >
          <div className="px-6 py-10 md:px-10 md:py-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">Our clients</p>
            <h2 className="mt-3 max-w-xl font-display text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[0.95] tracking-tight">
              <span data-pill className="inline-flex items-center rounded-full bg-[#d5f5a8] px-[0.34em] py-[0.02em]">
                Sales skyrocket
              </span>
              <span className="mt-[0.12em] block">within the first year</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-black/55 md:text-base">
              of using our{" "}
              <span data-pill className="inline-flex items-center gap-[0.16em] rounded-full bg-[#b7dff6] px-[0.34em] py-[0.02em] text-[#161616]">
                WEBSITE+SEO
                <span aria-hidden>✦</span>
              </span>{" "}
              offer.
            </p>
          </div>
          <div className="relative h-56 w-full md:h-full md:min-h-[280px]">
            <video
              src="/videos/sales-skyrocket-cream.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-contain object-bottom md:object-right-bottom"
              aria-label="A figure launching upward"
            />
          </div>
        </div>
      </section>

      <section className="relative px-3 pb-4 md:px-5">
        <div data-performance className="relative mx-auto max-w-[1180px]">
          <div className="relative min-h-[min(88svh,720px)] overflow-hidden rounded-[28px] md:min-h-[min(78vh,720px)]">
            {/* Slide 1 — Execution Roadmap */}
            <article
              data-perf-slide
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] bg-[#111111] px-4 py-5 text-white sm:px-5 md:px-8 md:py-7"
            >
              <header className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                  </span>
                  <span className="rounded-md border border-white/25 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/80">
                    Strategy &amp; Execution
                  </span>
                </div>
                <p className="hidden text-[10px] uppercase tracking-[0.16em] text-white/45 sm:block">
                  © 2026. Skytech Ghana. All rights reserved.
                </p>
              </header>

              <h2 className="mt-6 font-display text-[clamp(1.85rem,8vw,4.6rem)] font-medium leading-[0.95] tracking-tight sm:mt-10 md:mt-14 md:text-[clamp(2.4rem,6vw,4.6rem)]">
                How we do it
              </h2>

              <div className="relative mt-8 sm:mt-10" aria-hidden>
                <div className="absolute left-[12%] right-[12%] top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
                  <div
                    data-roadmap-progress
                    className="h-full w-full origin-left scale-x-0 bg-[#4ADE80]"
                  />
                </div>
                <div className="relative grid grid-cols-4">
                  {roadmapSteps.map((step, index) => (
                    <span
                      key={step.year}
                      data-roadmap-node
                      className="relative mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/35 bg-white"
                    >
                      <svg
                        data-roadmap-check
                        viewBox="0 0 20 20"
                        className="h-4 w-4 opacity-0"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M5 10.5 8.2 13.5 15 6.5"
                          stroke="#ffffff"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        data-roadmap-num
                        className="absolute text-sm font-semibold text-black/40"
                      >
                        {index + 1}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid flex-1 grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 md:mt-10 md:grid-cols-4">
                {roadmapSteps.map((step) => (
                  <div
                    key={step.year}
                    data-roadmap-card
                    className="flex min-h-0 flex-col rounded-[16px] bg-white p-3 text-[#161616] sm:min-h-[180px] sm:rounded-[18px] sm:p-4"
                  >
                    <span className="w-fit rounded-full bg-[#d9d9d9] px-3 py-1 text-[11px] font-medium">
                      {step.year}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-medium tracking-tight sm:mt-4 sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-black/55 sm:mt-3">{step.body}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* Slide 2 — Problem & Solution */}
            <article
              data-perf-slide
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] bg-[#d9d9d9] px-4 pt-5 text-[#161616] opacity-0 sm:px-5 md:px-8 md:pt-7"
            >
              <header className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#161616]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#161616]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#161616]" />
                  </span>
                  <span className="rounded-md border border-black/20 bg-white/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]">
                    Problem &amp; Solution
                  </span>
                </div>
                <p className="hidden text-[10px] uppercase tracking-[0.16em] text-black/40 sm:block">
                  © 2026. Skytech Ghana. All rights reserved.
                </p>
              </header>

              <h2 className="mt-8 max-w-4xl shrink-0 font-display text-[clamp(1.75rem,4.2vw,3.35rem)] font-medium leading-[1.05] tracking-tight md:mt-10">
                <span data-pill className="inline-flex items-center rounded-full bg-[#d5f5a8] px-[0.28em] py-[0.02em] text-[#161616]">
                  Our solution
                </span>{" "}
                bridges the gap between evolving needs and effective execution.
              </h2>

              <div className="mt-6 grid gap-2.5 sm:mt-auto sm:gap-3 md:grid-cols-3">
                {solutionConcepts.map((concept) => (
                  <div
                    key={concept.id}
                    data-concept
                    className="relative z-10 rounded-[16px] bg-white px-4 py-3.5 sm:rounded-none sm:px-5 sm:py-4 md:rounded-t-[18px] md:py-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-lg font-medium tracking-tight sm:text-xl md:text-2xl">
                          {concept.label}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-black/55">{concept.detail}</p>
                      </div>
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#161616]" aria-hidden />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Slide 3 — Marketing & Growth */}
            <article
              data-perf-slide
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] bg-[#b7dff6] px-4 py-5 text-[#161616] opacity-0 sm:px-5 md:px-8 md:py-7"
            >
              <header className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#161616]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#161616]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#161616]" />
                  </span>
                  <span className="rounded-md border border-black/15 bg-white/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]">
                    Strategy &amp; Execution
                  </span>
                </div>
                <p className="hidden text-[10px] uppercase tracking-[0.16em] text-black/45 sm:block">
                  © 2026. Skytech Ghana. All rights reserved.
                </p>
              </header>

              <div className="mt-8 grid flex-1 items-center gap-6 sm:mt-12 sm:gap-10 md:mt-16 md:grid-cols-[1.05fr_.95fr] md:gap-8">
                <div className="min-w-0">
                  <h2 className="font-display text-[clamp(1.85rem,7vw,4rem)] font-medium leading-[1.02] tracking-tight md:text-[clamp(2.2rem,5vw,4rem)] md:leading-[0.98]">
                    Marketing &amp; Growth{" "}
                    <span data-pill className="inline-flex items-center rounded-full bg-[#d5f5a8] px-[0.28em] py-[0.02em]">
                      Objectives
                    </span>
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-black/65 sm:mt-5 md:text-base">
                    Performance-driven objectives aligned with scalable growth within the first 3 years. Clear, measurable growth targets guide our execution.
                  </p>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {growthMetrics.map((metric, index) => (
                    <div
                      key={metric.label}
                      data-metric
                      className={`flex items-center justify-between gap-3 rounded-full p-1.5 pl-1.5 sm:gap-4 sm:p-2 sm:pl-2 ${
                        index % 2 === 0 ? "bg-white/80" : "bg-[#d5f5a8]/90"
                      }`}
                    >
                      <span className="rounded-full bg-white px-3 py-2.5 text-xs font-medium shadow-sm sm:px-4 sm:py-3 sm:text-sm">
                        {metric.label}
                      </span>
                      <span className="pr-3 font-display text-2xl font-medium tracking-tight sm:pr-5 sm:text-3xl md:text-4xl">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative px-3 pb-4 md:px-5">
        <a
          href="#offers"
          data-rise
          className="mx-auto block max-w-[1180px] overflow-hidden rounded-[28px] bg-[#161616] px-5 py-10 text-white md:px-10 md:py-14"
        >
          <p className="font-display text-[clamp(2.4rem,6.4vw,5.2rem)] font-medium leading-[0.92] tracking-tight">
            <span className="flex flex-wrap items-baseline gap-x-[0.22em]">
              Grab our
              <span className="text-[0.68em]">website+SEO</span>
              offer
            </span>
            <span className="mt-[0.08em] flex flex-wrap items-center gap-x-3 gap-y-2">
              for
              <span className="inline-flex items-center">
                <span data-pill className="inline-flex items-center rounded-full bg-[#b7dff6] px-[0.38em] py-[0.02em] text-[#161616]">
                  only {websitePricePlain}
                </span>
                .
              </span>
            </span>
          </p>
        </a>
      </section>

      <section className="relative px-3 pb-3 pt-6 md:px-5 md:pb-4 md:pt-10">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">More offers</p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.85rem,3.6vw,2.75rem)] font-medium leading-[1.05] tracking-tight">
            But that’s not all — we have other solutions to show you.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/55 md:text-base">
            Our customer management software and virtual tour experience.
          </p>
        </div>
      </section>

      <section className="relative px-3 pb-4 md:px-5">
        <div data-rise className="mx-auto grid max-w-[1180px] items-center gap-8 overflow-hidden rounded-[28px] bg-[#d5f5a8] px-6 py-10 md:grid-cols-[1.05fr_.95fr] md:px-10 md:py-12">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/50">
              {tourService?.kicker || "Virtual tour"}
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl">
              {tourService?.line || "Walk the room before you book."}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-black/70 md:text-base">
              {tourService?.body ||
                "A guest, a buyer, or an organiser can move through the space before they arrive. Built for hospitality and property."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tourTags.map((industry) => (
                <span key={industry} className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium">
                  {industry}
                </span>
              ))}
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-[clamp(1.8rem,4vw,3.2rem)] font-medium leading-none tracking-tight">
              For only
              <span className="inline-flex rounded-full bg-[#161616] px-[0.42em] py-[0.06em] text-white">
                {tourPrice}
              </span>
            </p>
          </div>
          <div className="relative h-72 overflow-hidden rounded-[24px] md:h-[420px]">
            <video
              src={tourService?.videoSrc || "/videos/virtual-tour.mp4"}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              aria-label={tourService?.imageAlt || tourService?.line || "A walk through a property before you book"}
            />
          </div>
        </div>
      </section>

      <section className="relative px-3 pb-4 md:px-5">
        <div data-rise className="mx-auto grid max-w-[1180px] items-center gap-6 overflow-hidden rounded-[28px] bg-[#b7dff6] px-6 py-8 md:grid-cols-[1.05fr_.95fr] md:gap-8 md:px-10 md:py-9">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/50">
              {crmService?.kicker || "Customer management software"}
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium leading-[1.02] tracking-tight md:text-5xl">
              {crmService?.line || "Keep every customer in one place."}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-black/70">
              {crmService?.body ||
                "Names, what they asked for, and whether they have paid — so you always know who to follow up next."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {crmPoints.map((point) => (
                <span key={point} className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium">
                  {point}
                </span>
              ))}
            </div>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-[clamp(1.55rem,3.2vw,2.4rem)] font-medium leading-none tracking-tight">
              <span className="inline-flex rounded-full bg-[#161616] px-[0.42em] py-[0.06em] text-white">
                {crmMonthly}
              </span>
              / month
              <span className="text-[0.55em] font-medium text-black/55">· {crmYearly} / year</span>
            </p>
          </div>
          <div className="relative h-56 overflow-hidden rounded-[24px] md:h-[300px]">
            <Image
              src={crmService?.image || "/images/crm-board-crop.jpg"}
              alt={crmService?.imageAlt || "Customer list showing names, requests, and payment status"}
              fill
              className="object-cover object-left"
              sizes="(min-width: 768px) 420px, 100vw"
            />
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden py-8">
        <div className="animate-marquee flex w-max gap-8 text-2xl font-medium tracking-tight md:text-4xl">
          {[...ribbon, ...ribbon, ...ribbon, ...ribbon].map((word, index) => (
            <span key={`${word}-${index}`} className="flex items-center gap-8">
              {word}
              <span className="text-black/30">→</span>
            </span>
          ))}
        </div>
      </div>

      <section id="offers" className="relative px-3 pb-4 md:px-5">
        <div data-rise className="mx-auto max-w-[1180px] rounded-[28px] bg-[#f6f6f4] px-6 py-12 md:px-10">
          <h2 className="max-w-xl font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
            Choose the offer that fits. We take it from there.
          </h2>
          <div className="mt-8">
            <ServiceOffers menus={menus} />
          </div>
        </div>
      </section>

      <CustomerSay stories={reviews} />

      <TeamHang members={members} />

      <PartnersTrust partners={partners} />

      <HowItWorks />

      <ThankYouFooter className="mt-2" />
    </article>
  );
}
