import { NextRequest, NextResponse } from 'next/server';
import { LibraryService } from '@/lib/library-service';

interface RouteContext {
  params: { id: string };
}

// POST /api/books/[id]/download - Track ebook download (increment counter)
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const book = await LibraryService.downloadBook(params.id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found or not available for download' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Download tracked successfully',
      downloadUrl: book.downloadUrl,
      book: {
        id: book._id,
        title: book.title,
        author: book.author,
        downloadCount: book.downloadCount,
      },
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}