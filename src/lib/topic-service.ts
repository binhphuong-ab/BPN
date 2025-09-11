import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { Topic, SubTopic, generateTopicSlug } from '@/models/topic';

export class TopicService {
  private static async getTopicsCollection() {
    const db = await getDatabase();
    return db.collection<Topic>('topics');
  }

  private static async getSubTopicsCollection() {
    const db = await getDatabase();
    return db.collection<SubTopic>('subtopics');
  }

  // ===== TOPIC METHODS =====

  // Create a new topic
  static async createTopic(topicData: Omit<Topic, '_id' | 'createdAt' | 'updatedAt' | 'slug'>): Promise<Topic> {
    const collection = await this.getTopicsCollection();
    
    const slug = generateTopicSlug(topicData.name);
    
    const topic: Topic = {
      ...topicData,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(topic);
    return { ...topic, _id: result.insertedId };
  }

  // Update an existing topic
  static async updateTopic(id: string, updateData: Partial<Topic>): Promise<Topic | null> {
    const collection = await this.getTopicsCollection();
    
    const updates: Partial<Topic> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Update slug if name changed
    if (updateData.name) {
      updates.slug = generateTopicSlug(updateData.name);
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result;
  }

  // Delete a topic and all its subtopics
  static async deleteTopic(id: string): Promise<boolean> {
    const topicsCollection = await this.getTopicsCollection();
    const subTopicsCollection = await this.getSubTopicsCollection();

    // First delete all subtopics belonging to this topic
    await subTopicsCollection.deleteMany({ topicId: new ObjectId(id) });
    
    // Then delete the topic
    const result = await topicsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Get all topics with their subtopics count
  static async getAllTopics(): Promise<(Topic & { subTopicsCount: number })[]> {
    const topicsCollection = await this.getTopicsCollection();
    const subTopicsCollection = await this.getSubTopicsCollection();

    const topics = await topicsCollection.find({}).sort({ order: 1, createdAt: 1 }).toArray();
    
    // Get subtopics count for each topic
    const topicsWithCount = await Promise.all(
      topics.map(async (topic) => {
        const subTopicsCount = await subTopicsCollection.countDocuments({ 
          topicId: topic._id,
          isActive: true 
        });
        return { ...topic, subTopicsCount };
      })
    );

    return topicsWithCount;
  }

  // Get active topics for public use
  static async getActiveTopics(): Promise<Topic[]> {
    const collection = await this.getTopicsCollection();
    return await collection.find({ isActive: true }).sort({ order: 1, name: 1 }).toArray();
  }

  // Get topic by ID
  static async getTopicById(id: string): Promise<Topic | null> {
    const collection = await this.getTopicsCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  // Get topic by slug
  static async getTopicBySlug(slug: string): Promise<Topic | null> {
    const collection = await this.getTopicsCollection();
    return await collection.findOne({ slug, isActive: true });
  }

  // ===== SUBTOPIC METHODS =====

  // Create a new subtopic
  static async createSubTopic(subTopicData: Omit<SubTopic, '_id' | 'createdAt' | 'updatedAt' | 'slug'>): Promise<SubTopic> {
    const collection = await this.getSubTopicsCollection();
    
    const slug = generateTopicSlug(subTopicData.name);
    
    const subTopic: SubTopic = {
      ...subTopicData,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(subTopic);
    return { ...subTopic, _id: result.insertedId };
  }

  // Update an existing subtopic
  static async updateSubTopic(id: string, updateData: Partial<SubTopic>): Promise<SubTopic | null> {
    const collection = await this.getSubTopicsCollection();
    
    const updates: Partial<SubTopic> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Update slug if name changed
    if (updateData.name) {
      updates.slug = generateTopicSlug(updateData.name);
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result;
  }

  // Delete a subtopic
  static async deleteSubTopic(id: string): Promise<boolean> {
    const collection = await this.getSubTopicsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Get all subtopics for a topic
  static async getSubTopicsByTopicId(topicId: string): Promise<SubTopic[]> {
    const collection = await this.getSubTopicsCollection();
    return await collection.find({ topicId: new ObjectId(topicId) }).sort({ order: 1, name: 1 }).toArray();
  }

  // Get active subtopics for a topic
  static async getActiveSubTopicsByTopicId(topicId: string): Promise<SubTopic[]> {
    const collection = await this.getSubTopicsCollection();
    return await collection.find({ 
      topicId: new ObjectId(topicId), 
      isActive: true 
    }).sort({ order: 1, name: 1 }).toArray();
  }

  // Get subtopic by ID
  static async getSubTopicById(id: string): Promise<SubTopic | null> {
    const collection = await this.getSubTopicsCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  // Get subtopic by slug within a topic
  static async getSubTopicBySlug(topicSlug: string, subTopicSlug: string): Promise<SubTopic | null> {
    const topicsCollection = await this.getTopicsCollection();
    const subTopicsCollection = await this.getSubTopicsCollection();

    // First find the topic
    const topic = await topicsCollection.findOne({ slug: topicSlug, isActive: true });
    if (!topic) return null;

    // Then find the subtopic
    return await subTopicsCollection.findOne({ 
      topicId: topic._id,
      slug: subTopicSlug,
      isActive: true 
    });
  }

  // Update topic/subtopic order
  static async updateTopicOrder(updates: { id: string; order: number }[]): Promise<void> {
    const collection = await this.getTopicsCollection();
    
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: new ObjectId(update.id) },
        update: { $set: { order: update.order, updatedAt: new Date() } }
      }
    }));

    if (bulkOps.length > 0) {
      await collection.bulkWrite(bulkOps);
    }
  }

  static async updateSubTopicOrder(updates: { id: string; order: number }[]): Promise<void> {
    const collection = await this.getSubTopicsCollection();
    
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: new ObjectId(update.id) },
        update: { $set: { order: update.order, updatedAt: new Date() } }
      }
    }));

    if (bulkOps.length > 0) {
      await collection.bulkWrite(bulkOps);
    }
  }
}
