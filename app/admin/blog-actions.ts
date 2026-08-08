"use server"
import dbConnect from "../lib/mongodb";
import BlogPost from "../models/BlogPost";
import { revalidatePath } from "next/cache";
import { deleteFromS3, processAndUpload } from "../lib/s3";

export async function getBlogPosts() {
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
  await dbConnect();
  const post = await BlogPost.findById(id);
  if (post?.coverImage) {
    await deleteFromS3(post.coverImage);
  }
  await BlogPost.findByIdAndDelete(id);
  revalidatePath("/dashboard/blog");
  revalidatePath("/site/insights");
  return { success: true };
}

export async function saveBlogPost(data: any) {
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
    revalidatePath("/site/insights");
    revalidatePath(`/site/insights/${updateData.slug}`);
    
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
