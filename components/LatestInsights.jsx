"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LatestInsights({ latestPosts = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerViewMobile = 2;
  const totalSlidesMobile = Math.max(0, latestPosts.length - itemsPerViewMobile + 1);

  const nextSlideMobile = () => {
    if (latestPosts.length <= itemsPerViewMobile) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlidesMobile);
  };

  const prevSlideMobile = () => {
    if (latestPosts.length <= itemsPerViewMobile) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlidesMobile) % totalSlidesMobile);
  };

  // Mobile swipe support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlideMobile();
    } else if (isRightSwipe) {
      prevSlideMobile();
    }
  };

  // Dynamic grid setup to prevent empty columns when exactly 3 posts are loaded
  const gridColsClass = useMemo(() => {
    if (latestPosts.length === 3) {
      return "hidden md:grid md:grid-cols-2 border-t border-l border-slate-200/80 bg-white";
    }
    return "hidden md:grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200/80 bg-white";
  }, [latestPosts]);

  const getColSpanClass = (idx, total) => {
    if (total === 3) {
      return idx === 2 ? "col-span-1 md:col-span-2" : "col-span-1";
    }
    return idx % 3 === 2 ? "col-span-1 md:col-span-2" : "col-span-1";
  };

  if (latestPosts.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="section-shell">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl text-left mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Latest Thinking
          </h2>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl">
            Read what we&apos;re thinking. Research that uncovers what&apos;s next. Perspectives that challenge the status quo. Ideas that help you see around corners.
          </p>
        </div>

        {/* 1. DESKTOP VIEWPORT: Grid Table Layout */}
        <div className={gridColsClass}>
          {latestPosts.map((post, idx) => {
            const dateStr = post.publishedAt || post.createdAt;
            const formattedDate = dateStr
              ? new Date(dateStr).toLocaleDateString("en-US", {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                })
              : "";

            const colSpanClass = getColSpanClass(idx, latestPosts.length);
            const excerptText = post.excerpt || "Click to read the full article and explore our latest insights on this topic.";

            if (post.coverImage) {
              return (
                <Link
                  key={post._id || idx}
                  href={`/insights/${post.slug}`}
                  className={`relative min-h-[300px] h-full flex flex-col justify-end p-8 border-b border-r border-slate-200/80 overflow-hidden group hover:no-underline ${colSpanClass}`}
                >
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/45 z-[1]" />
                  <div className="relative z-10 text-white space-y-1">
                    <div className="text-xs font-semibold tracking-wide uppercase">
                      <span>{post.category || "News"}</span>
                      <span className="mx-2 text-white/50">|</span>
                      <span className="text-white/80">{formattedDate}</span>
                    </div>
                    <h2 className="text-base md:text-lg font-bold leading-tight uppercase">
                      {post.title}
                    </h2>
                    
                    {/* Excerpt container with highly robust hover transitions */}
                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-3 transition-all duration-300 overflow-hidden">
                      <p className="text-xs md:text-sm font-medium text-white/90 line-clamp-2 leading-relaxed">
                        {excerptText}
                      </p>
                    </div>

                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-4 transition-all duration-300 overflow-hidden">
                      <div className="inline-flex items-center gap-1 text-xs font-bold">
                        Read More <span className="transition-transform group-hover:translate-x-1">&gt;</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }

            // Standard Text Card
            return (
              <Link
                key={post._id || idx}
                href={`/insights/${post.slug}`}
                className={`flex flex-col justify-between p-8 border-b border-r border-slate-200/80 min-h-[300px] h-full bg-[#FAF9F6] transition hover:bg-[#F3F1EC] hover:no-underline group ${colSpanClass}`}
              >
                <div className="space-y-4">
                  <div className="text-xs tracking-wide uppercase">
                    <span className="font-bold text-slate-800">{post.category || "News"}</span>
                    <span className="mx-2 text-slate-300">|</span>
                    <span className="text-slate-500">{formattedDate}</span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  
                  {/* Excerpt container with highly robust hover transitions */}
                  <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-3 transition-all duration-300 overflow-hidden">
                    <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed line-clamp-3">
                      {excerptText}
                    </p>
                  </div>

                  <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-4 transition-all duration-300 overflow-hidden">
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                      Read More <span className="transition-transform group-hover:translate-x-1">&gt;</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 2. MOBILE VIEWPORT: 2-Column Touch-Swipeable Carousel */}
        <div className="block md:hidden">
          <div
            className="relative overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out gap-4"
              style={{
                transform: `translateX(calc(-${currentIndex * 50}% - ${currentIndex * 8}px))`,
              }}
            >
              {latestPosts.map((post, idx) => {
                const dateStr = post.publishedAt || post.createdAt;
                const formattedDate = dateStr
                  ? new Date(dateStr).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                    })
                  : "";

                return (
                  <Link
                    key={post._id || idx}
                    href={`/insights/${post.slug}`}
                    className="relative flex-shrink-0 w-[calc(50%-8px)] h-[210px] rounded-none overflow-hidden group shadow-soft"
                  >
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-brand-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 z-[1]" />

                    <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between text-white">
                      <span className="self-start bg-black/40 text-white text-[8px] font-bold tracking-wider uppercase px-2 py-1">
                        {post.category || "BLOG"}
                      </span>

                      <div className="space-y-1">
                        <span className="text-[9px] text-white/60">{formattedDate}</span>
                        <h3 className="text-xs font-bold leading-tight line-clamp-4 uppercase">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          {latestPosts.length > itemsPerViewMobile && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={prevSlideMobile}
                className="flex h-9 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-soft transition active:scale-95"
                aria-label="Previous slide"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <button
                onClick={nextSlideMobile}
                className="flex h-9 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-soft transition active:scale-95"
                aria-label="Next slide"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
