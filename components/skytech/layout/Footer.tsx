"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import LetsTalkButton from "../ui/LetsTalkButton";
import type { BlogPost } from "@/app/lib/blog";

interface FooterProps {
  latestPosts?: BlogPost[];
  sponsors?: { name: string; logoUrl: string }[];
  whatsapp?: string;
  className?: string;
}

const sponsorSizes = [
  "w-[4.5rem] h-auto",
  "w-24 h-auto",
  "w-16 h-auto",
  "w-28 h-auto",
  "w-[7.5rem] h-auto",
  "w-32 h-auto",
  "w-16 h-auto",
  "w-20 h-auto",
  "w-24 h-auto",
  "w-20 h-auto",
  "w-[4.5rem] h-auto",
];

function Footer({ latestPosts = [], sponsors = [], whatsapp, className }: FooterProps) {
  const currentPath = usePathname();
  const isLandingPage = currentPath === "/site/landing";

  if (isLandingPage) return null;

  return (
    <div className={className ?? ""}>
      <div className="max-md:flex max-md:flex-col-reverse max-md:mt-6 max-md:items-center max-md:gap-6 grid grid-cols-3 px-4 gap-4 bg-[#f9f9f9]">
        <div className="flex flex-row flex-wrap items-center justify-start gap-x-2 max-md:hidden">
          {sponsors.map((sponsor, index) => (
            <div key={`${sponsor.name}-${index}`} className={`${sponsorSizes[index % sponsorSizes.length]} shrink-0`}>
              {sponsor.logoUrl && (
                <Image
                  src={sponsor.logoUrl}
                  alt={sponsor.name}
                  width={96}
                  height={48}
                  className="object-contain"
                />
              )}
            </div>
          ))}
        </div>
        <div className="md:hidden mt-4">
          <Image
            src="/images/images/sponsors/sponsorsBigPicture.png"
            alt="Sponsors"
            width={1200}
            height={400}
            className="w-full h-auto"
          />
        </div>
        <div className="space-y-6 pt-10 max-md:text-center">
          <div>
            <ul className="space-y-2">
              <li>
                <a href="/site/pricing">Best Pricing</a>
              </li>
              <li>
                <a href="/site/about">Why Choose Us?</a>
              </li>
              <li>
                <a href="/site/services">Website Development</a>
              </li>
              <li>
                <a href="/site">Award Winning Tech Company</a>
              </li>
            </ul>
          </div>
          {latestPosts.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Key Blog Articles</p>
              <ul className="space-y-2">
                {latestPosts.map((post) => (
                  <li key={post.slug}>
                    <a href={`/site/blog/${post.slug}`}>{post.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center flex-1">
          <LetsTalkButton whatsapp={whatsapp} className="bg-[#f1f1f1]" />
          <a href="mailto:info@skytechghana.com" className="text-black hover:underline">
            info@skytechghana.com
          </a>
        </div>
      </div>
      <div className="bg-black text-white p-4 flex flex-col items-center justify-center gap-1 text-center sm:flex-row sm:flex-wrap sm:gap-x-2 sm:gap-y-1">
        <p>Copyright © 2026 Skytech Ghana Inc • All rights reserved</p>
        <p className="flex items-center gap-2">
          <a href="/site/terms-of-use" className="hover:underline">
            Terms of use
          </a>
          <span aria-hidden>•</span>
          <a href="/site/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default Footer;
