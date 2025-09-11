import { NextResponse } from 'next/server';
import { BlogService } from '@/lib/blog-service';

// GET /api/tags - Get all unique tags
export async function GET() {
  try {
    const tags = await BlogService.getTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
