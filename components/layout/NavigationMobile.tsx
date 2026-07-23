"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import skytechLogo from "@/assets/images/skytechLogo.png";
import { navigationLinks } from "../../lib/utils/navigationLinks";

function NavigationMobile({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const currentPath = usePathname();
  const isLandingPage = currentPath === "/landing";

useEffect(() => {
  // if (!isLandingPage) return;

  const onScroll = () => {
    setScrolled(window.scrollY > 40);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => window.removeEventListener("scroll", onScroll);
}, [isLandingPage]);

useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const { position, top, width, overflow } = document.body.style;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      document.body.style.overflow = overflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

const showSolidBar = scrolled;

  return (
    <div className={className ?? ""}>
      <div className="relative z-50">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-[#2f59c1] shadow-sm transition-all duration-300 ${
            showSolidBar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        />

        <div className="relative flex items-center justify-between px-4 py-2">
          <div
            className={`transition-all duration-300 ${
              showSolidBar ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            <Image
              src={skytechLogo}
              alt="SkyTech Logo"
              className="h-11 w-auto cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                router.push("/");
              }}
            />
          </div>

          {!isLandingPage && (
            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
              className={`relative ml-auto flex h-10 w-10 flex-col items-center justify-center gap-1.5 ${
                showSolidBar ? "" : "mix-blend-difference"
              }`}
            >
              <span
                className={`h-0.5 w-6 transition-all duration-300 ${
                  showSolidBar ? "bg-white" : "bg-white"
                } ${isOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-6 transition-all duration-300 ${
                  showSolidBar ? "bg-white" : "bg-white"
                } ${isOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`h-0.5 w-6 transition-all duration-300 ${
                  showSolidBar ? "bg-white" : "bg-white"
                } ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 flex flex-col bg-[#2f59c1] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        <nav className="flex min-h-full flex-1 flex-col justify-[safe_center] overflow-y-auto overscroll-contain px-8 py-20">
          <ul className="flex flex-col gap-1">
            {navigationLinks.map((link, i) => {
              const isActive = currentPath === link.href;
              return (
                <li
                  key={link.name}
                  className={`border-b border-white/10 py-4 transition-all duration-300 ${
                    isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: isOpen ? `${i * 40 + 100}ms` : "0ms" }}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between text-2xl text-white ${
                      isActive ? "font-bold" : "font-medium text-white/80"
                    }`}
                  >
                    {link.name}
                    {isActive && <span className="h-2 w-2 rounded-full bg-white" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default NavigationMobile;