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
      className={`${className ?? ""} flex items-center justify-between gap-4 px-6 py-2 bg-brand-700/95 backdrop-blur-md shadow-soft`}
      onMouseLeave={() => {
        setServicesOpen(false);
        setSecurityOpen(false);
      }}
    >
      <Image
        src="/try1.png"
        alt="SkyTech Logo"
        width={56}
        height={56}
        className="h-12 w-auto cursor-pointer transition hover:scale-[1.02]"
        onClick={() => router.push("/site")}
      />
      <nav>
        <ul className="flex items-center gap-6 pr-4">
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
                    className={`relative flex items-center gap-1 whitespace-nowrap text-[0.95rem] text-white transition-colors ${
                      servicesOpen || currentPath === "/site/services" || currentPath.startsWith("/site/services/")
                        ? "font-semibold"
                        : "opacity-90 hover:text-brand-100 hover:opacity-100"
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
                    className={`pointer-events-none absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-white transition-all duration-300 ${
                      servicesOpen || currentPath === "/site/services" || currentPath.startsWith("/site/services/")
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
                    <div className="w-80 rounded-none border border-slate-100 bg-white p-2 shadow-lift">
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
                            className={`flex items-center justify-between rounded-none px-4 py-3 text-sm font-medium transition-colors ${
                              currentPath === item.href
                                ? "bg-brand-50 text-brand-700"
                                : "text-slate-700 hover:bg-brand-50 hover:text-brand-700"
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
                              className={`ml-4 space-y-0.5 border-l border-slate-100 pl-3 transition-all duration-200 ${
                                securityOpen
                                  ? "mb-1 max-h-64 opacity-100"
                                  : "max-h-0 overflow-hidden opacity-0"
                              }`}
                            >
                              {item.children.map((child) => (
                                <li key={child.name}>
                                  <a
                                    href={child.href}
                                    className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
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
                  className={`relative whitespace-nowrap text-[0.95rem] text-white transition-colors ${
                    isActive
                      ? "font-semibold"
                      : "opacity-90 hover:text-brand-100 hover:opacity-100"
                  }`}
                >
                  {link.name}
                  <span
                    className={`pointer-events-none absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-white transition-all duration-300 ${
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