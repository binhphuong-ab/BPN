import { NextRequest, NextResponse } from 'next/server';
import { BookGenreService } from '@/lib/bookgenre-service';
import { SubGenre } from '@/models/bookgenre';
import { verifyToken } from '@/lib/auth-utils';

// GET /api/subgenres/[id] - Get a specific subgenre
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subGenre = await BookGenreService.getSubGenreById(params.id);
    
    if (!subGenre) {
      return NextResponse.json(
        { error: 'Subgenre not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subGenre);
  } catch (error) {
    console.error('Error fetching subgenre:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subgenre' },
      { status: 500 }
    );
  }
}

// PUT /api/subgenres/[id] - Update a subgenre
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

    // Get the current subgenre first to get the genreId for slug validation
    const currentSubGenre = await BookGenreService.getSubGenreById(params.id);
    if (!currentSubGenre) {
      return NextResponse.json(
        { error: 'Subgenre not found' },
        { status: 404 }
      );
    }
    
    const updateData: Partial<SubGenre> = await request.json();

    // Basic validation
    if (updateData.name !== undefined && !updateData.name.trim()) {
      return NextResponse.json(
        { error: 'Subgenre name is required' },
        { status: 400 }
      );
    }

    // Check if slug is being updated and if it's unique within the genre
    if (updateData.slug) {
      const isSlugTaken = await BookGenreService.isSubGenreSlugTaken(
        currentSubGenre.genreId.toString(), 
        updateData.slug, 
        params.id
      );
      if (isSlugTaken) {
        return NextResponse.json(
          { error: 'A subgenre with this slug already exists in this book genre' },
          { status: 400 }
        );
      }
    }

    const updatedSubGenre = await BookGenreService.updateSubGenre(params.id, updateData);
    
    if (!updatedSubGenre) {
      return NextResponse.json(
        { error: 'Subgenre not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubGenre);
  } catch (error) {
    console.error('Error updating subgenre:', error);
    return NextResponse.json(
      { error: 'Failed to update subgenre' },
      { status: 500 }
    );
  }
}

// DELETE /api/subgenres/[id] - Delete a subgenre
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

    const deleted = await BookGenreService.deleteSubGenre(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Subgenre not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Subgenre deleted successfully' });
  } catch (error) {
    console.error('Error deleting subgenre:', error);
    return NextResponse.json(
      { error: 'Failed to delete subgenre' },
      { status: 500 }
    );
  }
}
