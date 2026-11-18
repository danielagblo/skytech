"use client";

import { usePathname } from "next/navigation";
import type { BlogPost } from "@/app/lib/blog";
import type { SiteSettings } from "@/app/lib/settings";
import ThankYouFooter from "@/components/skytech/layout/ThankYouFooter";

interface FooterProps {
  latestPosts?: BlogPost[];
  sponsors?: { name: string; logoUrl: string }[];
  settings?: SiteSettings;
  whatsapp?: string;
  className?: string;
}

function Footer({ settings, className }: FooterProps) {
  const currentPath = usePathname();
  const hide =
    currentPath === "/" ||
    currentPath === "/landing" ||
    currentPath === "/forms" ||
    currentPath === "/thank-you" ||
    currentPath === "/contact";

  if (hide) return null;

  return (
    <ThankYouFooter
      className={className ?? "mt-auto"}
      siteName={settings?.siteName}
      contactEmail={settings?.contactEmail}
      contactPhone={settings?.contactPhone}
      address={settings?.address}
    />
  );
}

export default Footer;
