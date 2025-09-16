import { NextResponse } from 'next/server';
import { LibraryService } from '@/lib/library-service';

// GET /api/library/genres - Get all unique genres
export async function GET() {
  try {
    const genres = await LibraryService.getGenres();
    return NextResponse.json({ genres });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}