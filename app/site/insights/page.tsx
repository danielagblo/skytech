import Image from "next/image";
import { getAllBlogPosts } from "@/app/lib/blog";
import InsightsClient from "@/components/skytech/sections/insights/InsightsClient";

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
      <section className="relative overflow-hidden bg-slate-950 pt-36 pb-16 text-white md:pt-48 md:pb-20">
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

      <InsightsClient posts={posts} />
    </div>
  );
}

export default BlogPage;