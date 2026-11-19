"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hiw]", { clearProps: "all", autoAlpha: 1, opacity: 1, y: 0 });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });
        tl.from("[data-hiw='head']", { opacity: 0, y: 16, duration: 0.45 }, 0)
          .from("[data-hiw='visual']", { opacity: 0, y: 24, duration: 0.55 }, 0.08)
          .from("[data-hiw='step']", { opacity: 0, y: 18, duration: 0.4, stagger: 0.1 }, 0.18)
          .from("[data-hiw='line']", { scaleY: 0, duration: 0.65, ease: "power2.inOut" }, 0.2);

        ScrollTrigger.create({
          trigger: root.current,
          start: "top 82%",
          end: "bottom top",
          onEnter: () => tl.restart(),
          onEnterBack: () => tl.restart(),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative px-3 pb-4 pt-2 md:px-5">
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-white px-5 py-10 sm:px-8 sm:py-12 md:px-12 md:py-14">
        <header data-hiw="head" className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">From the founder</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] font-medium tracking-tight text-[#161616]">
            Founder&apos;s note
          </h2>
        </header>

        <div className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div data-hiw="visual" className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#f3f3f1] sm:aspect-[5/6]">
              <Image
                src="/images/images/manSitting.png"
                alt="Skytech Ghana work in progress"
                fill
                className="object-cover object-[50%_20%]"
                sizes="(min-width: 1024px) 520px, 90vw"
              />
            </div>

            <div className="absolute -bottom-4 right-3 w-[min(78%,18rem)] rounded-[20px] border border-black/5 bg-white p-3 shadow-[0_18px_40px_rgba(0,0,0,0.12)] sm:-bottom-6 sm:right-[-0.75rem] sm:w-[15.5rem] sm:p-3.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-black/40">Website offers</p>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {["Basic", "Standard", "Shop"].map((label) => (
                  <div
                    key={label}
                    className="flex aspect-square items-end rounded-xl bg-[#f3f3f1] p-1.5 text-[9px] font-medium text-black/55"
                  >
                    {label}
                  </div>
                ))}
              </div>
              <Link
                href="#offers"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#d5f5a8] px-3 py-1.5 text-xs font-medium text-[#161616]"
              >
                See the offers
                <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>

          <div className="relative lg:pl-2">
            <div
              data-hiw="line"
              aria-hidden
              className="absolute bottom-6 left-[1.35rem] top-6 hidden w-px origin-top bg-black/10 sm:block"
            />
            <ol className="space-y-6 sm:space-y-8">
              {steps.map((step, index) => (
                <li key={step.id} data-hiw="step" className="relative flex gap-4 sm:gap-5">
                  <span
                    className={`relative z-[1] grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                      index === 0
                        ? "bg-[#d5f5a8] text-[#161616]"
                        : "border border-black/10 bg-white text-[#161616]"
                    }`}
                  >
                    {step.icon}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">{step.label}</p>
                    <p className="mt-2 text-[15px] font-medium leading-snug tracking-tight text-[#161616] sm:text-base md:text-lg">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
