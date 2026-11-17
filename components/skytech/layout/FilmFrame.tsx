"use client";

import { usePathname } from "next/navigation";
import FilmNav from "@/components/skytech/layout/FilmNav";

const bare = new Set(["/", "/forms", "/thank-you", "/landing", "/insights", "/services"]);

export default function FilmFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contact = pathname === "/contact";

  if (bare.has(pathname)) {
    return children;
  }

  return (
    <div className={`relative bg-[#e8e8ea] text-[#161616] ${contact ? "h-screen overflow-hidden" : ""}`}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, transparent 0 46px, rgba(255,255,255,.65) 47px, transparent 48px), radial-gradient(circle at 80% 90%, transparent 0 70px, rgba(255,255,255,.7) 71px, transparent 72px)",
          backgroundSize: "280px 180px, 360px 240px",
        }}
      />
      <div className={`relative ${contact ? "flex h-full flex-col px-3 py-3 md:px-4 md:py-4" : "px-3 py-3 md:px-5 md:py-5"}`}>
        <div
          className={`mx-auto w-full overflow-hidden rounded-[28px] bg-[#f6f6f4] shadow-[0_20px_60px_rgba(20,20,20,.06)] ${
            contact ? "flex h-full min-h-0 max-w-none flex-col" : "max-w-[1180px]"
          }`}
        >
          <div className={`shrink-0 ${contact ? "px-5 pt-4 md:px-8 md:pt-5" : "px-5 pt-5 md:px-8 md:pt-8"}`}>
            <FilmNav />
          </div>
          <div className={`film-page ${contact ? "flex min-h-0 flex-1 flex-col [&>main]:flex [&>main]:min-h-0 [&>main]:flex-1 [&>main]:flex-col" : ""}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
