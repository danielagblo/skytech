"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import LetsTalkButton from "../ui/LetsTalkButton";
import { getWhatsAppUrl } from "@/app/lib/whatsapp";
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
  const isLandingPage =
    currentPath === "/landing" ||
    currentPath === "/forms" ||
    currentPath === "/thank-you" ||
    currentPath === "/contact";

  if (isLandingPage) return null;

  const siteName = settings?.siteName || "Skytech Ghana";
  const siteDescription =
    settings?.siteDescription || "No 1# website development company in Ghana.";
  const contactEmail = settings?.contactEmail || "hello@skytechgh.com";
  const contactPhone = settings?.contactPhone || "";
  const address = settings?.address || "Accra, Ghana";
  const whatsappLink = whatsapp ?? settings?.whatsapp ?? "";

  return (
    <footer className={className ?? "mt-auto bg-[#0C0D10] text-white"}>
      <div className="border-t border-white/10 px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-[80rem] gap-12 md:grid-cols-[1.4fr_0.8fr_1fr_1fr]">
          <div className="space-y-5">
            <Image
              src="/try1.png"
              alt={`${siteName} Logo`}
              width={800}
              height={300}
              sizes="128px"
              className="h-12 w-auto"
            />
            <p className="max-w-xs text-sm leading-relaxed text-white/70">{siteDescription}</p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={getWhatsAppUrl(whatsappLink)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:border-white hover:bg-white hover:text-[#0C0D10]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 00-8.66 15L2 22l5.13-1.32A10 10 0 1012 2zm0 18.18a8.15 8.15 0 01-4.14-1.13l-.3-.18-3 .77.8-2.92-.2-.31A8.18 8.18 0 1112 20.18zm4.5-6.14c-.25-.13-1.47-.73-1.7-.81s-.39-.13-.56.12-.63.82-.78.99-.29.18-.53.06a6.6 6.6 0 01-1.92-1.18 7.13 7.13 0 01-1.35-1.68c-.14-.24 0-.38.1-.5s.23-.25.35-.39a1.4 1.4 0 00.18-.3.4.4 0 000-.38c0-.12-.56-1.34-.77-1.84-.19-.49-.39-.44-.56-.44h-.48a.92.92 0 00-.66.31 2.79 2.79 0 00-.86 2.07A4.85 4.85 0 005.72 15a10 10 0 004.31 3.93 5.7 5.7 0 002.36.59 4.28 4.28 0 002.8-1.4c.4-.46.56-.68.6-.9a1.2 1.2 0 00-.2-.78c0-.13-.21-.18-.59-.4z" />
                </svg>
              </a>
              <a
                href={`mailto:${contactEmail}`}
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:border-white hover:bg-white hover:text-[#0C0D10]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                  <rect x="3" y="5" width="18" height="14" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">Company</p>
            <ul className="space-y-2.5 text-sm text-white/80">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="transition hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            {latestPosts.length > 0 ? (
              <>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">Insights</p>
                <ul className="space-y-2.5 text-sm text-white/80">
                  {latestPosts.map((post) => (
                    <li key={post.slug}>
                      <a href={`/insights/${post.slug}`} className="transition hover:text-white">
                        {post.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">Trusted by</p>
                <ul className="space-y-2.5 text-sm text-white/80">
                  {sponsors.slice(0, 5).map((sponsor, index) => (
                    <li key={`${sponsor.name}-${index}`}>{sponsor.name}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="space-y-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">Contact</p>
            <LetsTalkButton
              whatsapp={whatsapp ?? settings?.whatsapp}
              className="border border-white/25 text-sm text-white hover:bg-white hover:text-[#0C0D10]"
            />
            <div className="space-y-3 border-t border-white/10 pt-5 text-sm text-white/80">
              <a href={`mailto:${contactEmail}`} className="block transition hover:text-white">
                {contactEmail}
              </a>
              {contactPhone ? (
                <a href={`tel:${contactPhone}`} className="block transition hover:text-white">
                  {contactPhone}
                </a>
              ) : null}
              <p>{address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5">
        <div className="mx-auto flex max-w-[80rem] flex-col items-center justify-between gap-3 text-center text-xs tracking-wide text-white/55 sm:flex-row sm:text-left">
          <p>© 2026 {siteName}. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <a href="/terms-of-use" className="transition hover:text-white">Terms</a>
            <a href="/privacy-policy" className="transition hover:text-white">Privacy</a>
            <a href="/sitemap" className="transition hover:text-white">Sitemap</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
