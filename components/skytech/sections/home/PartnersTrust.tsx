"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getPartnerLogoScale } from "@/app/lib/partnerLogo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COLS = 4;
const ROWS = 3;
const MAX_LOGOS = COLS * ROWS;

type TrustPartner = {
  name: string;
  logoUrl: string;
  logoScale?: number;
  visible?: boolean;
};

export default function PartnersTrust({ partners = [] }: { partners?: TrustPartner[] }) {
  const rootRef = useRef<HTMLElement>(null);

  const logos = useMemo(
    () =>
      partners
        .filter((partner) => partner.visible !== false && Boolean(partner.logoUrl))
        .slice(0, MAX_LOGOS),
    [partners],
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-pt]", { clearProps: "all", autoAlpha: 1, opacity: 1, y: 0, x: 0, scale: 1, scaleY: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 639px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });

        tl.from("[data-pt='title']", { opacity: 0, y: 12, duration: 0.4 }, 0)
          .from("[data-pt='stat']", { opacity: 0, y: 20, scale: 0.98, duration: 0.55 }, 0.08)
          .from("[data-pt='logo']", { opacity: 0, y: 12, duration: 0.35, stagger: 0.04 }, 0.22);

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top 88%",
          end: "bottom top",
          onEnter: () => tl.restart(),
          onEnterBack: () => tl.restart(),
        });
      });

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 640px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });

        tl.from("[data-pt='title']", { opacity: 0, y: 18, duration: 0.5 }, 0)
          .from("[data-pt='stat']", { opacity: 0, y: 36, scale: 0.96, duration: 0.85 }, 0.12)
          .from("[data-pt='rule']", { scaleY: 0, duration: 0.7, ease: "power2.inOut" }, 0.28)
          .from("[data-pt='logo']", { opacity: 0, y: 18, duration: 0.45, stagger: 0.05 }, 0.35);

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top 80%",
          end: "bottom top",
          onEnter: () => tl.restart(),
          onEnterBack: () => tl.restart(),
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [logos.length] },
  );

  if (logos.length === 0) return null;

  return (
    <section
      ref={rootRef}
      className="relative overflow-x-clip px-4 py-8 sm:px-3 sm:py-10 md:px-5 md:pb-6 md:pt-12"
      style={{
        backgroundColor: "#e8e8ea",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")",
      }}
    >
      <div className="mx-auto grid max-w-[1180px] items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-0">
        <div className="relative min-w-0 max-w-full overflow-visible sm:max-w-xl lg:ml-auto lg:max-w-[30rem] lg:pr-6 xl:pr-8">
          <h2
            data-pt="title"
            className="mb-4 max-w-full font-display text-[clamp(1.7rem,8.5vw,2.35rem)] font-medium leading-[1.08] tracking-tight text-[#161616] sm:mb-6 sm:max-w-xl sm:text-4xl sm:leading-none md:text-6xl md:tracking-tight"
          >
            Our biggest{" "}
            <span className="inline-block rounded-full bg-[#d5f5a8] px-2.5 py-[0.05em] sm:px-3">
              achievement.
            </span>
          </h2>
          <div data-pt="stat" className="min-w-0">
            <Image
              src="/images/trust-95-green.png"
              alt="95% of our clients stay with us long-term"
              width={1024}
              height={604}
              unoptimized
              className="h-auto w-full max-w-[min(100%,22rem)] object-contain object-left sm:max-w-[34rem]"
            />
          </div>
        </div>

        <div className="relative min-w-0 border-t border-black/10 pt-6 sm:pt-7 lg:border-t-0 lg:pl-10 lg:pt-0 xl:pl-12">
          <div
            data-pt="rule"
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 hidden h-full w-px origin-top bg-black/10 lg:block"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {logos.map((partner, index) => {
              const scale = Math.min(getPartnerLogoScale(partner.logoScale), 1.15);
              return (
                <div
                  key={`${partner.name}-${partner.logoUrl}-${index}`}
                  data-pt="logo"
                  className="flex h-16 items-center justify-center border-b border-black/10 px-1.5 py-2 max-sm:[&:nth-last-child(-n+2)]:border-b-0 sm:h-[5.4rem] sm:border-b sm:px-3 sm:[&:nth-last-child(-n+2)]:border-b sm:[&:nth-last-child(-n+4)]:border-b-0 md:h-[5.8rem]"
                >
                  <img
                    src={partner.logoUrl}
                    alt={partner.name || "Partner"}
                    className="h-auto w-auto max-w-[92%] object-contain object-center max-sm:max-h-8 sm:max-h-11 md:max-h-12"
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
