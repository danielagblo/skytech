import dbConnect from "./mongodb";
import BlogPostModel from "../models/BlogPost";

export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  readTimeMinutes: number;
  author: string;
  category: string;
  createdAt?: Date;
}

function extractText(node: any): string {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (node.children) return node.children.map(extractText).join(" ");
  return "";
}

function computeReadTime(content: string): number {
  try {
    const state = JSON.parse(content || "{}");
    const text = extractText(state.root);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  } catch {
    return 5;
  }
}

function mapPost(post: any): BlogPost {
  return {
    _id: post._id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content || "{}",
    coverImage: post.coverImage || "",
    publishedAt: post.createdAt ? new Date(post.createdAt).toISOString() : "",
    readTimeMinutes: post.readTime || computeReadTime(post.content || ""),
    author: post.author || "Skytech Team",
    category: post.category || "Technology",
    createdAt: post.createdAt,
  };
}

async function getPublished(): Promise<any[]> {
  await dbConnect();
  const posts = await BlogPostModel.find({ published: true })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(posts));
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await getPublished();
    return posts.map(mapPost);
  } catch (error) {
    console.error("getAllBlogPosts error:", error);
    return [];
  }
}

export async function getLatestBlogPosts(limit = 4): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getRelatedBlogPosts(
  slug: string,
  limit = 3
): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post) => post.slug !== slug).slice(0, limit);
}

export function formatBlogDate(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const year = date.getUTCFullYear();
  return `${day}${ordinalSuffix(day)}/${month}/${year}`;
}

function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
