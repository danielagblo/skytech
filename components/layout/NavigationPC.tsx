"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import skytechLogo from "@/assets/images/skytechLogo.png";
import { navigationLinks } from "../../lib/utils/navigationLinks";

function NavigationPC({ className }: { className?: string }) {
  const router = useRouter();
  const currentPath = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`${className ?? ""} flex items-center justify-between px-2 transition-colors duration-300 ${
        scrolled
          ? "bg-[#2f59c1]"
          : "bg-white/10 backdrop-blur-md"
      }`}
    >
      <Image
        src={skytechLogo}
        alt="SkyTech Logo"
        className="h-14 w-auto cursor-pointer hover:scale-102 transition"
        onClick={() => router.push("/")}
      />
      <nav>
        <ul className="flex text-white flex-row items-center gap-6 pr-4">
          {navigationLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={`whitespace-nowrap ${
                  currentPath === link.href
                    ? "underline underline-offset-10 font-bold decoration-2"
                    : "hover:text-blue-300"
                }`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default NavigationPC;
