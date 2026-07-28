import Image from "next/image";
import Link from "next/link";

import { getAllBlogPosts } from "@/app/lib/blog";
import TopScrollingBanner from "@/components/skytech/sections/home/TopScrollingBanner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "News & Insights | Skytech Ghana",
  description:
    "Articles and updates from Skytech Ghana on tech, security, and digital business development.",
};

async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <div className="md:fixed top-0 w-screen z-20">
        <TopScrollingBanner className="bg-[#031B41] text-white p-3 flex items-center justify-center max-md:pt-11 " />
      </div>

      <div className="relative h-[21.875rem] overflow-hidden bg-[#031B41]">
        <Image
          src="/images/images/BlogPageHeader.png"
          alt="Blog Header"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl uppercase tracking-wide">News &amp; Insights</h1>
        </div>
      </div>

      <div className="mt-[7.5rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 px-6 md:px-12 py-12">
        {posts.map((post) => (
          <Link key={post.slug} href={`/site/blog/${post.slug}`} className="group hover:no-underline">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h2 className="uppercase font-semibold text-lg mt-4 group-hover:underline">{post.title}</h2>
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">{post.excerpt}</p>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No articles yet - check back soon.
          </p>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
