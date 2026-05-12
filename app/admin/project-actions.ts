"use server";

import dbConnect from "../lib/mongodb";
import Project from "../models/Project";
import { revalidatePath } from "next/cache";
import { processAndUpload } from "../lib/s3";

export async function getProjects() {
  await dbConnect();
  const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
  return JSON.parse(JSON.stringify(projects));
}

export async function createProject(formData: FormData) {
  await dbConnect();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const client = formData.get("client") as string;
  const impact = formData.get("impact") as string;
  const metricsStr = formData.get("metrics") as string;
  const metrics = metricsStr ? metricsStr.split(",").map(m => m.trim()) : [];
  const order = parseInt(formData.get("order") as string || "0");
  
  const file = formData.get("file") as File;
  let image = formData.get("image") as string;

  if (file && file.size > 0) {
    image = await processAndUpload(file, "gallery");
  }

  await Project.create({ title, category, description, image, client, impact, metrics, order });
  revalidatePath("/site/gallery");
  revalidatePath("/site/case-studies");
  revalidatePath("/dashboard/gallery");
}

export async function updateProject(id: string, formData: FormData) {
  await dbConnect();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const client = formData.get("client") as string;
  const impact = formData.get("impact") as string;
  const metricsStr = formData.get("metrics") as string;
  const metrics = metricsStr ? metricsStr.split(",").map(m => m.trim()) : [];
  const order = parseInt(formData.get("order") as string || "0");
  
  const file = formData.get("file") as File;
  let image = formData.get("image") as string;

  if (file && file.size > 0) {
    image = await processAndUpload(file, "gallery");
  }

  await Project.findByIdAndUpdate(id, { title, category, description, image, client, impact, metrics, order });
  revalidatePath("/site/gallery");
  revalidatePath("/site/case-studies");
  revalidatePath("/dashboard/gallery");
}

export async function deleteProject(id: string) {
  await dbConnect();
  await Project.findByIdAndDelete(id);
  revalidatePath("/site/gallery");
  revalidatePath("/dashboard/gallery");
}
