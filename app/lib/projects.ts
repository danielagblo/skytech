import dbConnect from './mongodb';
import Project from '../models/Project';

export async function getProjects() {
  await dbConnect();
  try {
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error("Error fetching projects from MongoDB:", error);
    return [];
  }
}
