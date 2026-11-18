"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BookMeetingButton from "@/components/skytech/ui/BookMeetingButton";

gsap.registerPlugin(useGSAP);

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function FilmNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useGSAP(
    () => {
      if (!open || !overlayRef.current || !panelRef.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(panelRef.current, { opacity: 1, y: 0 });
        gsap.set("[data-mobile-link]", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28 }, 0)
        .fromTo(
          panelRef.current,
          { opacity: 0, y: -14, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4 },
          0.04,
        )
        .fromTo(
          "[data-mobile-link]",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.32, stagger: 0.045 },
          0.12,
        );
    },
    { dependencies: [open] },
  );

  return (
    <div className={`relative ${open ? "z-[70]" : "z-40"} ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Skytech Ghana" className="inline-flex items-center transition hover:opacity-80">
            <Image
              src="/skytech-lockup.png"
              alt="Skytech Ghana"
              width={900}
              height={172}
              priority
              unoptimized
              className="h-9 w-auto md:h-10"
            />
          </Link>
          <BookMeetingButton className="hidden rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium md:inline-flex">
            Contact us
          </BookMeetingButton>
        </div>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-sm md:flex">
            {links.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 ${active ? "bg-[#d5f5a8]" : "hover:bg-black/5"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium shadow-sm transition md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-[#161616]/35 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav-panel"
            ref={panelRef}
            className="absolute left-3 right-3 top-[4.6rem] overflow-hidden rounded-[22px] border border-black/[0.06] bg-[#f6f6f4]/96 p-2 shadow-[0_24px_60px_rgba(20,20,20,.18)] backdrop-blur-md sm:left-5 sm:right-5"
          >
            <div className="flex flex-col gap-0.5">
              {links.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    data-mobile-link
                    href={item.href}
                    className={`rounded-2xl px-4 py-3.5 text-[15px] font-medium transition ${
                      active
                        ? "bg-[#d5f5a8] text-[#161616]"
                        : "text-[#161616] hover:bg-white/80 active:bg-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-2 border-t border-black/8 p-2">
              <BookMeetingButton className="flex w-full items-center justify-center rounded-2xl bg-[#161616] px-4 py-3 text-sm font-medium text-white">
                Book a meeting
              </BookMeetingButton>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
