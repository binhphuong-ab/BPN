import { NextRequest, NextResponse } from 'next/server';
import { LibraryService } from '@/lib/library-service';

interface RouteContext {
  params: { slug: string };
}

// GET /api/books/slug/[slug] - Get a single book by slug (public route)
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const book = await LibraryService.getBookBySlug(params.slug);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}