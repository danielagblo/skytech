import GalleryClient from './GalleryClient';
import { getProjects } from "../../lib/projects";

export const metadata = {
  title: "Gallery - Skytech Ghana",
  description: "Showcase of our latest web and mobile app projects.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const projects = await getProjects();

  return (
    <GalleryClient projects={projects} />
  );
}
