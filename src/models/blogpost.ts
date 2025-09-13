import { ObjectId } from 'mongodb';
import { generateVietnameseSlug } from '@/utils/vietnamese-slug-generating';

/**
 * BlogPost Model with Topic/SubTopic Relationships
 * 
 * This model establishes relationships between blog posts and the topic/subtopic system:
 * - A blog post can be assigned to a Topic (topicId)
 * - A blog post can optionally be assigned to a SubTopic (subTopicId)
 * - If assigned to a SubTopic, it must also have a Topic
 * - Provides helper functions for validation and data manipulation
 */

// Extended interface for populated blog posts with topic/subtopic data
export interface BlogPostWithTopics extends BlogPost {
  topic?: {
    _id: ObjectId;
    name: string;
    slug: string;
    icon?: string;
    color?: string;
  };
  subTopic?: {
    _id: ObjectId;
    name: string;
    slug: string;
    icon?: string;
  };
}

// Document interface for blog post attachments
export interface Document {
  name: string; // Display name for the document
  url: string; // URL for the document (relative path or external URL)
  image?: string; // Optional thumbnail/icon image for the document
}

// Filter interface for querying posts by topics
export interface BlogPostFilter {
  topicId?: ObjectId | string;
  subTopicId?: ObjectId | string;
  language?: 'English' | 'Vietnamese';
  published?: boolean;
  author?: string;
  search?: string; // For searching in title/content/summary
}

export interface BlogPost {
  _id?: ObjectId;
  title: string;
  slug: string;
  content: string;
  summary: string;
  author: string;
  image?: string; // Featured image URL/path (e.g., /images/blog/post-hero.jpg)
  language: 'English' | 'Vietnamese'; // Post language
  published: boolean;
  topicId?: ObjectId; // Reference to Topic
  subTopicId?: ObjectId; // Reference to SubTopic (optional, can be null if only topic is assigned)
  document?: Document; // Optional document attachment (local file or external URL)
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  readTime?: number; // in minutes
  views?: number;
}

// Helper function to calculate reading time
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Helper function to extract summary from content
export function extractSummary(content: string, maxLength: number = 160): string {
  // Remove markdown syntax for summary
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

// Helper function to validate topic/subtopic relationship
export function validateTopicRelationship(topicId?: ObjectId, subTopicId?: ObjectId): boolean {
  // If subtopic is provided, topic must also be provided
  if (subTopicId && !topicId) {
    return false;
  }
  return true;
}

// Helper function to validate document field
export function validateDocument(document?: Document): boolean {
  if (!document) return true; // Document is optional
  
  // Document must have a name
  if (!document.name || document.name.trim() === '') {
    return false;
  }
  
  // Document must have a URL
  if (!document.url || document.url.trim() === '') {
    return false;
  }
  
  return true;
}

// Helper function to create a blog post with topic validation
export function createBlogPostData(data: Partial<BlogPost>): Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt'> {
  const now = new Date();
  
  // Validate topic relationship
  if (!validateTopicRelationship(data.topicId, data.subTopicId)) {
    throw new Error('SubTopic cannot be assigned without a Topic');
  }
  
  // Validate document field
  if (!validateDocument(data.document)) {
    throw new Error('Document must have a name and URL');
  }
  
  return {
    title: data.title || '',
    slug: data.slug || generateVietnameseSlug(data.title || ''),
    content: data.content || '',
    summary: data.summary || extractSummary(data.content || ''),
    author: data.author || '',
    image: data.image,
    language: data.language || 'English',
    published: data.published || false,
    topicId: data.topicId,
    subTopicId: data.subTopicId,
    document: data.document,
    publishedAt: data.published ? now : undefined,
    readTime: data.readTime || calculateReadTime(data.content || ''),
    views: data.views || 0,
  };
}

// Helper function to get topic breadcrumb for a blog post
export function getTopicBreadcrumb(post: BlogPostWithTopics): string[] {
  const breadcrumb: string[] = [];
  
  if (post.topic) {
    breadcrumb.push(post.topic.name);
  }
  
  if (post.subTopic) {
    breadcrumb.push(post.subTopic.name);
  }
  
  return breadcrumb;
}

// Helper function to check if a document URL is external
export function isExternalDocumentUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
