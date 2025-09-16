import { ObjectId } from 'mongodb';
import { generateVietnameseSlug } from '@/utils/vietnamese-slug-generating';

/**
 * Simple Book Model for Personal Library
 * 
 * This model represents books for display and download purposes only.
 * No borrowing system - just a showcase of available books.
 */

// Book Image interface for multiple image support
export interface BookImage {
  id: string; // Unique identifier for the image
  url: string; // Image URL or path
  alt?: string; // Alt text for accessibility
  order: number; // Display order (0 = primary)
  featured: boolean; // Whether this is a featured image
}

// Book Download interface for multiple download files
export interface BookDownload {
  id: string; // Unique identifier for the download
  name: string; // Display name for the download (e.g., "PDF Version", "EPUB Format")
  url: string; // Download URL or relative path
  order: number; // Display order
}

export interface Book {
  _id?: ObjectId;
  title: string;
  slug: string;
  images?: BookImage[]; // Multiple images (cover, gallery, content images)
  content?: string; // Main content/description in markdown format
  downloads?: BookDownload[]; // Multiple download files with names and URLs
  author?: string; // Book author(s)
  publisher?: string; // Publishing company
  language: 'English' | 'Vietnamese'; // Book language
  type: 'Paper' | 'Ebook' | 'Both'; // Available format types
  
  // Additional metadata
  publishedYear?: number; // Year of publication
  genre?: string[]; // Book genres/categories
  pages?: number; // Number of pages
  fileFormat?: string; // File format for ebooks (e.g., "PDF", "EPUB")
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  downloadCount?: number; // Number of times ebook was downloaded
  
  // SEO and display
  summary?: string; // Short description for display
  featured?: boolean; // Whether to feature on homepage
}

// Filter interface for searching books
export interface BookFilter {
  language?: 'English' | 'Vietnamese';
  type?: 'Paper' | 'Ebook' | 'Both';
  genre?: string;
  author?: string;
  search?: string; // Search in title, author, content
  featured?: boolean;
}

// Helper function to generate book slug
export function generateBookSlug(title: string): string {
  return generateVietnameseSlug(title);
}

// Helper function to extract summary from content
export function extractBookSummary(content: string, maxLength: number = 200): string {
  if (!content) return '';
  
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

// Helper function to validate download URLs (both relative and external)
export function validateDownloadUrl(url: string): boolean {
  if (!url.trim()) return false;
  
  // Check if it's a valid absolute URL
  try {
    new URL(url);
    return true;
  } catch {
    // Allow relative URLs (starting with /) for local files
    return url.startsWith('/') && !url.includes('..');
  }
}

// Helper function to validate all downloads
export function validateDownloads(downloads?: BookDownload[]): boolean {
  if (!downloads || downloads.length === 0) return true;
  
  return downloads.every(download => {
    return download.name.trim().length > 0 && validateDownloadUrl(download.url);
  });
}

// Helper functions for managing multiple downloads
export function createBookDownload(
  name: string,
  url: string,
  order: number = 0
): BookDownload {
  return {
    id: generateDownloadId(),
    name: name.trim(),
    url: url.trim(),
    order,
  };
}

// Helper functions for managing multiple images
export function createBookImage(
  url: string,
  order: number = 0,
  featured: boolean = false,
  alt?: string
): BookImage {
  return {
    id: generateImageId(),
    url: url.trim(),
    alt: alt?.trim() || undefined,
    order,
    featured,
  };
}

// Generate unique image ID
function generateImageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Generate unique download ID
function generateDownloadId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to get primary cover image
export function getPrimaryCoverImage(book: Book): BookImage | undefined {
  if (!book.images || book.images.length === 0) return undefined;
  
  // First try to find featured image with lowest order
  const featuredImages = book.images
    .filter(img => img.featured)
    .sort((a, b) => a.order - b.order);
    
  if (featuredImages.length > 0) return featuredImages[0];
  
  // Fallback to any image with lowest order
  return book.images.sort((a, b) => a.order - b.order)[0];
}

// Helper function to get gallery images
export function getGalleryImages(book: Book): BookImage[] {
  if (!book.images || book.images.length === 0) return [];
  
  const primaryImage = getPrimaryCoverImage(book);
  
  return book.images
    .filter(img => img.id !== primaryImage?.id) // Exclude the primary cover image
    .sort((a, b) => a.order - b.order);
}

// Helper function to validate image URLs
export function validateImageUrls(images?: BookImage[]): boolean {
  if (!images || images.length === 0) return true;
  
  return images.every(image => {
    try {
      new URL(image.url);
      return true;
    } catch {
      // Allow relative URLs for local images
      return image.url.startsWith('/') || !image.url.includes('://');
    }
  });
}

// Helper function to migrate old single image to new format
export function migrateOldImageFormat(oldImage?: string): BookImage[] {
  if (!oldImage) return [];
  
  return [
    createBookImage(oldImage, 0, true, 'Book cover')
  ];
}

// Helper function to check if book is downloadable
export function isBookDownloadable(book: Book): boolean {
  return (book.type === 'Ebook' || book.type === 'Both') && 
         Boolean(book.downloads && book.downloads.length > 0);
}

// Helper function to get primary download (first one)
export function getPrimaryDownload(book: Book): BookDownload | undefined {
  if (!book.downloads || book.downloads.length === 0) return undefined;
  return book.downloads.sort((a, b) => a.order - b.order)[0];
}

// Helper function to create book data with defaults
export function createBookData(data: Partial<Book>): Omit<Book, '_id' | 'createdAt' | 'updatedAt'> {
  return {
    title: data.title || '',
    slug: data.slug || generateBookSlug(data.title || ''),
    images: data.images || [],
    content: data.content,
    downloads: data.downloads || [],
    author: data.author,
    publisher: data.publisher,
    language: data.language || 'English',
    type: data.type || 'Paper',
    
    // Additional metadata
    publishedYear: data.publishedYear,
    genre: data.genre || [],
    pages: data.pages,
    fileFormat: data.fileFormat,
    
    // System fields
    downloadCount: data.downloadCount || 0,
    
    // SEO and display
    summary: data.summary || extractBookSummary(data.content || ''),
    featured: data.featured || false,
  };
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}