"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogClient({ posts, featuredPost, gridPosts }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative bg-slate-950 text-white pt-36 pb-20 overflow-hidden">
        {/* Grid mesh background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50" />

        <div className="section-shell relative z-10 text-center space-y-6 max-w-3xl mx-auto">
          <span className="pill bg-white/10 text-blue-300 border-white/10">Insights</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            News & <span className="text-blue-400">Insights</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Practical tips and news about web development, mobile apps, and digital growth in Ghana.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/10 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && !searchQuery && (
        <section className="py-16">
          <div className="section-shell">
            <Link
              href={`/insights/${featuredPost.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 card-hover"
            >
              <div className="relative h-64 lg:h-auto overflow-hidden">
                {featuredPost.coverImage ? (
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center min-h-[250px]">
                    <span className="text-white/30 font-bold text-lg uppercase tracking-wider">Featured</span>
                  </div>
                )}
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center space-y-4">
                <span className="pill w-fit">Featured</span>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-500 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt || featuredPost.body?.slice(0, 180)}
                </p>
                <div className="flex items-center gap-3 text-sm text-slate-400 pt-2">
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>{featuredPost.readTime || '5 min read'}</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="pb-24">
        <div className="section-shell">
          {(searchQuery ? filteredPosts : gridPosts)?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(searchQuery ? filteredPosts : gridPosts).map((post) => (
                <Link
                  key={post.slug}
                  href={`/insights/${post.slug}`}
                  className="group rounded-3xl overflow-hidden bg-white border border-slate-100 card-hover"
                >
                  <div className="relative h-48 overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Blog Post</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{post.readTime || '5 min read'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {post.excerpt || post.body?.slice(0, 120)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">
                {searchQuery ? 'No articles match your search.' : 'No blog posts available yet.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
