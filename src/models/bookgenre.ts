import { ObjectId } from 'mongodb';
import { generateVietnameseSlug } from '@/utils/vietnamese-slug-generating';

/**
 * Book Genre Model for Library System
 * 
 * This model manages book genres and their subgenres for better organization
 * and categorization of books in the library system.
 */

export interface BookGenre {
  _id?: ObjectId;
  name: string;
  slug: string;
  icon?: string; // Font Awesome icon class or emoji for visual representation
  color?: string; // Hex color for UI theming and categorization
  order: number; // For sorting genres in displays
  createdAt: Date;
  updatedAt: Date;
  
  // Additional metadata
  bookCount?: number; // Number of books in this genre (computed field)
  featured?: boolean; // Whether to feature this genre on homepage or special displays
}

export interface SubGenre {
  _id?: ObjectId;
  genreId: ObjectId; // Reference to the parent BookGenre
  name: string;
  slug: string;
  icon?: string; // Optional icon for subgenre
  order: number; // For sorting within a genre
  createdAt: Date;
  updatedAt: Date;
  
  // Additional metadata
  bookCount?: number; // Number of books in this subgenre (computed field)
}

export interface BookGenreWithCount extends BookGenre {
  subGenresCount: number;
}

// Filter interface for filtering genres
export interface BookGenreFilter {
  featured?: boolean;
}

export interface SubGenreFilter {
  genreId?: ObjectId;
}

// Helper function to generate genre slug from name
export function generateGenreSlug(name: string): string {
  return generateVietnameseSlug(name);
}

// Helper function to generate a random color for genres
export function generateRandomGenreColor(): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green  
    '#F59E0B', // Yellow/Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple/Violet
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#14B8A6', // Teal
    '#F43F5E', // Rose
    '#A855F7', // Purple
    '#0EA5E9', // Sky
    '#22C55E', // Green
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

