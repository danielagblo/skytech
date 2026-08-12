import { isMysql } from './db';
import * as mysql from './mysql';
import dbConnect from './mongodb';
import Project from '../models/Project';

export async function getProjectsMysql() {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, title, category, description, image, client, impact, metrics, sort_order AS `order`, created_at, updated_at FROM projects ORDER BY sort_order ASC, created_at DESC",
  );
  return rows.map((r) => ({
    _id: r.id,
    title: r.title || "",
    category: r.category || "",
    description: r.description || "",
    image: r.image || "/images/hero-1.png",
    client: r.client || "Global Client",
    impact: r.impact || "Accelerated Growth",
    metrics: (mysql.parseJson(r.metrics) as string[]) || [],
    order: r.order ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function getProjects() {
  if (isMysql()) {
    try {
      return await getProjectsMysql();
    } catch (error) {
      console.error("Error fetching projects from MySQL:", error);
      return [];
    }
  }
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error("Error fetching projects from MongoDB:", error);
    return [];
  }
}