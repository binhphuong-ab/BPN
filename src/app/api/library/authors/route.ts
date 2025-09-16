import { NextResponse } from 'next/server';
import { LibraryService } from '@/lib/library-service';

// GET /api/library/authors - Get all unique authors
export async function GET() {
  try {
    const authors = await LibraryService.getAuthors();
    return NextResponse.json({ authors });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}