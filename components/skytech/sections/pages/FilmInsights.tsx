"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { BlogPost } from "@/app/lib/blog";
import FilmNav from "@/components/skytech/layout/FilmNav";

gsap.registerPlugin(useGSAP);

function noteDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function NoteCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/insights/${post.slug}`} data-note className="group block">
      <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#eceae4]">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 240px, 50vw"
          />
        ) : null}
        <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white">
          {post.readTimeMinutes} min
        </span>
      </span>
      <span className="mt-3 block text-[11px] text-black/45">
        {(post.category || "Notes").toLowerCase()} / {post.author || "Skytech Ghana"}
      </span>
      <span className="mt-1 block text-sm font-medium leading-snug tracking-tight">{post.title}</span>
      <span className="mt-1 block text-sm font-medium">{noteDate(post.publishedAt)}</span>
    </Link>
  );
}

export default function FilmInsights({ posts }: { posts: BlogPost[] }) {
  const root = useRef<HTMLElement>(null);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const categories = useMemo(() => {
    const names = posts.map((post) => post.category || "Notes");
    return Array.from(new Set(names));
  }, [posts]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = posts.filter((post) => {
      const name = post.category || "Notes";
      const inCategory = category === "All" || name === category;
      const haystack = `${post.title} ${post.excerpt} ${name}`.toLowerCase();
      return inCategory && (!needle || haystack.includes(needle));
    });
    return list.sort((a, b) => {
      const left = new Date(a.publishedAt).getTime() || 0;
      const right = new Date(b.publishedAt).getTime() || 0;
      return sort === "newest" ? right - left : left - right;
    });
  }, [posts, category, query, sort]);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const open = gsap.timeline({ defaults: { ease: "power3.out" } });
        open.fromTo("[data-hero]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 });
        open.fromTo("[data-sheet]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0.15);
        open.fromTo("[data-note]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, 0.28);
      });
      return () => motion.revert();
    },
    { scope: root },
  );

  function toggleGroup(name: string) {
    setOpenGroups((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  }

  return (
    <article ref={root} className="relative bg-[#e8e8ea] px-3 py-3 text-[#161616] md:px-5 md:py-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, transparent 0 46px, rgba(255,255,255,.65) 47px, transparent 48px), radial-gradient(circle at 80% 90%, transparent 0 70px, rgba(255,255,255,.7) 71px, transparent 72px)",
          backgroundSize: "280px 180px, 360px 240px",
        }}
      />
      <div className="relative mx-auto w-full max-w-[1180px] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#8d9872_0%,#74805c_100%)] text-white shadow-[0_20px_60px_rgba(20,20,20,.08)]">
        <div className="px-5 pt-5 text-[#161616] md:px-7 md:pt-6">
          <FilmNav />
        </div>

        <div className="px-5 pb-2 pt-8 md:px-7 md:pt-10">
          <div className="grid items-end gap-6 md:grid-cols-[1.35fr_.75fr]">
            <h1 data-hero className="max-w-xl font-display text-[clamp(2rem,4vw,3.15rem)] font-medium leading-[1.02] tracking-tight text-white">
              Notes from the work, written while the build is still open.
            </h1>
            <p data-hero className="max-w-xs text-sm leading-relaxed text-white/80 md:justify-self-end md:text-right">
              What we learn on websites, apps, and search for businesses in Ghana. The prices in these notes are the prices on the offer.
            </p>
          </div>

          <div data-hero className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCategory("All")}
                className={`rounded-full px-4 py-2 text-sm ${category === "All" ? "bg-white text-[#161616]" : "bg-black/15 text-white"}`}
              >
                All notes
              </button>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-3 py-2 text-sm ${category === item ? "bg-white text-[#161616]" : "bg-black/15 text-white"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/services" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#161616]">
                See the services
              </Link>
              <Link href="/pricing" className="rounded-full bg-black/20 px-4 py-2 text-sm text-white">
                See the offers
              </Link>
            </div>
          </div>
        </div>

        <div data-sheet className="m-3 rounded-[22px] bg-[#f7f6f3] p-4 text-[#161616] md:m-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => setFeaturedOpen((open) => !open)} className="flex items-center gap-2 text-sm font-medium">
              Featured notes
              <span className={`inline-block transition ${featuredOpen ? "rotate-180" : ""}`} aria-hidden>
                ⌄
              </span>
            </button>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-black/45">
                <span aria-hidden>⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search"
                  className="w-28 bg-transparent text-[#161616] outline-none placeholder:text-black/35 md:w-40"
                  aria-label="Search notes"
                />
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  className="rounded-full bg-[#161616] px-4 py-2 text-sm text-white"
                  aria-expanded={filtersOpen}
                >
                  Filters
                </button>
                {filtersOpen ? (
                  <div className="absolute right-0 z-10 mt-2 w-36 rounded-2xl bg-white p-1 text-sm shadow-[0_12px_30px_rgba(0,0,0,.12)]">
                    {(
                      [
                        ["newest", "Newest"],
                        ["oldest", "Oldest"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setSort(value);
                          setFiltersOpen(false);
                        }}
                        className={`block w-full rounded-xl px-3 py-2 text-left ${sort === value ? "bg-[#d5f5a8]" : "hover:bg-black/5"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {featuredOpen ? (
            visible.length === 0 ? (
              <div className="mt-6 border-t border-black/10 pt-6">
                <p className="font-display text-2xl font-medium tracking-tight">The notes are on their way.</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-black/55">
                  Nothing matches this search yet. The work itself is on the services and pricing pages.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-black/10 pt-5 lg:grid-cols-3">
                {visible.map((post) => (
                  <NoteCard key={post.slug} post={post} />
                ))}
              </div>
            )
          ) : null}

          {categories.map((name) => {
            const group = posts.filter((post) => (post.category || "Notes") === name);
            const open = openGroups.includes(name);
            return (
              <div key={name} className="mt-2 border-t border-black/10">
                <button type="button" onClick={() => toggleGroup(name)} className="flex w-full items-center gap-2 py-4 text-left text-sm">
                  {name}
                  <span className={`text-black/40 transition ${open ? "rotate-180" : ""}`} aria-hidden>
                    ⌄
                  </span>
                </button>
                {open ? (
                  <div className="grid grid-cols-2 gap-4 pb-4 lg:grid-cols-3">
                    {group.map((post) => (
                      <NoteCard key={post.slug} post={post} />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
