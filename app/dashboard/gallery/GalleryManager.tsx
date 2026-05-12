"use client";

import { useState } from "react";
import { createProject, updateProject, deleteProject } from "../../admin/project-actions";

interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  client?: string;
  impact?: string;
  metrics?: string[];
  order: number;
}

interface GalleryManagerProps {
  initialProjects: Project[];
}

export default function GalleryManager({ initialProjects }: GalleryManagerProps) {
  const [projects] = useState<Project[]>(initialProjects);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      if (editingId) {
        await updateProject(editingId, formData);
      } else {
        await createProject(formData);
      }
      window.location.reload();
    } catch (error) {
      alert("Failed to save project. Check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Portfolio Items ({projects.length})</h2>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
        >
          Add New Project
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-lg font-bold text-slate-900">{editingId ? "Edit Project" : "Add New Project"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Project Title</label>
              <input 
                name="title" 
                defaultValue={editingId ? projects.find((p: Project) => p._id === editingId)?.title : ""}
                required 
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Category</label>
              <input 
                name="category" 
                defaultValue={editingId ? projects.find((p: Project) => p._id === editingId)?.category : ""}
                required 
                disabled={isUploading}
                placeholder="e.g. Mobile App, Fintech"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</label>
              <textarea 
                name="description" 
                defaultValue={editingId ? projects.find((p: Project) => p._id === editingId)?.description : ""}
                required 
                rows={3}
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Client Name</label>
              <input 
                name="client" 
                defaultValue={editingId ? projects.find((p: Project) => p._id === editingId)?.client : ""}
                placeholder="e.g. Oysloe Global"
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Impact Result (One-liner)</label>
              <input 
                name="impact" 
                defaultValue={editingId ? projects.find((p: Project) => p._id === editingId)?.impact : ""}
                placeholder="e.g. Automated Lead Velocity"
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Technologies / Metrics (Comma separated)</label>
              <input 
                name="metrics" 
                defaultValue={editingId ? projects.find((p: Project) => p._id === editingId)?.metrics?.join(", ") : ""}
                placeholder="e.g. Next.js, Prisma, AWS"
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Project Image (Upload to AWS)</label>
              <input 
                name="file" 
                type="file"
                accept="image/*"
                disabled={isUploading}
                className="w-full px-4 py-2 rounded-xl border border-dashed border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              />
              <p className="text-[10px] text-slate-400">Leave empty to keep current image or use URL below.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Or Image URL</label>
              <input 
                name="image" 
                defaultValue={editingId ? projects.find((p: Project) => p._id === editingId)?.image : "/images/hero-1.png"}
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Display Order</label>
              <input 
                name="order" 
                type="number"
                defaultValue={editingId ? projects.find((p: Project) => p._id === editingId)?.order : 0}
                disabled={isUploading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" 
              />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-4">
              <button 
                type="submit" 
                disabled={isUploading}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  editingId ? "Update Project" : "Create Project"
                )}
              </button>
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: Project) => (
          <div key={project._id} className="group bg-white p-4 rounded-3xl border border-slate-200 hover:shadow-xl transition-all">
            <div className="aspect-[16/10] rounded-2xl bg-slate-100 overflow-hidden mb-4 relative">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditingId(project._id); setIsAdding(false); }}
                  className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:text-blue-600"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(project._id)}
                  className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:text-red-600"
                >
                  Del
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">{project.category}</span>
              <h4 className="font-bold text-slate-900">{project.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
