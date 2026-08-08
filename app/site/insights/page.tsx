import Image from "next/image";
import Link from "next/link";

import { getAllBlogPosts, formatBlogDate } from "@/app/lib/blog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Insights | Skytech Ghana",
  description:
    "Articles and updates from Skytech Ghana on tech, security, and digital business development.",
};

async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-16 text-white md:pb-20">
        <Image
          src="/images/images/BlogPageHeader.png"
          alt="Insights"
          fill
          className="absolute inset-0 object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative">
          <div className="max-w-2xl">
            <span className="pill">Insights</span>
            <h1 className="font-display mt-5 text-4xl font-semibold uppercase leading-[1.1] text-white sm:text-5xl">
              STAY AHEAD WITH OUR LATEST UPDATES
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              Articles and updates from Skytech Ghana on tech, security, and digital
              business development.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/site/insights/${post.slug}`} className="group hover:no-underline">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-none ring-1 ring-slate-100 shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                <span>{formatBlogDate(post.publishedAt)}</span>
                <span className="h-1 w-1 rounded-full bg-brand-600" />
                <span>{post.readTimeMinutes} mins read</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold uppercase leading-snug text-slate-900 transition-colors group-hover:text-brand-600">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
            </Link>
          ))}

          {posts.length === 0 && (
            <p className="col-span-full text-center text-slate-500">
              No articles yet - check back soon.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default BlogPage;