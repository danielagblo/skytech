import CaseStudiesClient from './CaseStudiesClient';
import { getProjects } from "../../lib/projects";

export const metadata = {
  title: "Case Studies | Skytech Ghana Portfolio",
  description: "Real results for real brands. Explore our high-performance digital architecture and mobile solutions.",
};

export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  const projects = await getProjects();
  
  return (
    <CaseStudiesClient projects={projects} />
  );
}
