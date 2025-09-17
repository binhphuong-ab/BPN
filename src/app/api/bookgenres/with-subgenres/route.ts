import { NextRequest, NextResponse } from 'next/server';
import { BookGenreService } from '@/lib/bookgenre-service';

// GET /api/bookgenres/with-subgenres - Get all genres with their subgenres in a single optimized query
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';

    console.log('📊 Optimized BookGenres API called with featured:', featured);

    // Use the new optimized method that fetches genres and subgenres in a single aggregation query
    const genresWithSubGenres = await BookGenreService.getAllBookGenresWithSubGenres(featured);

    const queryTime = Date.now() - startTime;
    console.log(`⚡ Optimized BookGenres API completed in ${queryTime}ms, returned ${genresWithSubGenres.length} genres with subgenres`);

    // Create response with caching headers
    const response = NextResponse.json({
      genres: genresWithSubGenres,
      queryTime,
      total: genresWithSubGenres.length
    });

    // Cache genres for longer since they change less frequently (10 minutes)
    response.headers.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=300');
    response.headers.set('X-Query-Time', `${queryTime}ms`);

    return response;
  } catch (error: unknown) {
    console.error('❌ Error fetching book genres with subgenres:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch book genres',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
