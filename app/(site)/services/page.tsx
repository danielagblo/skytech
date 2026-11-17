import FilmServices from "@/components/skytech/sections/pages/FilmServices";
import { getLatestBlogPosts } from "@/app/lib/blog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services | Skytech Ghana",
  description: "Website, mobile app, SEO, CRM, and virtual tours for hospitality and property, from Skytech Ghana in Accra.",
};

export default async function ServicesPage() {
  const posts = await getLatestBlogPosts(3);
  return <FilmServices posts={posts} />;
}
