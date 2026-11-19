"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    id: "choose",
    label: "01",
    body: "Year after year, businesses choose us for reliable digital business development services.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M12 3.5 14.2 8l4.8.7-3.5 3.4.8 4.8L12 14.8 7.7 17l.8-4.8L5 8.7 9.8 8 12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "support",
    label: "02",
    body: "We provide lasting support that drives real-world results for your business.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M7 8h10v7.5a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 15.5V8Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M9 8V6.5A3 3 0 0 1 12 3.5v0A3 3 0 0 1 15 6.5V8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9.5 18.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "grow",
    label: "03",
    body: "Your success is our mission, and your growth is our commitment.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M5 16.5 10 11l3.5 3.5L19 8.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14.5 8.5H19v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useLenis(() => {
    ScrollTrigger.update();
  });

  useGSAP(
    () => {
      const pin = pinRef.current;
      if (!pin) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hiw-step]", { clearProps: "all", autoAlpha: 1, y: 0, position: "relative" });
        gsap.set("[data-hiw-dot]", { backgroundColor: "#d5f5a8" });
        gsap.set("[data-hiw-progress]", { scaleX: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-hiw-step]", pin);
        const dots = gsap.utils.toArray<HTMLElement>("[data-hiw-dot]", pin);
        const progress = pin.querySelector<HTMLElement>("[data-hiw-progress]");
        if (panels.length < 2) return;

        gsap.set(panels, { autoAlpha: 0, y: 28 });
        gsap.set(panels[0], { autoAlpha: 1, y: 0 });
        gsap.set(dots, { backgroundColor: "rgba(22,22,22,0.12)", scale: 1 });
        gsap.set(dots[0], { backgroundColor: "#d5f5a8", scale: 1.15 });
        if (progress) gsap.set(progress, { scaleX: 1 / panels.length, transformOrigin: "left center" });

        const reel = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top 12%",
            end: `+=${panels.length * 85}%`,
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        reel.to({}, { duration: 0.4 });

        panels.forEach((panel, index) => {
          if (index === 0) return;
          reel.to(panels[index - 1], { autoAlpha: 0, y: -22, duration: 0.32 }, ">");
          reel.fromTo(
            panel,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.38 },
            "<0.06",
          );
          if (dots[index - 1]) {
            reel.to(dots[index - 1], { backgroundColor: "#f3f3f1", scale: 1, duration: 0.25 }, "<");
          }
          if (dots[index]) {
            reel.to(dots[index], { backgroundColor: "#d5f5a8", scale: 1.15, duration: 0.28 }, "<");
          }
          if (progress) {
            reel.to(progress, { scaleX: (index + 1) / panels.length, duration: 0.38 }, "<");
          }
          reel.to({}, { duration: 0.42 });
        });

        reel.to({}, { duration: 0.35 });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative px-3 pb-4 pt-10 sm:pt-12 md:px-5 md:pt-16">
      {/* Pin the outer shell (no overflow) — same pattern as homepage statement cards */}
      <div ref={pinRef} className="mx-auto max-w-[1180px]">
        <div className="overflow-hidden rounded-[28px] bg-white px-5 py-7 sm:px-8 sm:py-8 md:px-10 md:py-9">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">From the founder</p>
            <h2 className="mt-2 font-display text-[clamp(1.7rem,3.8vw,2.5rem)] font-medium tracking-tight text-[#161616]">
              Founder&apos;s Remark
            </h2>
          </header>

          <div className="mt-6 grid items-center gap-7 lg:mt-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <div className="relative aspect-[16/11] overflow-hidden rounded-[20px] bg-[#f3f3f1]">
                <Image
                  src="/images/images/manSitting.png"
                  alt="Skytech Ghana work in progress"
                  fill
                  className="object-cover object-[50%_18%]"
                  sizes="(min-width: 1024px) 480px, 90vw"
                />
              </div>
              <div className="absolute bottom-3 right-3 rounded-full bg-[#d5f5a8] px-3 py-1.5 text-xs font-medium text-[#161616] shadow-sm">
                <Link href="#offers" className="inline-flex items-center gap-1.5">
                  See the offers
                  <span aria-hidden>↗</span>
                </Link>
              </div>
            </div>

            <div className="relative min-h-[13.5rem] sm:min-h-[12rem]">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/10">
                  <div data-hiw-progress className="h-full w-full origin-left scale-x-0 rounded-full bg-[#8dce3a]" />
                </div>
                <div className="flex items-center gap-2">
                  {steps.map((step) => (
                    <span
                      key={step.id}
                      data-hiw-dot
                      className="h-2.5 w-2.5 rounded-full bg-black/15"
                      aria-hidden
                    />
                  ))}
                </div>
              </div>

              {steps.map((step, index) => (
                <article
                  key={step.id}
                  data-hiw-step
                  className={`absolute inset-x-0 top-10 flex gap-4 ${index === 0 ? "" : "opacity-0"}`}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#d5f5a8] text-[#161616]">
                    {step.icon}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">{step.label}</p>
                    <p className="mt-2 font-display text-xl font-medium leading-snug tracking-tight text-[#161616] sm:text-2xl">
                      {step.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
