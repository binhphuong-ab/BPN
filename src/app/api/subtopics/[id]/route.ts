import { NextRequest, NextResponse } from 'next/server';
import { TopicService } from '@/lib/topic-service';
import { SubTopic } from '@/models/topic';

// GET /api/subtopics/[id] - Get a single subtopic by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subtopic = await TopicService.getSubTopicById(params.id);
    
    if (!subtopic) {
      return NextResponse.json(
        { error: 'Subtopic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subtopic);
  } catch (error) {
    console.error('Error fetching subtopic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subtopic' },
      { status: 500 }
    );
  }
}

// PUT /api/subtopics/[id] - Update a subtopic
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updateData: Partial<SubTopic> = await request.json();
    
    // If slug is being updated, check for uniqueness within the topic
    if (updateData.slug) {
      const currentSubTopic = await TopicService.getSubTopicById(params.id);
      if (currentSubTopic) {
        const topic = await TopicService.getTopicById(currentSubTopic.topicId.toString());
        if (topic) {
          const existingSubTopic = await TopicService.getSubTopicBySlug(topic.slug, updateData.slug);
          if (existingSubTopic && existingSubTopic._id?.toString() !== params.id) {
            return NextResponse.json(
              { error: 'A subtopic with this slug already exists in this topic' },
              { status: 400 }
            );
          }
        }
      }
    }
    
    const subtopic = await TopicService.updateSubTopic(params.id, updateData);
    
    if (!subtopic) {
      return NextResponse.json(
        { error: 'Subtopic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subtopic);
  } catch (error) {
    console.error('Error updating subtopic:', error);
    return NextResponse.json(
      { error: 'Failed to update subtopic' },
      { status: 500 }
    );
  }
}

// DELETE /api/subtopics/[id] - Delete a subtopic
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await TopicService.deleteSubTopic(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Subtopic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Subtopic deleted successfully' });
  } catch (error) {
    console.error('Error deleting subtopic:', error);
    return NextResponse.json(
      { error: 'Failed to delete subtopic' },
      { status: 500 }
    );
  }
}
