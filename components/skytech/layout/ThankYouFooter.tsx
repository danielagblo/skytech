"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ThankYouFooterProps = {
  siteName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  className?: string;
};

export default function ThankYouFooter({
  siteName = "Skytech Ghana",
  contactEmail = "hello@skytechgh.com",
  contactPhone = "+233 53 831 1626",
  address = "Accra, Ghana",
  className = "",
}: ThankYouFooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const websiteHost = "www.skytechghana.com";
  const websiteHref = "https://skytechghana.com";
  const phoneHref = `tel:${contactPhone.replace(/[^\d+]/g, "")}`;

  const contacts = [
    { label: contactPhone, href: phoneHref, Icon: Phone, external: false },
    { label: websiteHost, href: websiteHref, Icon: Globe, external: true },
    { label: contactEmail, href: `mailto:${contactEmail}`, Icon: Mail, external: false },
    { label: address, href: "/contact", Icon: MapPin, external: false },
  ] as const;

  useGSAP(
    () => {
      if (!rootRef.current) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          mobile: "(max-width: 767px)",
          desktop: "(min-width: 768px)",
        },
        (context) => {
          const { reduce, mobile } = context.conditions!;

          if (reduce) {
            gsap.set(
              ["[data-ft-brand]", "[data-ft-meta]", "[data-ft-rule]", "[data-ft-thanks]", "[data-ft-aside]", "[data-ft-item]", "[data-ft-bottom]"],
              { clearProps: "all", opacity: 1, y: 0, x: 0, scaleX: 1 },
            );
            return;
          }

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: rootRef.current,
              start: mobile ? "top 92%" : "top 88%",
              once: true,
            },
          });

          tl.from("[data-ft-brand]", { opacity: 0, y: mobile ? 10 : 16, duration: 0.45 }, 0)
            .from("[data-ft-meta]", { opacity: 0, y: mobile ? 8 : 12, duration: 0.4 }, 0.06)
            .from("[data-ft-rule]", { scaleX: 0, duration: mobile ? 0.55 : 0.85, ease: "power2.inOut" }, 0.12)
            .from("[data-ft-thanks]", { opacity: 0, y: mobile ? 20 : 36, duration: mobile ? 0.55 : 0.8 }, 0.2)
            .from("[data-ft-aside]", { opacity: 0, y: mobile ? 12 : 18, duration: 0.45 }, 0.3)
            .from(
              "[data-ft-item]",
              {
                opacity: 0,
                y: mobile ? 12 : 0,
                x: mobile ? 0 : 18,
                duration: 0.4,
                stagger: mobile ? 0.06 : 0.09,
              },
              0.34,
            )
            .from("[data-ft-bottom]", { opacity: 0, y: 8, duration: 0.4 }, 0.55);
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <footer
      ref={rootRef}
      className={`relative overflow-hidden text-[#2a2a2a] ${className}`}
      style={{
        background:
          "radial-gradient(ellipse 70% 55% at 62% 42%, rgba(246, 246, 244, 0.9) 0%, rgba(232, 232, 234, 0.55) 42%, transparent 72%), #e8e8ea",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-8 hidden h-48 w-48 opacity-[0.12] sm:block md:-bottom-16 md:-left-10 md:h-64 md:w-64 md:opacity-[0.14]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='240' height='240' viewBox='0 0 240 240' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 120 L80 50 L160 50 L200 120 L160 190 L80 190 Z' stroke='%232a2a2a' stroke-width='1.2'/%3E%3Cpath d='M70 120 L100 70 L150 70 L180 120 L150 170 L100 170 Z' stroke='%232a2a2a' stroke-width='1'/%3E%3Cpath d='M100 120 L115 95 L145 95 L160 120 L145 145 L115 145 Z' stroke='%232a2a2a' stroke-width='0.8'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />

      <div className="relative mx-auto w-full max-w-[80rem] px-4 pb-7 pt-10 sm:px-6 sm:pb-8 sm:pt-12 md:px-8 md:pb-10 md:pt-16">
        <div className="flex items-end justify-between gap-3 sm:gap-6">
          <Link href="/" data-ft-brand className="inline-flex min-w-0 items-center transition hover:opacity-80">
            <Image
              src="/skytech-lockup.png"
              alt={siteName}
              width={900}
              height={172}
              unoptimized
              className="h-7 w-auto max-w-[58vw] object-contain object-left sm:h-9 sm:max-w-none md:h-10"
            />
          </Link>
          <div data-ft-meta className="shrink-0 text-right text-[11px] leading-snug text-[#3a3a3a] sm:text-[12px] md:text-sm">
            <p>Based in</p>
            <p className="font-semibold">Accra, Ghana</p>
          </div>
        </div>

        <div data-ft-rule className="mt-4 h-px origin-left bg-[#3a3a3a]/70 sm:mt-5 md:mt-6" />

        <div className="mt-8 grid gap-8 sm:mt-10 sm:gap-10 md:mt-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:items-end md:gap-10 lg:mt-16">
          <div data-ft-thanks className="relative min-w-0 max-w-3xl">
            <h2 className="font-display text-[clamp(2.35rem,13vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[#242424] sm:leading-[0.88]">
              Thank
              <br />
              You
            </h2>
            <p
              data-ft-aside
              className="mt-3 max-w-[12rem] text-[13px] leading-snug text-[#3f3f3f] sm:text-sm md:absolute md:bottom-[0.55em] md:left-[min(52%,18rem)] md:mt-0 md:max-w-[11rem] md:text-[15px]"
            >
              for your time
              <br />
              and attention
            </p>
          </div>

          <ul className="grid gap-1 sm:gap-2 md:justify-self-end md:space-y-1 md:pb-2">
            {contacts.map(({ label, href, Icon, external }) => (
              <li key={label} data-ft-item>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex min-h-11 items-center gap-3 rounded-xl px-1 py-2 text-[13px] text-[#2f2f2f] transition hover:text-black active:bg-black/[0.03] sm:min-h-0 sm:rounded-none sm:px-0 sm:py-1.5 sm:text-sm md:text-[15px]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2a2a2a] text-white transition group-hover:scale-105 sm:h-8 sm:w-8">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
                  </span>
                  <span className="min-w-0 break-words [overflow-wrap:anywhere]">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-ft-bottom
          className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-[#2a2a2a]/15 pt-4 text-[11px] leading-relaxed text-[#4a4a4a] sm:mt-12 sm:flex-row sm:items-center sm:pt-5 sm:text-xs md:mt-16"
        >
          <p>© 2026 {siteName}. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/terms-of-use" className="py-1 transition hover:text-black">
              Terms
            </Link>
            <Link href="/privacy-policy" className="py-1 transition hover:text-black">
              Privacy
            </Link>
            <Link href="/sitemap" className="py-1 transition hover:text-black">
              Sitemap
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
