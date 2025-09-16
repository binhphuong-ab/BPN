import { NextResponse } from 'next/server';
import { LibraryService } from '@/lib/library-service';

// GET /api/library/stats - Get simple library statistics
export async function GET() {
  try {
    const stats = await LibraryService.getLibraryStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching library stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch library statistics' },
      { status: 500 }
    );
  }
}