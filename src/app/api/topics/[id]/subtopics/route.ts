import { NextRequest, NextResponse } from 'next/server';
import { TopicService } from '@/lib/topic-service';
import { SubTopic } from '@/models/topic';

// GET /api/topics/[id]/subtopics - Get all subtopics for a topic
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    let subtopics;
    if (activeOnly) {
      subtopics = await TopicService.getActiveSubTopicsByTopicId(params.id);
    } else {
      subtopics = await TopicService.getSubTopicsByTopicId(params.id);
    }

    return NextResponse.json(subtopics);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subtopics' },
      { status: 500 }
    );
  }
}

// POST /api/topics/[id]/subtopics - Create a new subtopic
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subTopicData: Omit<SubTopic, '_id' | 'createdAt' | 'updatedAt' | 'topicId'> = await request.json();
    
    // Basic validation
    if (!subTopicData.name) {
      return NextResponse.json(
        { error: 'Subtopic name is required' },
        { status: 400 }
      );
    }

    // Validate slug if provided
    if (!subTopicData.slug || subTopicData.slug.trim() === '') {
      return NextResponse.json(
        { error: 'Subtopic slug is required' },
        { status: 400 }
      );
    }

    // Check if topic exists
    const topic = await TopicService.getTopicById(params.id);
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Check if slug already exists within this topic
    const existingSubTopic = await TopicService.getSubTopicBySlug(topic.slug, subTopicData.slug);
    if (existingSubTopic) {
      return NextResponse.json(
        { error: 'A subtopic with this slug already exists in this topic' },
        { status: 400 }
      );
    }

    const subtopic = await TopicService.createSubTopic({
      ...subTopicData,
      topicId: topic._id!,
    });
    
    return NextResponse.json(subtopic, { status: 201 });
  } catch (error) {
    console.error('Error creating subtopic:', error);
    return NextResponse.json(
      { error: 'Failed to create subtopic' },
      { status: 500 }
    );
  }
}
