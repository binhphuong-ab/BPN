import { NextRequest, NextResponse } from 'next/server';
import { LibraryService } from '@/lib/library-service';
import { Book, BookFilter, validateImageUrls } from '@/models/book';
import { verifyToken } from '@/lib/auth-utils';

// GET /api/books - Get all books with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search');
    const language = searchParams.get('language') as 'English' | 'Vietnamese' | null;
    const type = searchParams.get('type') as 'Paper' | 'Ebook' | 'Both' | null;
    const genre = searchParams.get('genre');
    const author = searchParams.get('author');
    const featured = searchParams.get('featured') === 'true' ? true : undefined;

    const filter: BookFilter = {};
    if (search) filter.search = search;
    if (language) filter.language = language;
    if (type) filter.type = type;
    if (genre) filter.genre = genre;
    if (author) filter.author = author;
    if (featured !== undefined) filter.featured = featured;

    const result = await LibraryService.getBooks(filter, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST /api/books - Create a new book (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await verifyToken(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
    
    const bookData: Omit<Book, '_id' | 'createdAt' | 'updatedAt'> = await request.json();
    
    // Basic validation
    if (!bookData.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Validate language
    if (!['English', 'Vietnamese'].includes(bookData.language)) {
      return NextResponse.json(
        { error: 'Language must be English or Vietnamese' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['Paper', 'Ebook', 'Both'].includes(bookData.type)) {
      return NextResponse.json(
        { error: 'Type must be Paper, Ebook, or Both' },
        { status: 400 }
      );
    }

    // Validate downloads if provided
    if (bookData.downloads && bookData.downloads.length > 0) {
      for (const download of bookData.downloads) {
        if (!download.name || !download.name.trim()) {
          return NextResponse.json(
            { error: 'Download name is required for all downloads' },
            { status: 400 }
          );
        }
        
        if (!download.url || !download.url.trim()) {
          return NextResponse.json(
            { error: 'Download URL is required for all downloads' },
            { status: 400 }
          );
        }

        // Validate URL format (both relative and absolute)
        if (!download.url.startsWith('/') && !download.url.startsWith('http')) {
          return NextResponse.json(
            { error: 'Download URL must be either a relative path (/documents/...) or a full URL (https://...)' },
            { status: 400 }
          );
        }

        // For absolute URLs, validate format
        if (download.url.startsWith('http')) {
          try {
            new URL(download.url);
          } catch {
            return NextResponse.json(
              { error: 'Invalid download URL format' },
              { status: 400 }
            );
          }
        }
      }
    }
    
    // Validate image URLs if provided
    if (bookData.images && !validateImageUrls(bookData.images)) {
      return NextResponse.json(
        { error: 'Invalid image URL format in one or more images' },
        { status: 400 }
      );
    }

    const book = await LibraryService.createBook({
      ...bookData,
      downloadCount: 0,
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}