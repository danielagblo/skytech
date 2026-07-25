import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { formatBlogDate, getAllBlogPosts, getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog"
import TopScrollingBanner from "@/components/sections/home/TopScrollingBanner"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Skytech Ghana`,
    description: post.excerpt,
  }
}

async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  const relatedPosts = await getRelatedBlogPosts(slug, 3)

  return (
    <div>
      <div className="md:fixed top-0 w-screen z-20">
        <TopScrollingBanner className="bg-[#83867E] text-white p-3 flex items-center justify-center max-md:pt-11" />
      </div>
      <div className="relative w-full h-[400px]">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 px-6 md:px-12 py-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link href="/blog" className="rounded-full bg-gray-100 px-4 py-2 text-sm hover:no-underline hover:bg-gray-200">
              &#x1F878; Return
            </Link>
            <Link href="/blog" className="rounded-full bg-gray-100 px-4 py-2 text-sm hover:no-underline hover:bg-gray-200">
              Blog home
            </Link>
            <span className="ml-auto text-sm text-gray-500">
              {formatBlogDate(post.publishedAt)}&nbsp;&nbsp;{post.readTimeMinutes} mins read
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl uppercase mb-6">{post.title}</h1>

          <div className="space-y-6 text-lg leading-relaxed">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl border-b border-black inline-block pb-1 mb-6">
            Other topics
          </h2>
          <div className="space-y-8">
            {relatedPosts.map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`} className="block group hover:no-underline">
                <div className="relative w-full aspect-4/3 overflow-hidden rounded-sm">
                  <Image
                    src={related.coverImage}
                    alt={related.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="uppercase font-semibold mt-3 group-hover:underline">
                  {related.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                  {related.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPostPage
