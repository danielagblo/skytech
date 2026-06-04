import BlogClient from './BlogClient';
import { getBlogPosts } from "../../admin/blog-actions";

export const metadata = {
  title: "Blog - Skytech Ghana",
  description: "Insights on web design, mobile development, and SEO growth.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const allPosts = await getBlogPosts();
  const posts = allPosts.filter((p) => p.published);
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <BlogClient
      posts={posts}
      featuredPost={featuredPost}
      gridPosts={gridPosts}
    />
  );
}
