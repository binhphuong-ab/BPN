import { NextRequest, NextResponse } from 'next/server';
import { BookGenreService } from '@/lib/bookgenre-service';
import { SubGenre } from '@/models/bookgenre';
import { verifyToken } from '@/lib/auth-utils';
import { ObjectId } from 'mongodb';

// GET /api/bookgenres/[id]/subgenres - Get all subgenres for a book genre
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if the parent genre exists
    const genre = await BookGenreService.getBookGenreById(params.id);
    if (!genre) {
      return NextResponse.json(
        { error: 'Book genre not found' },
        { status: 404 }
      );
    }

    const subGenres = await BookGenreService.getSubGenresByGenreId(params.id);
    return NextResponse.json(subGenres);
  } catch (error) {
    console.error('Error fetching subgenres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subgenres' },
      { status: 500 }
    );
  }
}

// POST /api/bookgenres/[id]/subgenres - Create a new subgenre for a book genre
export async function POST(
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

    // Check if the parent genre exists
    const genre = await BookGenreService.getBookGenreById(params.id);
    if (!genre) {
      return NextResponse.json(
        { error: 'Book genre not found' },
        { status: 404 }
      );
    }
    
    const subGenreData: Omit<SubGenre, '_id' | 'createdAt' | 'updatedAt' | 'genreId'> = await request.json();
    
    // Basic validation
    if (!subGenreData.name || !subGenreData.name.trim()) {
      return NextResponse.json(
        { error: 'Subgenre name is required' },
        { status: 400 }
      );
    }

    // Validate slug if provided
    if (!subGenreData.slug || subGenreData.slug.trim() === '') {
      return NextResponse.json(
        { error: 'Subgenre slug is required' },
        { status: 400 }
      );
    }

    // Check if slug already exists within this genre
    const isSlugTaken = await BookGenreService.isSubGenreSlugTaken(params.id, subGenreData.slug);
    if (isSlugTaken) {
      return NextResponse.json(
        { error: 'A subgenre with this slug already exists in this book genre' },
        { status: 400 }
      );
    }

    // Create the subgenre with the parent genre ID
    const fullSubGenreData = {
      ...subGenreData,
      genreId: new ObjectId(params.id)
    };

    const subGenre = await BookGenreService.createSubGenre(fullSubGenreData);
    return NextResponse.json(subGenre, { status: 201 });
  } catch (error) {
    console.error('Error creating subgenre:', error);
    return NextResponse.json(
      { error: 'Failed to create subgenre' },
      { status: 500 }
    );
  }
}
