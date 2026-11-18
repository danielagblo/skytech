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
import ServiceOffers from "@/components/skytech/sections/ServiceOffers";
import CustomerSay, { type CustomerStory } from "@/components/skytech/sections/home/CustomerSay";
import TeamHang, { type HangMember } from "@/components/skytech/sections/home/TeamHang";
import ThankYouFooter from "@/components/skytech/layout/ThankYouFooter";
import type { ServiceMenu } from "@/lib/crm/service-offers";
import type { FilmServiceItem } from "@/app/lib/services-shared";

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

const statements = [
  { lead: "Even after launch, the work stays with", mark: "Skytech Ghana", rest: "in Accra." },
  { lead: "Introducing", mark: "websites", rest: "that stay useful" },
  { lead: "Introducing", mark: "apps", rest: "your customers finish" },
  { lead: "Introducing", mark: "SEO", rest: "that keeps working" },
  { lead: "Introducing", mark: "virtual tours", rest: "you can walk" },
  { lead: "Introducing", mark: "a CRM", rest: "that keeps the client" },
];

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
}: {
  partners: FilmPartner[];
  reviews?: CustomerStory[];
  members?: HangMember[];
  menus?: ServiceMenu[];
  services?: FilmServiceItem[];
}) {
  const root = useRef<HTMLElement>(null);
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
          gsap.utils.toArray<HTMLElement>("[data-pill]").forEach((pill, index) => {
            gsap.to(pill, {
              backgroundColor: index % 2 === 0 ? "#b7dff6" : "#d5f5a8",
              duration: 2.8,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.7,
            });
          });
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

      // Mobile: no pin/scrub — show full card content without clipping or dimming
      const mobilePerf = gsap.matchMedia();
      mobilePerf.add("(max-width: 767px)", () => {
        if (!performance || !slides.length) return;
        gsap.set(slides, { clearProps: "position,inset,opacity,visibility", autoAlpha: 1 });
        gsap.set(roadmapCards, { autoAlpha: 1, y: 0 });
        gsap.set(concepts, { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set("[data-metric]", { autoAlpha: 1, y: 0 });
        if (progressFill) gsap.set(progressFill, { scaleX: 1 });
        if (roadmapNodes.length) {
          gsap.set(roadmapNodes, { backgroundColor: "#4ADE80", borderColor: "#4ADE80" });
        }
        gsap.set(roadmapChecks, { autoAlpha: 1, scale: 1 });
        gsap.set(roadmapNums, { autoAlpha: 0 });
      });

      mobilePerf.add("(min-width: 768px)", () => {
        if (!performance || slides.length <= 1) return;
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
      });

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

      return () => mobilePerf.revert();
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
                  <span data-pill className="inline-flex items-center rounded-full bg-[#b7dff6] px-[0.38em] py-[0.02em]">
                    big
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
          {statements.map((line, index) => (
            <h2
              key={line.mark}
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
          <div className="relative flex flex-col gap-4 overflow-visible md:min-h-[min(78vh,720px)] md:gap-0 md:overflow-hidden md:rounded-[28px]">
            {/* Slide 1 — Execution Roadmap */}
            <article
              data-perf-slide
              className="relative flex flex-col overflow-hidden rounded-[28px] bg-[#111111] px-4 py-5 text-white sm:px-5 md:absolute md:inset-0 md:rounded-none md:px-8 md:py-7"
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

              <div className="relative mt-10 hidden md:block" aria-hidden>
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

              <div className="mt-5 grid flex-1 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3 md:mt-10 md:grid-cols-4">
                {roadmapSteps.map((step) => (
                  <div
                    key={step.year}
                    data-roadmap-card
                    className="flex min-h-0 flex-col rounded-[16px] bg-white p-3.5 text-[#161616] sm:min-h-[180px] sm:rounded-[18px] sm:p-4"
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
              className="relative flex flex-col overflow-hidden rounded-[28px] bg-[#d9d9d9] px-4 pt-5 text-[#161616] sm:px-5 md:absolute md:inset-0 md:rounded-none md:px-8 md:pt-7 md:opacity-0"
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
              className="relative flex flex-col overflow-hidden rounded-[28px] bg-[#b7dff6] px-4 py-5 text-[#161616] sm:px-5 md:absolute md:inset-0 md:rounded-none md:px-8 md:py-7 md:opacity-0"
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

      <ThankYouFooter className="mt-2" />
    </article>
  );
}
