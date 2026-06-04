"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BlogClient({ posts, featuredPost, gridPosts }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const headerItems = el.querySelectorAll('.blog-header-el');
    const featuredCard = el.querySelector('.featured-card');
    const gridCards = el.querySelectorAll('.blog-grid-card');
    const newsletter = el.querySelector('.newsletter-card');

    // Initial GSAP states
    gsap.set(headerItems, { opacity: 0, y: 35 });
    gsap.set(featuredCard, { opacity: 0, y: 30 });
    gsap.set(gridCards, { opacity: 0, y: 25 });
    gsap.set(newsletter, { opacity: 0, y: 30 });

    // 1. Header Animations
    gsap.to(headerItems, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1 });

    // 2. Featured Post Card
    gsap.to(featuredCard, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.featured-post-section',
        start: 'top bottom-=100px',
        toggleActions: 'play reverse play reverse',
      }
    });

    // 3. Blog Grid Cards
    gsap.to(gridCards, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.blog-grid-container',
        start: 'top bottom-=150px',
        toggleActions: 'play reverse play reverse',
      }
    });

    // 4. Newsletter block
    gsap.to(newsletter, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.newsletter-section',
        start: 'top bottom-=200px',
        toggleActions: 'play reverse play reverse',
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen pt-24 pb-20 bg-white">
      <div className="section-shell space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="pill blog-header-el">Insights</span>
          <h1 className="text-4xl lg:text-5xl leading-tight text-slate-900 font-light blog-header-el">
            The <span className="font-extrabold text-blue-600">Digital Edge</span>
          </h1>
          <p className="text-lg text-slate-600 blog-header-el">
            Expert advice on building, scaling, and optimizing your digital products.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost ? (
          <div className="featured-post-section">
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-50 aspect-[21/9] flex items-end p-8 md:p-16 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-700 featured-card">
              {featuredPost.coverImage && (
                <img 
                  src={featuredPost.coverImage} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  alt={featuredPost.title}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
              <div className="relative z-20 max-w-2xl space-y-4">
                <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-bold w-fit">Featured Insight</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tighter leading-[1.05]">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-700 text-lg hidden md:block leading-relaxed font-medium line-clamp-2">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <Link href={`/site/blog/${featuredPost.slug}`} className="btn-primary px-8 py-4">Read Article</Link>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    {new Date(featuredPost.createdAt).toLocaleDateString('en-US')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-400">
            No insights published yet. Check back soon.
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 blog-grid-container">
          {gridPosts.map((post) => (
            <article key={post._id} className="group space-y-5 blog-grid-card">
              <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-slate-100 border border-slate-200 relative">
                {post.coverImage ? (
                  <img 
                    src={post.coverImage} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={post.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 italic">
                    {post.category} Image
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString('en-US')}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <Link href={`/site/blog/${post.slug}`} className="inline-flex items-center gap-2 text-slate-900 font-bold text-sm group-hover:gap-3 transition-all">
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div className="newsletter-section">
          <div className="glass-panel rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-blue-100 bg-blue-50/30 newsletter-card">
            <div className="space-y-3 max-w-md text-left">
              <h2 className="text-3xl font-bold text-slate-900">Stay Updated</h2>
              <p className="text-slate-600">Get the latest insights on technology and design delivered straight to your inbox.</p>
            </div>
            <form className="w-full max-w-md flex gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button type="submit" className="btn-primary">Join</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
