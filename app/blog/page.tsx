import Image from "next/image"
import Link from "next/link"

import { getAllBlogPosts } from "@/lib/blog"

import BlogPageHeader from "@/assets/images/BlogPageHeader.png"

export const metadata = {
  title: "News & Insights | Skytech Ghana",
  description: "Articles and updates from Skytech Ghana on tech, security, and digital business development.",
}

async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <div>
        <Image 
          src={BlogPageHeader}
          alt="Blog Header"
          className="w-screen h-87.5 object-cover -z-10 absolute top-0"
        
        />
      <div className="mt-40 px-6 text-center">
        <h1 className="text-white text-4xl md:text-5xl uppercase tracking-wide">
          News &amp; Insights
        </h1>
      </div>

      <div className="mt-30    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 px-6 md:px-12 py-12">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group hover:no-underline">
            <div className="relative w-full aspect-4/3 overflow-hidden rounded-sm">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h2 className="uppercase font-semibold text-lg mt-4 group-hover:underline">
              {post.title}
            </h2>
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {post.excerpt}
            </p>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No articles yet - check back soon.
          </p>
        )}
      </div>
    </div>
  )
}

export default BlogPage
