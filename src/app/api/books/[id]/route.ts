import { NextRequest, NextResponse } from 'next/server';
import { LibraryService } from '@/lib/library-service';
import { validateImageUrls } from '@/models/book';
import { verifyToken } from '@/lib/auth-utils';

interface RouteContext {
  params: { id: string };
}

// GET /api/books/[id] - Get a single book by ID
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const book = await LibraryService.getBookById(params.id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] - Update a book (admin only)
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // Check authentication
    const isAuthenticated = await verifyToken(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const updateData = await request.json();
    
    // Validate language if provided
    if (updateData.language && !['English', 'Vietnamese'].includes(updateData.language)) {
      return NextResponse.json(
        { error: 'Language must be English or Vietnamese' },
        { status: 400 }
      );
    }

    // Validate type if provided
    if (updateData.type && !['Paper', 'Ebook', 'Both'].includes(updateData.type)) {
      return NextResponse.json(
        { error: 'Type must be Paper, Ebook, or Both' },
        { status: 400 }
      );
    }

    // Validate download URL if provided
    if (updateData.downloadUrl) {
      try {
        new URL(updateData.downloadUrl);
      } catch {
        return NextResponse.json(
          { error: 'Invalid download URL format' },
          { status: 400 }
        );
      }
    }
    
    // Validate image URLs if provided
    if (updateData.images && !validateImageUrls(updateData.images)) {
      return NextResponse.json(
        { error: 'Invalid image URL format in one or more images' },
        { status: 400 }
      );
    }

    const book = await LibraryService.updateBook(params.id, updateData);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] - Delete a book (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // Check authentication
    const isAuthenticated = await verifyToken(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const deleted = await LibraryService.deleteBook(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}