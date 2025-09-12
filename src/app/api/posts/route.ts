import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/blog-service';
import { BlogPost } from '@/models';

// GET /api/posts - Get all published posts with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag') || undefined;
    const search = searchParams.get('search');

    let result;
    if (search) {
      result = await BlogService.searchPosts(search, page, limit);
    } else {
      result = await BlogService.getPublishedPosts(page, limit, tag);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post (admin only)
export async function POST(request: NextRequest) {
  try {
    const postData: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt' | 'views'> = await request.json();
    
    // Basic validation
    if (!postData.title || !postData.content || !postData.author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    // Optional: Validate summary length if provided
    if (postData.summary && postData.summary.length > 300) {
      return NextResponse.json(
        { error: 'Summary must be 300 characters or less' },
        { status: 400 }
      );
    }

    const post = await BlogService.createPost(postData);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
