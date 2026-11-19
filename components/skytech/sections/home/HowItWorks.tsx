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
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
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
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
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
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
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
        tl.from("[data-hiw='head']", { opacity: 0, y: 12, duration: 0.4 }, 0)
          .from("[data-hiw='visual']", { opacity: 0, y: 16, duration: 0.45 }, 0.06)
          .from("[data-hiw='step']", { opacity: 0, y: 12, duration: 0.35, stagger: 0.08 }, 0.12)
          .from("[data-hiw='line']", { scaleY: 0, duration: 0.55, ease: "power2.inOut" }, 0.14);

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
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-white px-5 py-6 sm:px-8 sm:py-7 md:px-10 md:py-8">
        <header data-hiw="head" className="max-w-2xl">
          <h2 className="font-display text-[clamp(1.7rem,3.8vw,2.5rem)] font-medium tracking-tight text-[#161616]">
            Founder&apos;s Remark
          </h2>
        </header>

        <div className="mt-5 grid items-center gap-6 lg:mt-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
          <div data-hiw="visual" className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
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

          <div className="relative lg:pl-1">
            <div
              data-hiw="line"
              aria-hidden
              className="absolute bottom-3 left-[1.15rem] top-3 hidden w-px origin-top bg-black/10 sm:block"
            />
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li key={step.id} data-hiw="step" className="relative flex gap-3.5">
                  <span
                    className={`relative z-[1] grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                      index === 0
                        ? "bg-[#d5f5a8] text-[#161616]"
                        : "border border-black/10 bg-white text-[#161616]"
                    }`}
                  >
                    {step.icon}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/40">{step.label}</p>
                    <p className="mt-1 text-sm font-medium leading-snug tracking-tight text-[#161616] sm:text-[15px]">
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
