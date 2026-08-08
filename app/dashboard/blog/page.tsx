import React from 'react';
import Link from 'next/link';
import { getBlogPosts, deleteBlogPost } from '../../admin/blog-actions';

export const dynamic = "force-dynamic";

export default async function BlogDashboard() {
  const posts = await getBlogPosts();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog Manager</h1>
          <p className="text-slate-500 mt-1">Create and manage your articles and insights.</p>
        </div>
        <Link 
          href="/dashboard/blog/new" 
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          Create New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <div key={post._id} className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-b-4 border-b-transparent hover:border-b-blue-600">
            {post.coverImage && (
              <div className="aspect-video w-full overflow-hidden relative">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${post.published ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            )}
            
            <div className="p-6 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{post.category || 'General'}</span>
              <h3 className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <Link 
                    href={`/dashboard/blog/${post._id}`}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit Post"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <a 
                    href={`/insights/${post.slug}`} 
                    target="_blank"
                    className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                    title="View Live"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <form action={async () => {
                  'use server';
                  await deleteBlogPost(post._id);
                }}>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">No blog posts found yet.</p>
            <Link href="/dashboard/blog/new" className="text-blue-600 font-bold hover:underline">
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
