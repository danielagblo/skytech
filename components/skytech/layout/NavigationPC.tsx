"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { navigationLinks, servicesNav } from "@/app/lib/navigationLinks";

function NavigationPC({ className }: { className?: string }) {
  const router = useRouter();
  const currentPath = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  return (
    <div
      className={`${className ?? ""} flex items-center justify-between gap-6 border-b border-white/10 bg-[#0C0D10] px-6 py-2`}
      onMouseLeave={() => {
        setServicesOpen(false);
        setSecurityOpen(false);
      }}
    >
      <Image
        src="/try1.png"
        alt="SkyTech Logo"
        width={800}
        height={300}
        sizes="128px"
        className="h-12 w-auto cursor-pointer transition hover:opacity-90"
        onClick={() => router.push("/")}
      />
      <nav>
        <ul className="flex items-center gap-4 pr-2">
          {navigationLinks.map((link) => {
            if (link.name === "Services") {
              return (
                <li key={link.name} className="relative">
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    onClick={() => {
                      setServicesOpen((v) => !v);
                    }}
                    className={`relative flex items-center gap-1 whitespace-nowrap text-[0.92rem] tracking-wide transition-colors ${
                      servicesOpen || currentPath === "/services" || currentPath.startsWith("/services/")
                        ? "font-medium text-white"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.name}
                    <svg
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <span
                    className={`pointer-events-none absolute -bottom-1.5 left-0 h-px bg-[#1E5AC8] transition-all duration-300 ${
                      servicesOpen || currentPath === "/services" || currentPath.startsWith("/services/")
                        ? "w-full"
                        : "w-0"
                    }`}
                  />

                  <div
                    className={`absolute left-0 top-full pt-3 transition-all duration-200 ${
                      servicesOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="w-80 border border-[#E3DDD4] bg-[#F6F4F0] p-2">
                      {servicesNav.map((item) => (
                        <div
                          key={item.name}
                          className="rounded-none"
                          onMouseEnter={() =>
                            setSecurityOpen(item.name === "Security Systems")
                          }
                          onMouseLeave={() => setSecurityOpen(false)}
                        >
                          <a
                            href={item.href}
                            className={`flex items-center justify-between border-l-2 px-4 py-3 text-sm transition-colors ${
                              currentPath === item.href
                                ? "border-[#1E5AC8] bg-white font-medium text-[#141413]"
                                : "border-transparent text-[#141413] hover:bg-white"
                            }`}
                          >
                            {item.name}
                            {item.children && (
                              <svg
                                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${
                                  securityOpen ? "rotate-90" : ""
                                }`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                              </svg>
                            )}
                          </a>

                          {item.children && (
                            <ul
                              className={`ml-4 space-y-0.5 border-l border-[#E3DDD4] pl-3 transition-all duration-200 ${
                                securityOpen
                                  ? "mb-1 max-h-64 opacity-100"
                                  : "max-h-0 overflow-hidden opacity-0"
                              }`}
                            >
                              {item.children.map((child) => (
                                <li key={child.name}>
                                  <a
                                    href={child.href}
                                    className="block px-3 py-2 text-sm text-[#5C574F] transition-colors hover:bg-white hover:text-[#141413]"
                                  >
                                    {child.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              );
            }

            const isActive = currentPath === link.href;
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`relative whitespace-nowrap text-[0.92rem] tracking-wide transition-colors ${
                    isActive
                      ? "font-medium text-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.name}
                  <span
                    className={`pointer-events-none absolute -bottom-1.5 left-0 h-px bg-[#1E5AC8] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default NavigationPC;