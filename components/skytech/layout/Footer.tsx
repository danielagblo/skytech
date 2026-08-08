"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import LetsTalkButton from "../ui/LetsTalkButton";
import type { BlogPost } from "@/app/lib/blog";
import type { SiteSettings } from "@/app/lib/settings";
import { navigationLinks } from "@/app/lib/navigationLinks";

interface FooterProps {
  latestPosts?: BlogPost[];
  sponsors?: { name: string; logoUrl: string }[];
  settings?: SiteSettings;
  whatsapp?: string;
  className?: string;
}

function Footer({ latestPosts = [], sponsors = [], settings, whatsapp, className }: FooterProps) {
  const currentPath = usePathname();
  const isLandingPage = currentPath === "/site/landing";

  if (isLandingPage) return null;

  const siteName = settings?.siteName || "Skytech Ghana";
  const siteDescription =
    settings?.siteDescription || "No 1# website development company in Ghana.";
  const contactEmail = settings?.contactEmail || "hello@skytechgh.com";
  const contactPhone = settings?.contactPhone || "";
  const address = settings?.address || "Accra, Ghana";
  const whatsappLink = whatsapp ?? settings?.whatsapp ?? "";

  return (
    <div className={className ?? "mt-auto"}>
      <div className="border-t border-white/10 bg-[#0B1220] px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-[80rem] gap-12 md:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/try1.png"
              alt={`${siteName} Logo`}
              width={56}
              height={56}
              className="h-12 w-auto opacity-90"
            />
            <p className="font-display text-lg font-semibold text-white">{siteName}</p>
            <p className="text-sm leading-relaxed text-slate-400">{siteDescription}</p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={
                  whatsappLink.startsWith("http")
                    ? whatsappLink
                    : `https://wa.me/${whatsappLink.replace(/\D/g, "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-300 ring-1 ring-white/10 transition hover:bg-slate-900 hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 00-8.66 15L2 22l5.13-1.32A10 10 0 1012 2zm0 18.18a8.15 8.15 0 01-4.14-1.13l-.3-.18-3 .77.8-2.92-.2-.31A8.18 8.18 0 1112 20.18zm4.5-6.14c-.25-.13-1.47-.73-1.7-.81s-.39-.13-.56.12-.63.82-.78.99-.29.18-.53.06a6.6 6.6 0 01-1.92-1.18 7.13 7.13 0 01-1.35-1.68c-.14-.24 0-.38.1-.5s.23-.25.35-.39a1.4 1.4 0 00.18-.3.4.4 0 000-.38c0-.12-.56-1.34-.77-1.84-.19-.49-.39-.44-.56-.44h-.48a.92.92 0 00-.66.31 2.79 2.79 0 00-.86 2.07A4.85 4.85 0 005.72 15a10 10 0 004.31 3.93 5.7 5.7 0 002.36.59 4.28 4.28 0 002.8-1.4c.4-.46.56-.68.6-.9a1.2 1.2 0 00-.2-.78c0-.13-.21-.18-.59-.4z" />
                </svg>
              </a>
              <a
                href={`mailto:${contactEmail}`}
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-brand-300 ring-1 ring-white/10 transition hover:bg-slate-900 hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company links */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Company
            </p>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="transition hover:text-brand-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest posts / Sponsors */}
          <div className="space-y-4">
            {latestPosts.length > 0 ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Key Insights
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  {latestPosts.map((post) => (
                    <li key={post.slug}>
                      <a href={`/site/insights/${post.slug}`} className="transition hover:text-brand-300">
                        {post.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Trusted by
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  {sponsors.slice(0, 5).map((sponsor, index) => (
                    <li key={`${sponsor.name}-${index}`}>{sponsor.name}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Contact */}
          <div className="flex flex-col items-start gap-4">
            <LetsTalkButton whatsapp={whatsapp ?? settings?.whatsapp} className="bg-slate-950 text-white" />
            <div className="mt-2 space-y-3 text-sm text-slate-300">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 transition hover:text-brand-300">
                <span className="text-brand-400">@</span>
                {contactEmail}
              </a>
              <a href={`tel:${contactPhone}`} className="flex items-center gap-2 transition hover:text-brand-300">
                <span className="text-brand-400">☏</span>
                {contactPhone}
              </a>
              <p className="flex items-center gap-2">
                <span className="text-brand-400">⌖</span>
                {address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0B1220] p-5">
        <div className="mx-auto flex max-w-[80rem] flex-col items-center justify-center gap-1 text-center text-sm text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-1">
          <p>Copyright © 2026 {siteName} • All rights reserved</p>
          <p className="flex items-center gap-2">
            <a href="/site/terms-of-use" className="transition hover:text-white">Terms of use</a>
            <span aria-hidden>•</span>
            <a href="/site/privacy-policy" className="transition hover:text-white">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;