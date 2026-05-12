import React from 'react';
import { getBlogPostById } from '../../../admin/blog-actions';
import BlogForm from './BlogForm';

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new';
  let post = null;

  if (!isNew) {
    post = await getBlogPostById(params.id);
  }

  return <BlogForm post={post} />;
}
