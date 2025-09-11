import { ObjectId } from 'mongodb';

export interface BlogPost {
  _id?: ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  image?: string; // Featured image URL/path (e.g., /images/blog/post-hero.jpg)
  language: 'English' | 'Vietnamese'; // Post language
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  readTime?: number; // in minutes
  views?: number;
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Helper function to calculate reading time
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Helper function to extract excerpt from content
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax for excerpt
  const plainText = content
    .replace(/[#*_`~]/g, '') // Remove markdown formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to plain text
    .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}
