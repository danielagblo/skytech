import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatBlogDate, getBlogPostBySlug, getRelatedBlogPosts } from "@/app/lib/blog";
import LexicalContent from "@/components/skytech/sections/blog/LexicalContent";
import TopScrollingBanner from "@/components/skytech/sections/home/TopScrollingBanner";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Skytech Ghana`,
    description: post.excerpt,
  };
}

async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedBlogPosts(slug, 3);

  return (
    <div>
      <div className="md:fixed top-0 w-screen z-20">
        <TopScrollingBanner className="bg-[#83867E] text-white p-3 flex items-center justify-center max-md:pt-11 " />
      </div>

      {post.coverImage && (
        <div className="relative w-full h-[400px]">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 px-6 md:px-12 py-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link
              href="/site/blog"
              className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-700 hover:no-underline hover:bg-brand-100"
            >
              &#x1F878; Return
            </Link>
            <Link
              href="/site/blog"
              className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-700 hover:no-underline hover:bg-brand-100"
            >
              Blog home
            </Link>
            <span className="ml-auto text-sm text-slate-500">
              {formatBlogDate(post.publishedAt)}&nbsp;&nbsp;{post.readTimeMinutes} mins read
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl uppercase mb-6">{post.title}</h1>

          <div className="space-y-6 text-lg leading-relaxed">
            <LexicalContent content={post.content} />
          </div>
        </div>

        <div>
          <h2 className="mb-6 inline-block border-b border-brand-600 pb-1 text-2xl">Other topics</h2>
          <div className="space-y-8">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/site/blog/${related.slug}`}
                className="group block hover:no-underline"
              >
                {related.coverImage && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-slate-100 shadow-soft transition-shadow group-hover:shadow-lift">
                    <Image
                      src={related.coverImage}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="mt-3 font-semibold uppercase transition-colors group-hover:text-brand-600">{related.title}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-slate-600">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostPage;
