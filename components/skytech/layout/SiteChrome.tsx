"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/skytech/layout/Navigation";
import FormsHeader from "@/components/skytech/layout/FormsHeader";
import TopScrollingBanner from "@/components/skytech/sections/home/TopScrollingBanner";

export default function SiteChrome() {
  const pathname = usePathname();
  const isFormsPage = pathname === "/forms";

  if (isFormsPage) {
    return <FormsHeader />;
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
