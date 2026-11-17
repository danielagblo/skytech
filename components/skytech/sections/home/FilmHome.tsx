"use client";

import { useRef } from "react";
import Image from "next/image";
import FilmNav from "@/components/skytech/layout/FilmNav";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import BookMeetingButton from "@/components/skytech/ui/BookMeetingButton";
import ClientsCarousel from "@/components/skytech/sections/home/ClientsCarousel";
import ServiceOffers from "@/components/skytech/sections/ServiceOffers";
import CustomerSay, { type CustomerStory } from "@/components/skytech/sections/home/CustomerSay";
import TeamHang from "@/components/skytech/sections/home/TeamHang";

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
const reelThumbs = [
  "/images/images/corporateTableImage.png",
  "/images/about-hero.png",
  "/images/images/manFixingCamera.png",
  "/images/hero-2.png",
];
const tourIndustries = ["Hospitality", "Hotels", "Apartments", "Airbnb", "Event centres", "Real estate"];
const crmPoints = ["Who called", "What they wanted", "Have they paid"];

export interface FilmPartner {
  name: string;
  logoUrl: string;
  colSpan?: number;
  rowSpan?: number;
  logoScale?: number;
  visible?: boolean;
}

export default function FilmHome({
  partners,
  reviews = [],
}: {
  subText?: string;
  partners: FilmPartner[];
  reviews?: CustomerStory[];
}) {
  const root = useRef<HTMLElement>(null);

  useLenis(() => {
    ScrollTrigger.update();
  });

  useGSAP((_, contextSafe) => {
    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const open = gsap.timeline({ defaults: { ease: "power3.out" } });
      open.fromTo("[data-hero-item]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.05 });
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
    });

    motion.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-hero-item]", { opacity: 1, y: 0 });
      gsap.set("[data-statement]", { opacity: 1, y: 0, position: "relative" });
    });

    return () => motion.revert();
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
                className="font-display text-[clamp(2.5rem,8.2vw,6.6rem)] font-medium leading-[0.9] tracking-tight"
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
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
            {reelThumbs.map((src) => (
              <div key={src} className="relative h-14 w-20 overflow-hidden rounded-xl">
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-3 pb-4 md:px-5">
        <div data-rise className="mx-auto max-w-[1180px] overflow-hidden rounded-[28px]">
          <div className="bg-[#f6f6f4] px-5 py-12 md:px-10 md:py-16">
            <h2 className="font-display text-[clamp(2.7rem,8.4vw,6.8rem)] font-medium leading-[0.88] tracking-tight">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                Customers
                <span data-pill className="inline-flex items-center rounded-full bg-[#b7dff6] px-[0.38em] py-[0.02em]">
                  find you
                </span>
              </span>
              <span className="mt-[0.08em] flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <span>when they search.</span>
                <span className="max-w-[15rem] pb-1 text-[13px] font-normal leading-snug tracking-normal text-black/55 md:max-w-xs md:text-base">
                  Your page takes the enquiry, the booking, or the order.
                </span>
              </span>
              <span className="mt-[0.12em] flex flex-wrap items-center gap-3 md:gap-5">
                <span className="grid h-[3.1rem] w-[3.1rem] shrink-0 place-items-center rounded-full border border-[#8dce3a] text-center text-[8px] font-medium uppercase leading-tight tracking-[0.12em] md:h-[4.4rem] md:w-[4.4rem] md:text-[10px]">
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
          <a href="#offers" className="block bg-[#161616] px-5 py-10 text-white md:px-10 md:py-14">
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
                    only GHS 8,399
                  </span>
                  .
                </span>
              </span>
            </p>
          </a>
        </div>
      </section>

      <section className="relative px-3 pb-4 md:px-5">
        <div data-rise className="relative mx-auto flex max-w-[1180px] items-center overflow-hidden rounded-[28px] bg-[#f6f6f4] px-5 py-5 md:px-10 md:py-6">
          <h2 className="relative z-10 max-w-[36rem] font-display text-[clamp(2rem,3.8vw,3.35rem)] font-medium leading-[0.92] tracking-tight">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">Our clients</span>
            <span className="mt-[0.04em] flex flex-wrap items-center gap-x-3 gap-y-1">
              <span data-pill className="inline-flex items-center rounded-full bg-[#d5f5a8] px-[0.32em] py-[0.02em]">
                Sales skyrocket
              </span>
            </span>
            <span className="mt-[0.06em] block text-[0.62em] leading-[1.05]">
              within the first year of using our
            </span>
            <span className="mt-[0.04em] flex flex-wrap items-center gap-x-3 gap-y-1">
              <span data-pill className="inline-flex items-center gap-[0.16em] rounded-full bg-[#b7dff6] px-[0.32em] py-[0.02em]">
                WEBSITE+SEO
                <span aria-hidden>✦</span>
              </span>
              offer
            </span>
          </h2>
          <div className="pointer-events-none absolute bottom-5 right-6 top-5 w-[38%]">
            <video
              src="/videos/sales-skyrocket-cream.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute bottom-0 right-0 top-0 h-full w-auto max-w-full object-contain object-right"
              aria-label="A figure launching upward"
            />
          </div>
        </div>
      </section>

      <section className="relative px-3 pb-4 md:px-5">
        <div data-rise className="mx-auto grid max-w-[1180px] items-center gap-8 overflow-hidden rounded-[28px] bg-[#d5f5a8] px-6 py-10 md:grid-cols-[1.05fr_.95fr] md:px-10 md:py-12">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/50">Virtual tour</p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl">
              Walk the room before you book.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-black/70 md:text-base">
              A guest, a buyer, or an organiser can move through the space before they arrive. Built for hospitality and property.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tourIndustries.map((industry) => (
                <span key={industry} className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium">
                  {industry}
                </span>
              ))}
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-[clamp(1.8rem,4vw,3.2rem)] font-medium leading-none tracking-tight">
              For only
              <span className="inline-flex rounded-full bg-[#161616] px-[0.42em] py-[0.06em] text-white">
                GH₵8,799
              </span>
            </p>
          </div>
          <div className="relative h-72 overflow-hidden rounded-[24px] md:h-[420px]">
            <video
              src="/videos/virtual-tour.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              aria-label="A walk through a property before you book"
            />
          </div>
        </div>
      </section>

      <section className="relative px-3 pb-4 md:px-5">
        <div data-rise className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[28px] bg-[#b7dff6] md:grid-cols-[1.05fr_.95fr]">
          <div className="px-6 py-10 md:px-10 md:py-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/50">CRM</p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl">
              Know who to call back.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-black/70 md:text-base">
              A customer asks today. Tomorrow their name is still here, with what they wanted, and whether they have paid.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {crmPoints.map((point) => (
                <span key={point} className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium">
                  {point}
                </span>
              ))}
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-[clamp(1.8rem,4vw,3.2rem)] font-medium leading-none tracking-tight">
              Priced with
              <span className="inline-flex rounded-full bg-[#161616] px-[0.42em] py-[0.06em] text-white">
                the brief
              </span>
            </p>
          </div>
          <div className="flex items-end justify-end">
            <Image
              src="/images/crm-board-crop.jpg"
              alt="A list of customers, who called, and whether they have paid"
              width={1024}
              height={665}
              className="h-auto w-full md:w-[74%]"
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
            Pick the offer. We take the build.
          </h2>
          <div className="mt-8">
            <ServiceOffers />
          </div>
        </div>
      </section>

      <CustomerSay stories={reviews} />

      <TeamHang />

      {partners.length > 0 ? (
        <section className="relative px-3 pb-16 md:px-5">
          <div data-rise className="mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-[#f6f6f4] py-10">
            <p className="mb-6 text-center text-xs uppercase tracking-[0.18em] text-black/45">Our partners</p>
            <ClientsCarousel partners={partners} />
          </div>
        </section>
      ) : null}
    </article>
  );
}
