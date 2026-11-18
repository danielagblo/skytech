"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getPartnerLogoStyle } from "@/app/lib/partnerLogo";

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

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          paused: true,
        });

        tl.from("[data-pt='title']", { opacity: 0, y: 18, duration: 0.5 }, 0)
          .from("[data-pt='stat']", { opacity: 0, y: 36, scale: 0.96, duration: 0.85 }, 0.12)
          .from("[data-pt='copy']", { opacity: 0, y: 22, duration: 0.55 }, 0.35)
          .from("[data-pt='mission']", { opacity: 0, y: 16, duration: 0.5 }, 0.48)
          .from("[data-pt='rule']", { scaleY: 0, duration: 0.7, ease: "power2.inOut" }, 0.28)
          .from(
            "[data-pt='logo']",
            { opacity: 0, y: 18, duration: 0.45, stagger: 0.05 },
            0.4,
          );

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

  const lastRowStart = Math.floor((logos.length - 1) / COLS) * COLS;

  return (
    <section
      ref={rootRef}
      className="relative overflow-x-clip px-3 py-12 md:px-5 md:py-16"
      style={{
        backgroundColor: "#e8e8ea",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")",
      }}
    >
      <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-0">
        <div className="relative max-w-xl overflow-visible lg:ml-auto lg:max-w-[30rem] lg:pr-6 xl:pr-8">
          <h2
            data-pt="title"
            className="mb-5 max-w-xl font-display text-4xl font-medium tracking-tight text-[#161616] sm:mb-6 md:text-6xl"
          >
            Our biggest <span className="rounded-full bg-[#d5f5a8] px-3">achievement.</span>
          </h2>
          <div data-pt="stat">
            <Image
              src="/images/trust-95-green.png"
              alt="95% of our clients stay with us long-term"
              width={1024}
              height={604}
              unoptimized
              className="h-auto w-full max-w-[34rem] object-contain object-left"
            />
          </div>

          <p
            data-pt="copy"
            className="mt-6 max-w-md text-[14px] leading-relaxed text-[#2f2f2f] sm:mt-7 sm:text-[15px]"
          >
            Year after year, businesses choose Skytech Ghana for reliable websites, intelligent
            systems, and lasting support that drive real results.
          </p>
          <p
            data-pt="mission"
            className="mt-5 max-w-sm text-[14px] italic leading-relaxed text-[#161616] sm:text-[15px]"
          >
            Your success is our mission and your growth is our commitment.
          </p>
        </div>

        <div className="relative border-t border-black/10 pt-7 lg:border-t-0 lg:pl-10 lg:pt-0 xl:pl-12">
          <div
            data-pt="rule"
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 hidden h-full w-px origin-top bg-black/10 lg:block"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {logos.map((partner, index) => {
              const showRule = index < lastRowStart;
              return (
                <div
                  key={`${partner.name}-${partner.logoUrl}-${index}`}
                  data-pt="logo"
                  className={`flex h-[4.6rem] items-center justify-center px-2 sm:h-[5.4rem] sm:px-3 md:h-[5.8rem] ${
                    showRule ? "border-b border-black/10" : ""
                  }`}
                >
                  <img
                    src={partner.logoUrl}
                    alt={partner.name || "Partner"}
                    className="max-h-10 w-auto max-w-[88%] object-contain sm:max-h-11 md:max-h-12"
                    style={getPartnerLogoStyle(partner.logoScale)}
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
