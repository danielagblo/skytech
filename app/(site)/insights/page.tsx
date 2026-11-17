import { getAllBlogPosts } from "@/app/lib/blog";
import FilmInsights from "@/components/skytech/sections/pages/FilmInsights";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Insights | Skytech Ghana",
  description: "Notes from Skytech Ghana on websites, apps, and search for businesses in Ghana.",
};

export default async function InsightsPage() {
  const posts = await getAllBlogPosts();
  return <FilmInsights posts={posts || []} />;
}
