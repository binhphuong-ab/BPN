import { NextRequest, NextResponse } from 'next/server';
import { TopicService } from '@/lib/topic-service';
import { Topic } from '@/models/topic';
import { verifyToken } from '@/lib/auth-utils';

// GET /api/topics/[id] - Get a single topic by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topic = await TopicService.getTopicById(params.id);
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}

// PUT /api/topics/[id] - Update a topic
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
    
    const updateData: Partial<Topic> = await request.json();
    
    // If slug is being updated, check for uniqueness
    if (updateData.slug) {
      const existingTopic = await TopicService.getTopicBySlug(updateData.slug);
      if (existingTopic && existingTopic._id?.toString() !== params.id) {
        return NextResponse.json(
          { error: 'A topic with this slug already exists' },
          { status: 400 }
        );
      }
    }
    
    const topic = await TopicService.updateTopic(params.id, updateData);
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    );
  }
}

// DELETE /api/topics/[id] - Delete a topic
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
    
    const deleted = await TopicService.deleteTopic(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    );
  }
}
