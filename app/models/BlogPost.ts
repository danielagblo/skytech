import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string; // Lexical JSON string
  coverImage: string;
  published: boolean;
  author: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'Technology' },
  excerpt: { type: String },
  content: { type: String }, // Store as JSON string from Lexical
  coverImage: { type: String },
  published: { type: Boolean, default: false },
  author: { type: String, default: 'Skytech Team' },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
