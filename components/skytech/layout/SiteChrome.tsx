"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/skytech/layout/Navigation";
import TopScrollingBanner from "@/components/skytech/sections/home/TopScrollingBanner";

export default function SiteChrome() {
  const pathname = usePathname();

  if (pathname === "/forms" || pathname === "/thank-you") {
    return null;
  }

  return (
    <>
      <div className="fixed top-[56px] md:top-0 z-20 w-full md:z-30">
        <TopScrollingBanner />
      </div>
      <Navigation className="fixed top-0 left-0 z-30 w-full md:top-[45px]" />
    </>
  );
}
