import React from 'react';
import { getBlogPostById } from '../../../admin/blog-actions';
import BlogForm from './BlogForm';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  let post = null;

  if (!isNew) {
    post = await getBlogPostById(id);
  }

  return <BlogForm post={post} />;
}
