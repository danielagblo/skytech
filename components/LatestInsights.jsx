import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LatestInsights({ latestPosts = [] }) {
  if (latestPosts.length === 0) return null;

  return (
    <section className="border-t border-[#E3DDD4] bg-[#F6F4F0] py-24 md:py-32">
      <div className="section-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Insights</span>
            <h2 className="section-title mt-5">Latest thinking</h2>
            <p className="section-lead mt-5">
              Research, perspectives, and notes from the work we do with clients.
            </p>
          </div>
          <Link href="/insights" className="text-sm font-medium text-[#1E5AC8]">
            All insights
          </Link>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {latestPosts.map((post, idx) => {
            const dateStr = post.publishedAt || post.createdAt;
            const formattedDate = dateStr
              ? new Date(dateStr).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "";
            const excerptText = post.excerpt || "Read the full note.";

            return (
              <Link
                key={post._id || idx}
                href={`/insights/${post.slug}`}
                className="group flex h-full flex-col border border-[#E3DDD4] bg-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[#E3DDD4] bg-[#EFEBE4]">
                  {post.coverImage ? (
                    <Image src={post.coverImage} alt="" fill className="object-cover" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B6560]">
                    {post.category || "Note"}
                    {formattedDate ? ` · ${formattedDate}` : ""}
                  </p>
                  <h3 className="mt-3 text-lg font-medium leading-snug text-[#141413] group-hover:text-[#1E5AC8]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#5C574F]">{excerptText}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
