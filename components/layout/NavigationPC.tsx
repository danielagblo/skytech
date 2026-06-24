'use client'

import Image from "next/image";
import skytechLogo from "@/assets/images/skytechLogo.png"
import { useRouter, usePathname } from "next/navigation";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Web Solutions", href: "/web-solutions" },
  { name: "Security Systems", href: "/security-systems" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Internship", href: "/internship" },
  { name: "FAQs", href: "/faqs" },
];
function NavigationPC({ className }: { className?: string }) {
  
  const router = useRouter();
  const currentPath = usePathname();

  return (
    <div className={`${className ?? ""} flex items-center justify-between px-2 mix-blend-difference`}>
      <Image
        src={skytechLogo}
        alt="SkyTech Logo"
        className="h-14 w-auto cursor-pointer hover:scale-102 transition"
        onClick={() => router.push("/")}
      />
      <nav>
        <ul className="flex mix-blend-difference text-white flex-row items-center gap-6">
          {navigationLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className={`whitespace-nowrap mix-blend-difference ${currentPath === link.href ? "underline underline-offset-10 font-bold decoration-2" : "hover:text-blue-300"}`}
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