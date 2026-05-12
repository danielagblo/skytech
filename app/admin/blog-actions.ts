"use server"
import dbConnect from "../lib/mongodb";
import BlogPost from "../models/BlogPost";
import { revalidatePath } from "next/cache";
import { processAndUpload } from "../lib/s3";

export async function getBlogPosts() {
  await dbConnect();
  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(posts));
}

export async function getBlogPostById(id: string) {
  await dbConnect();
  const post = await BlogPost.findById(id).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

export async function deleteBlogPost(id: string) {
  await dbConnect();
  await BlogPost.findByIdAndDelete(id);
  revalidatePath("/dashboard/blog");
  revalidatePath("/site/blog");
  return { success: true };
}

export async function saveBlogPost(data: any) {
  try {
    await dbConnect();
    const { _id, ...updateData } = data;

    if (_id) {
      await BlogPost.findByIdAndUpdate(_id, updateData);
    } else {
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
    revalidatePath("/site/blog");
    revalidatePath(`/site/blog/${updateData.slug}`);
    
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
    
    const imageUrl = await processAndUpload(file);
    return { success: true, imageUrl };
  } catch (error: any) {
    console.error("Blog image upload error:", error);
    return { success: false, error: error.message };
  }
}
