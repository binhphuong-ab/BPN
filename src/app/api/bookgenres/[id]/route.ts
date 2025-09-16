import { NextRequest, NextResponse } from 'next/server';
import { BookGenreService } from '@/lib/bookgenre-service';
import { BookGenre } from '@/models/bookgenre';
import { verifyToken } from '@/lib/auth-utils';

// GET /api/bookgenres/[id] - Get a specific book genre
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const genre = await BookGenreService.getBookGenreById(params.id);
    
    if (!genre) {
      return NextResponse.json(
        { error: 'Book genre not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(genre);
  } catch (error) {
    console.error('Error fetching book genre:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book genre' },
      { status: 500 }
    );
  }
}

// PUT /api/bookgenres/[id] - Update a book genre
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    const updateData: Partial<BookGenre> = await request.json();

    // Basic validation
    if (updateData.name !== undefined && !updateData.name.trim()) {
      return NextResponse.json(
        { error: 'Book genre name is required' },
        { status: 400 }
      );
    }

    // Check if slug is being updated and if it's unique
    if (updateData.slug) {
      const isSlugTaken = await BookGenreService.isSlugTaken(updateData.slug, params.id);
      if (isSlugTaken) {
        return NextResponse.json(
          { error: 'A book genre with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const updatedGenre = await BookGenreService.updateBookGenre(params.id, updateData);
    
    if (!updatedGenre) {
      return NextResponse.json(
        { error: 'Book genre not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGenre);
  } catch (error) {
    console.error('Error updating book genre:', error);
    return NextResponse.json(
      { error: 'Failed to update book genre' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookgenres/[id] - Delete a book genre and all its subgenres
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const deleted = await BookGenreService.deleteBookGenre(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Book genre not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Book genre and all its subgenres deleted successfully' });
  } catch (error) {
    console.error('Error deleting book genre:', error);
    return NextResponse.json(
      { error: 'Failed to delete book genre' },
      { status: 500 }
    );
  }
}
