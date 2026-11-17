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
    <div className="px-5 pb-16 pt-6 md:px-8">
      <section>
        <div className="max-w-3xl">
          <Link href="/insights" className="text-sm font-medium">
            Back to insights
          </Link>
          <h1 className="mt-5 font-display text-4xl font-medium tracking-tight md:text-6xl">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#5C574F]">
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{post.readTimeMinutes} min read</span>
          </div>
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-[28px] bg-white p-6 md:p-10">
          <div className="space-y-6 text-lg leading-relaxed text-slate-700">
            <LexicalContent content={post.content} />
          </div>
        </article>

        <aside>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">
            Other notes
          </h2>
          <div className="space-y-8">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/insights/${related.slug}`}
                className="group block hover:no-underline"
              >
                {related.coverImage && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px]">
                    <Image
                      src={related.coverImage}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="mt-3 font-medium leading-snug text-[#161616]">
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
