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

// Helper function to validate genre data
function validateGenreData(genre: Partial<BookGenre>): boolean {
  return Boolean(
    genre.name && 
    genre.name.trim().length > 0 &&
    genre.slug
  );
}

// Helper function to validate subgenre data
function validateSubGenreData(subGenre: Partial<SubGenre>): boolean {
  return Boolean(
    subGenre.name && 
    subGenre.name.trim().length > 0 &&
    subGenre.slug &&
    subGenre.genreId
  );
}

// Helper function to create genre data with defaults
function createGenreData(data: Partial<BookGenre>): Omit<BookGenre, '_id' | 'createdAt' | 'updatedAt'> {
  return {
    name: data.name?.trim() || '',
    slug: data.slug || generateGenreSlug(data.name || ''),
    icon: data.icon?.trim(),
    color: data.color || generateRandomGenreColor(),
    order: data.order ?? 0,
    bookCount: data.bookCount || 0,
    featured: data.featured || false,
  };
}

// Helper function to create subgenre data with defaults
function createSubGenreData(data: Partial<SubGenre>): Omit<SubGenre, '_id' | 'createdAt' | 'updatedAt'> {
  if (!data.genreId) {
    throw new Error('genreId is required for creating subgenre');
  }
  
  return {
    genreId: data.genreId,
    name: data.name?.trim() || '',
    slug: data.slug || generateGenreSlug(data.name || ''),
    icon: data.icon?.trim(),
    order: data.order ?? 0,
    bookCount: data.bookCount || 0,
  };
}

// Helper function to get genre hierarchy (genre with its subgenres)
interface GenreHierarchy extends BookGenre {
  subGenres: SubGenre[];
}

// Helper function to format genre display name
function formatGenreDisplayName(genre: BookGenre, includeCount: boolean = false): string {
  let displayName = genre.name;
  
  if (includeCount && genre.bookCount !== undefined) {
    displayName += ` (${genre.bookCount})`;
  }
  
  return displayName;
}

// Helper function to format subgenre display name
function formatSubGenreDisplayName(subGenre: SubGenre, includeCount: boolean = false): string {
  let displayName = subGenre.name;
  
  if (includeCount && subGenre.bookCount !== undefined) {
    displayName += ` (${subGenre.bookCount})`;
  }
  
  return displayName;
}

// Helper function to get genre breadcrumb path
function getGenreBreadcrumb(genre: BookGenre, subGenre?: SubGenre): string[] {
  const breadcrumb = [genre.name];
  
  if (subGenre) {
    breadcrumb.push(subGenre.name);
  }
  
  return breadcrumb;
}

// Helper function to check if slug is unique (to be used in validation)
function isSlugUnique(slug: string, existingSlugs: string[]): boolean {
  return !existingSlugs.includes(slug);
}

// Predefined popular book genres for quick setup
const POPULAR_BOOK_GENRES = [
  { name: 'Fiction', icon: '📖', color: '#3B82F6' },
  { name: 'Non-Fiction', icon: '📚', color: '#10B981' },
  { name: 'Science Fiction', icon: '🚀', color: '#8B5CF6' },
  { name: 'Mystery & Thriller', icon: '🔍', color: '#EF4444' },
  { name: 'Romance', icon: '💕', color: '#EC4899' },
  { name: 'Fantasy', icon: '🐉', color: '#A855F7' },
  { name: 'Biography & Memoir', icon: '👤', color: '#F59E0B' },
  { name: 'History', icon: '⏳', color: '#6B7280' },
  { name: 'Science & Technology', icon: '🔬', color: '#06B6D4' },
  { name: 'Self-Help', icon: '💪', color: '#84CC16' },
  { name: 'Business & Economics', icon: '📊', color: '#F97316' },
  { name: 'Health & Fitness', icon: '🏃', color: '#22C55E' },
  { name: 'Art & Design', icon: '🎨', color: '#F43F5E' },
  { name: 'Cooking', icon: '👨‍🍳', color: '#14B8A6' },
  { name: 'Travel', icon: '✈️', color: '#0EA5E9' },
];

// Predefined subgenres for Fiction
const FICTION_SUBGENRES = [
  'Literary Fiction',
  'Historical Fiction',
  'Contemporary Fiction',
  'Young Adult Fiction',
  'Children\'s Fiction',
  'Short Stories',
  'Classics',
];

// Predefined subgenres for Non-Fiction
const NON_FICTION_SUBGENRES = [
  'Essays',
  'True Crime',
  'Philosophy',
  'Religion & Spirituality',
  'Politics',
  'Social Sciences',
  'Psychology',
];
