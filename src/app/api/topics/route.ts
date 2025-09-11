import { NextRequest, NextResponse } from 'next/server';
import { TopicService } from '@/lib/topic-service';
import { Topic } from '@/models/topic';

// GET /api/topics - Get all topics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    let topics;
    if (activeOnly) {
      topics = await TopicService.getActiveTopics();
    } else {
      topics = await TopicService.getAllTopics();
    }

    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

// POST /api/topics - Create a new topic
export async function POST(request: NextRequest) {
  try {
    const topicData: Omit<Topic, '_id' | 'createdAt' | 'updatedAt' | 'slug'> = await request.json();
    
    // Basic validation
    if (!topicData.name) {
      return NextResponse.json(
        { error: 'Topic name is required' },
        { status: 400 }
      );
    }

    const topic = await TopicService.createTopic(topicData);
    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}

// PUT /api/topics - Update topic order
export async function PUT(request: NextRequest) {
  try {
    const { updates }: { updates: { id: string; order: number }[] } = await request.json();
    
    await TopicService.updateTopicOrder(updates);
    return NextResponse.json({ message: 'Topic order updated successfully' });
  } catch (error) {
    console.error('Error updating topic order:', error);
    return NextResponse.json(
      { error: 'Failed to update topic order' },
      { status: 500 }
    );
  }
}
