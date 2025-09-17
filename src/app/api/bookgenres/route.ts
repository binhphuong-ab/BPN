import { NextRequest, NextResponse } from 'next/server';
import { BookGenreService } from '@/lib/bookgenre-service';
import { BookGenre } from '@/models/bookgenre';
import { verifyToken } from '@/lib/auth-utils';

// GET /api/bookgenres - Get all book genres (OPTIMIZED)
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';

    console.log('📊 BookGenres API called with featured:', featured);

    let genres;
    if (featured) {
      genres = await BookGenreService.getFeaturedBookGenres();
    } else {
      genres = await BookGenreService.getAllBookGenres();
    }

    const queryTime = Date.now() - startTime;
    console.log(`⚡ BookGenres API completed in ${queryTime}ms, returned ${genres.length} genres`);

    // Create response with caching headers
    const response = NextResponse.json({
      genres,
      queryTime,
      total: genres.length
    });

    // Cache genres for longer since they change less frequently (10 minutes)
    response.headers.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=300');
    response.headers.set('X-Query-Time', `${queryTime}ms`);

    return response;
  } catch (error) {
    console.error('❌ Error fetching book genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book genres' },
      { status: 500 }
    );
  }
}

// POST /api/bookgenres - Create a new book genre
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
    
    const genreData: Omit<BookGenre, '_id' | 'createdAt' | 'updatedAt'> = await request.json();
    
    // Basic validation
    if (!genreData.name || !genreData.name.trim()) {
      return NextResponse.json(
        { error: 'Book genre name is required' },
        { status: 400 }
      );
    }

    // Validate slug if provided
    if (!genreData.slug || genreData.slug.trim() === '') {
      return NextResponse.json(
        { error: 'Book genre slug is required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const isSlugTaken = await BookGenreService.isSlugTaken(genreData.slug);
    if (isSlugTaken) {
      return NextResponse.json(
        { error: 'A book genre with this slug already exists' },
        { status: 400 }
      );
    }

    const genre = await BookGenreService.createBookGenre(genreData);
    return NextResponse.json(genre, { status: 201 });
  } catch (error) {
    console.error('Error creating book genre:', error);
    return NextResponse.json(
      { error: 'Failed to create book genre' },
      { status: 500 }
    );
  }
}
