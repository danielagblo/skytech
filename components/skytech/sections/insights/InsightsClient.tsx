"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/app/lib/blog";

export default function InsightsClient({ posts }: { posts: BlogPost[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  // Get unique categories and years for dropdowns
  const categories = useMemo(() => {
    const list = posts.map((p) => p.category || "News").filter(Boolean);
    return ["All", ...Array.from(new Set(list))];
  }, [posts]);

  const years = useMemo(() => {
    const list = posts
      .map((p) => {
        const dateStr = p.publishedAt || p.createdAt;
        return dateStr ? new Date(dateStr).getFullYear().toString() : "";
      })
      .filter(Boolean);
    return ["All", ...Array.from(new Set(list))];
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory =
        selectedCategory === "All" ||
        (post.category || "News").toLowerCase() === selectedCategory.toLowerCase();

      const dateStr = post.publishedAt || post.createdAt;
      const postYear = dateStr ? new Date(dateStr).getFullYear().toString() : "";
      const matchYear = selectedYear === "All" || postYear === selectedYear;

      return matchCategory && matchYear;
    });
  }, [posts, selectedCategory, selectedYear]);

  // Dynamic grid setup to prevent empty columns when exactly 3 posts are loaded
  const gridColsClass = useMemo(() => {
    if (filteredPosts.length === 3) {
      return "grid grid-cols-1 md:grid-cols-2 border-t border-l border-slate-200/80 bg-white";
    }
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200/80 bg-white";
  }, [filteredPosts]);

  const getColSpanClass = (idx: number, total: number) => {
    if (total === 3) {
      return idx === 2 ? "col-span-1 md:col-span-2" : "col-span-1";
    }
    return idx % 3 === 2 ? "col-span-1 md:col-span-2" : "col-span-1";
  };

  return (
    <div className="bg-[#F8F6F2] py-16 px-6 md:px-12 min-h-screen">
      <div className="mx-auto max-w-[80rem]">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-end gap-4 mb-10">
          {/* Content Type Selector */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-[#5A1827] text-[#5A1827] px-5 py-2.5 pr-10 font-display text-xs font-bold uppercase tracking-wider focus:outline-none rounded-none cursor-pointer"
            >
              <option value="All">Content Type</option>
              {categories.filter(c => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#5A1827]">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Select Year Selector */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none bg-white border border-[#5A1827] text-[#5A1827] px-5 py-2.5 pr-10 font-display text-xs font-bold uppercase tracking-wider focus:outline-none rounded-none cursor-pointer"
            >
              <option value="All">Select Year</option>
              {years.filter(y => y !== "All").map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#5A1827]">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Grid Container */}
        {filteredPosts.length > 0 ? (
          <div className={gridColsClass}>
            {filteredPosts.map((post, idx) => {
              const dateStr = post.publishedAt || post.createdAt;
              const formattedDate = dateStr
                ? new Date(dateStr).toLocaleDateString("en-US", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "";

              const colSpanClass = getColSpanClass(idx, filteredPosts.length);

              const excerptText = post.excerpt || "Click to read the full article and explore our latest insights on this topic.";

              if (post.coverImage) {
                return (
                  <Link
                    key={post.slug}
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

              // Standard Text card
              return (
                <Link
                  key={post.slug}
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
        ) : (
          <div className="text-center py-20 bg-white border border-slate-200">
            <p className="text-slate-500 text-lg">No posts match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
