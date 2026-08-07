import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatBlogDate, getBlogPostBySlug, getRelatedBlogPosts } from "@/app/lib/blog";
import LexicalContent from "@/components/skytech/sections/blog/LexicalContent";

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
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-16 text-white md:pb-20">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="absolute inset-0 object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative">
          <div className="max-w-3xl">
            <Link
              href="/site/blog"
              className="pill transition hover:bg-brand-50"
            >
              &#x1F878; Back to Blog
            </Link>
            <h1 className="font-display mt-5 text-3xl font-semibold uppercase leading-[1.1] text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span>{formatBlogDate(post.publishedAt)}</span>
              <span className="h-1 w-1 rounded-full bg-brand-400" />
              <span>{post.readTimeMinutes} mins read</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12 px-6 py-16 md:px-12 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft md:p-10">
          <div className="space-y-6 text-lg leading-relaxed text-slate-700">
            <LexicalContent content={post.content} />
          </div>
        </article>

        <aside>
          <h2 className="font-display mb-6 inline-block border-b-4 border-brand-600 pb-1 text-2xl uppercase text-slate-900">
            Other topics
          </h2>
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
                <h3 className="mt-3 font-semibold uppercase leading-snug text-slate-900 transition-colors group-hover:text-brand-600">
                  {related.title}
                </h3>
                <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-slate-600">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BlogPostPage;