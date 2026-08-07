"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { navigationLinks } from "@/app/lib/navigationLinks";

function NavigationPC({ className }: { className?: string }) {
  const router = useRouter();
  const currentPath = usePathname();

  return (
    <div
      className={`${className ?? ""} flex items-center justify-between gap-4 px-6 py-2 bg-brand-700/95 backdrop-blur-md shadow-soft`}
    >
      <Image
        src="/images/images/skytechLogo.png"
        alt="SkyTech Logo"
        width={56}
        height={56}
        className="h-12 w-auto cursor-pointer transition hover:scale-[1.02]"
        onClick={() => router.push("/site")}
      />
      <nav>
        <ul className="flex items-center gap-7 pr-4">
          {navigationLinks.map((link) => {
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