import React from 'react';
import dbConnect from '../../../lib/mongodb';
import BlogPost from '../../../models/BlogPost';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const post = await BlogPost.findOne({ slug }).lean();
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} - Skytech Ghana`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  await dbConnect();
  const post = await BlogPost.findOne({ slug }).lean();

  if (!post) {
    notFound();
  }

  // Simple Lexical JSON to HTML/JSX Renderer
  const renderContent = (contentJson) => {
    try {
      const state = JSON.parse(contentJson);
      return renderNode(state.root);
    } catch (e) {
      return <p className="text-red-500">Error rendering content.</p>;
    }
  };

  const renderNode = (node, index) => {
    if (!node) return null;

    const key = `${node.type}-${index}`;

    switch (node.type) {
      case 'root':
        return <div key={key} className="space-y-6">{node.children.map(renderNode)}</div>;
      case 'paragraph':
        return (
          <p key={key} className="text-lg text-slate-700 leading-relaxed">
            {node.children.map(renderNode)}
          </p>
        );
      case 'text':
        let text = node.text;
        if (node.format & 1) text = <strong key={`${key}-bold`}>{text}</strong>; // Bold
        if (node.format & 2) text = <em key={`${key}-italic`}>{text}</em>; // Italic
        return <span key={key}>{text}</span>;
      case 'heading':
        const Tag = node.tag;
        return (
          <Tag key={key} className="text-3xl font-black text-slate-900 tracking-tight mt-12 mb-6">
            {node.children.map(renderNode)}
          </Tag>
        );
      case 'list':
        const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
        return (
          <ListTag key={key} className={`ml-8 mb-6 space-y-3 ${node.tag === 'ol' ? 'list-decimal' : 'list-disc'}`}>
            {node.children.map(renderNode)}
          </ListTag>
        );
      case 'listitem':
        return <li key={key} className="text-slate-700">{node.children.map(renderNode)}</li>;
      case 'link':
        return (
          <a key={key} href={node.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {node.children.map(renderNode)}
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white">
      <article className="section-shell max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-6 text-center">
          <Link href="/site/blog" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all">
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            Back to Insights
          </Link>
          <div className="space-y-4">
            <span className="pill mx-auto">{post.category}</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-400 font-medium">
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>By {post.author || 'Skytech Team'}</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="aspect-[21/9] w-full rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl">
            <img src={post.coverImage} className="w-full h-full object-cover" alt={post.title} />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none">
          {renderContent(post.content)}
        </div>

        {/* Footer / CTA */}
        <div className="pt-16 border-t border-slate-100 mt-20">
            <div className="bg-slate-50 rounded-[2.5rem] p-10 md:p-16 text-center space-y-6">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900">Have a project in mind?</h3>
                <p className="text-slate-500 max-w-xl mx-auto">
                    We help businesses turn complex ideas into high-performance digital products. Let's discuss your next big move.
                </p>
                <Link href="/site/contact" className="btn-primary inline-flex px-10 py-5 text-lg">
                    Work With Us
                </Link>
            </div>
        </div>
      </article>
    </main>
  );
}
