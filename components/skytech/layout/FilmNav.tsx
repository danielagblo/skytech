"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BookMeetingButton from "@/components/skytech/ui/BookMeetingButton";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function FilmNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#8dce3a]" />
            Skytech Ghana
          </Link>
          <BookMeetingButton className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium">
            Contact us
          </BookMeetingButton>
        </div>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-sm md:flex">
            {links.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 ${active ? "bg-[#d5f5a8]" : "hover:bg-black/5"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="rounded-full bg-white px-3 py-1.5 text-sm md:hidden"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <nav className="absolute left-0 right-0 top-full z-30 mt-3 flex flex-col rounded-2xl bg-white p-2 text-sm shadow-[0_12px_30px_rgba(0,0,0,.08)] md:hidden">
          {links.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 ${active ? "bg-[#d5f5a8]" : "hover:bg-black/5"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
