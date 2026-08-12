"use server"
import { isMysql } from "../lib/db";
import * as mysql from "../lib/mysql";
import dbConnect from "../lib/mongodb";
import BlogPost from "../models/BlogPost";
import { revalidatePath } from "next/cache";
import { uploadImage, deleteImage } from "../lib/storage";

function mapBlogRow(r: any) {
  return {
    _id: r.id,
    title: r.title || "",
    slug: r.slug || "",
    category: r.category || "Technology",
    excerpt: r.excerpt || "",
    content: r.content || "{}",
    coverImage: r.cover_image || "",
    published: mysql.fromBool(r.published),
    author: r.author || "Skytech Team",
    tags: (mysql.parseJson(r.tags) || []) as string[],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

async function getBlogPostsMysql() {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, title, slug, category, excerpt, content, cover_image, published, author, tags, created_at, updated_at FROM blog_posts ORDER BY created_at DESC",
  );
  return rows.map(mapBlogRow);
}

async function getBlogPostByIdMysql(id: string) {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, title, slug, category, excerpt, content, cover_image, published, author, tags, created_at, updated_at FROM blog_posts WHERE id = ? LIMIT 1",
    [id],
  );
  return rows.length > 0 ? mapBlogRow(rows[0]) : null;
}

async function deleteBlogPostMysql(id: string) {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT cover_image FROM blog_posts WHERE id = ? LIMIT 1",
    [id],
  );
  if (rows.length > 0 && rows[0].cover_image) {
    await deleteImage(rows[0].cover_image);
  }
  await mysql.remove("blog_posts", id);
}

async function saveBlogPostMysql(data: any) {
  await mysql.initSchema();
  const { _id, ...updateData } = data;

  if (_id) {
    await mysql.update("blog_posts", _id, {
      title: updateData.title,
      slug: updateData.slug,
      category: updateData.category || "Technology",
      excerpt: updateData.excerpt || "",
      content: updateData.content || "{}",
      cover_image: updateData.coverImage || "",
      published: mysql.toBool(updateData.published),
      author: updateData.author || "Skytech Team",
      tags: JSON.stringify(updateData.tags || []),
    });
  } else {
    let slug = updateData.slug;
    if (!slug) {
      slug = updateData.title
        ? updateData.title.toLowerCase().replace(/[^\w\s]/gi, "").replace(/\s+/g, "-")
        : `post-${Date.now()}`;
    }
    await mysql.insert("blog_posts", {
      title: updateData.title,
      slug,
      category: updateData.category || "Technology",
      excerpt: updateData.excerpt || "",
      content: updateData.content || "{}",
      cover_image: updateData.coverImage || "",
      published: mysql.toBool(updateData.published),
      author: updateData.author || "Skytech Team",
      tags: JSON.stringify(updateData.tags || []),
    });
  }
}

export async function getBlogPosts() {
  if (isMysql()) {
    try {
      return await getBlogPostsMysql();
    } catch (error) {
      console.error("Failed to fetch blog posts from MySQL:", error);
      return [];
    }
  }
  try {
    await dbConnect();
    const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Failed to fetch blog posts from MongoDB:", error);
    return [];
  }
}

export async function getBlogPostById(id: string) {
  if (isMysql()) {
    try {
      return await getBlogPostByIdMysql(id);
    } catch (error) {
      console.error(`Failed to fetch blog post ${id} from MySQL:`, error);
      return null;
    }
  }
  try {
    await dbConnect();
    const post = await BlogPost.findById(id).lean();
    return post ? JSON.parse(JSON.stringify(post)) : null;
  } catch (error) {
    console.error(`Failed to fetch blog post ${id} from MongoDB:`, error);
    return null;
  }
}

export async function deleteBlogPost(id: string) {
  if (isMysql()) {
    await deleteBlogPostMysql(id);
    revalidatePath("/dashboard/blog");
    revalidatePath("/insights");
    return { success: true };
  }
  await dbConnect();
  const post = await BlogPost.findById(id);
  if (post?.coverImage) {
    await deleteImage(post.coverImage);
  }
  await BlogPost.findByIdAndDelete(id);
  revalidatePath("/dashboard/blog");
  revalidatePath("/insights");
  return { success: true };
}

export async function saveBlogPost(data: any) {
  if (isMysql()) {
    try {
      await saveBlogPostMysql(data);
      revalidatePath("/dashboard/blog");
      revalidatePath("/insights");
      revalidatePath(`/insights/${data.slug}`);
      return { success: true };
    } catch (error: any) {
      console.error("Save blog post error (mysql):", error);
      return { success: false, error: error.message };
    }
  }
  try {
    await dbConnect();
    const { _id, ...updateData } = data;
    console.log("Saving blog post. ID:", _id);

    if (_id) {
      console.log("Updating existing post...");
      await BlogPost.findByIdAndUpdate(_id, updateData);
    } else {
      console.log("Creating new post...");
      // Auto-generate slug if not provided
      if (!updateData.slug) {
        updateData.slug = updateData.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }
      await BlogPost.create(updateData);
    }

    revalidatePath("/dashboard/blog");
    revalidatePath("/insights");
    revalidatePath(`/insights/${updateData.slug}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Save blog post error:", error);
    return { success: false, error: error.message };
  }
}

export async function uploadBlogImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) throw new Error("No file provided");
    
    const imageUrl = await uploadImage(file);
    return { success: true, imageUrl };
  } catch (error: any) {
    console.error("Blog image upload error:", error);
    return { success: false, error: error.message };
  }
}