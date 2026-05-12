import { getProjects } from "../../admin/project-actions";
import GalleryManager from "./GalleryManager";

export const dynamic = "force-dynamic";

export default async function DashboardGalleryPage() {
  const projectsData = await getProjects();
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Gallery Manager</h1>
          <p className="text-slate-500 mt-2">Curate your portfolio projects. Changes here will instantly update the public gallery page.</p>
        </div>
      </div>
      
      <GalleryManager initialProjects={projectsData} />
    </div>
  );
}
