import { ObjectId } from 'mongodb';

export interface Topic {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  icon?: string; // Font Awesome icon class or emoji
  color?: string; // Hex color for visual categorization
  isActive: boolean;
  order: number; // For sorting topics
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTopic {
  _id?: ObjectId;
  topicId: ObjectId;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  order: number; // For sorting within a topic
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to generate slug from name
export function generateTopicSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Helper function to generate a random color
export function generateRandomColor(): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
