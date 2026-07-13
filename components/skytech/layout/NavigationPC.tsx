"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { navigationLinks } from "@/app/lib/navigationLinks";

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

  const solid = scrolled;

  return (
    <div
      className={`${className ?? ""} flex items-center justify-between px-2 py-1 transition-colors duration-300 ${solid ? "bg-[#2f59c1]" : "bg-white/10 backdrop-blur-md"
        }`}
    >
      <Image
        src="/images/images/skytechLogo.png"
        alt="SkyTech Logo"
        width={56}
        height={56}
        className="h-14 w-auto cursor-pointer hover:scale-[1.02] transition"
        onClick={() => router.push("/site")}
      />
      <nav>
        <ul className="flex text-white flex-row items-center gap-6 pr-4">
          {navigationLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={`whitespace-nowrap ${currentPath === link.href
                  ? "underline underline-offset-[10px] font-bold decoration-2"
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
