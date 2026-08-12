"use server";

import { isMysql } from "../lib/db";
import * as mysql from "../lib/mysql";
import { getProjectsMysql } from "../lib/projects";
import dbConnect from "../lib/mongodb";
import Project from "../models/Project";
import { revalidatePath } from "next/cache";
import { uploadImage, deleteImage } from "../lib/storage";

export async function getProjects() {
  if (isMysql()) {
    return getProjectsMysql();
  }
  await dbConnect();
  const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
  return JSON.parse(JSON.stringify(projects));
}

export async function createProject(formData: FormData) {
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
    image = await uploadImage(file, "gallery");
  }

  if (isMysql()) {
    await mysql.initSchema();
    await mysql.insert("projects", {
      title,
      category,
      description,
      image,
      client,
      impact,
      metrics: JSON.stringify(metrics),
      sort_order: order,
    });
  } else {
    await dbConnect();
    await Project.create({ title, category, description, image, client, impact, metrics, order });
  }
  revalidatePath("/gallery");
  revalidatePath("/case-studies");
  revalidatePath("/dashboard/gallery");
}

export async function updateProject(id: string, formData: FormData) {
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
    image = await uploadImage(file, "gallery");
  }

  if (isMysql()) {
    await mysql.initSchema();
    await mysql.update("projects", id, {
      title,
      category,
      description,
      image,
      client,
      impact,
      metrics: JSON.stringify(metrics),
      sort_order: order,
    });
  } else {
    await dbConnect();
    await Project.findByIdAndUpdate(id, { title, category, description, image, client, impact, metrics, order });
  }
  revalidatePath("/gallery");
  revalidatePath("/case-studies");
  revalidatePath("/dashboard/gallery");
}

export async function deleteProject(id: string) {
  if (isMysql()) {
    await mysql.initSchema();
    const rows = await mysql.query(
      "SELECT image FROM projects WHERE id = ? LIMIT 1",
      [id],
    );
    if (rows.length > 0 && rows[0].image) {
      await deleteImage(rows[0].image);
    }
    await mysql.remove("projects", id);
  } else {
    await dbConnect();
    const project = await Project.findById(id);
    if (project?.image) {
      await deleteImage(project.image);
    }
    await Project.findByIdAndDelete(id);
  }
  revalidatePath("/gallery");
  revalidatePath("/dashboard/gallery");
}