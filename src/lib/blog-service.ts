import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { BlogPost, BlogPostWithTopics, calculateReadTime, extractSummary } from '@/models';
import { generateVietnameseSlug } from '@/utils/vietnamese-slug-generating';

export class BlogService {
  private static async getCollection() {
    const db = await getDatabase();
    return db.collection<BlogPost>('posts');
  }

  // Create a new blog post
  static async createPost(postData: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<BlogPost> {
    const collection = await this.getCollection();
    
    const slug = generateVietnameseSlug(postData.title);
    const readTime = calculateReadTime(postData.content);
    // Use provided summary or generate one from content
    const summary = postData.summary || extractSummary(postData.content);
    
    const post: BlogPost = {
      ...postData,
      slug,
      summary,
      readTime,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: postData.published ? new Date() : undefined,
    };

    const result = await collection.insertOne(post);
    return { ...post, _id: result.insertedId };
  }

  // Update an existing blog post
  static async updatePost(id: string, updateData: Partial<BlogPost>): Promise<BlogPost | null> {
    const collection = await this.getCollection();
    
    const updates: Partial<BlogPost> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Update slug if title changed
    if (updateData.title) {
      updates.slug = generateVietnameseSlug(updateData.title);
    }

    // Update read time and summary if content changed
    if (updateData.content) {
      updates.readTime = calculateReadTime(updateData.content);
      // Only auto-generate summary if not explicitly provided
      if (!updateData.summary) {
        updates.summary = extractSummary(updateData.content);
      }
    }

    // Set published date if publishing for the first time
    if (updateData.published && !updateData.publishedAt) {
      updates.publishedAt = new Date();
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result;
  }

  // Delete a blog post
  static async deletePost(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Get a single blog post by ID
  static async getPostById(id: string): Promise<BlogPost | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  // Get a single blog post by slug with populated topic information
  static async getPostBySlugWithTopic(slug: string): Promise<BlogPostWithTopics | null> {
    const db = await getDatabase();
    const collection = db.collection<BlogPost>('posts');
    
    // Aggregation pipeline to get post with populated topic
    const pipeline = [
      { $match: { slug, published: true } },
      {
        $addFields: {
          topicObjectId: {
            $cond: {
              if: { $ne: ['$topicId', null] },
              then: { $toObjectId: '$topicId' },
              else: null
            }
          },
          subTopicObjectId: {
            $cond: {
              if: { $ne: ['$subTopicId', null] },
              then: { $toObjectId: '$subTopicId' },
              else: null
            }
          }
        }
      },
      {
        $lookup: {
          from: 'topics',
          localField: 'topicObjectId',
          foreignField: '_id',
          as: 'topic'
        }
      },
      {
        $lookup: {
          from: 'subtopics',
          localField: 'subTopicObjectId',
          foreignField: '_id',
          as: 'subTopic'
        }
      },
      {
        $addFields: {
          topic: { $arrayElemAt: ['$topic', 0] },
          subTopic: { $arrayElemAt: ['$subTopic', 0] }
        }
      },
      {
        $unset: ['topicObjectId', 'subTopicObjectId']
      }
    ];

    const [post] = await collection.aggregate<BlogPostWithTopics>(pipeline).toArray();
    
    // Increment view count
    if (post) {
      await collection.updateOne(
        { _id: post._id },
        { $inc: { views: 1 } }
      );
      post.views = (post.views || 0) + 1;
    }
    
    return post || null;
  }

  // Get a single blog post by slug
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const collection = await this.getCollection();
    const post = await collection.findOne({ slug, published: true });
    
    // Increment view count
    if (post) {
      await collection.updateOne(
        { _id: post._id },
        { $inc: { views: 1 } }
      );
      post.views = (post.views || 0) + 1;
    }
    
    return post;
  }

  // Get published posts with populated topic information
  static async getPublishedPostsWithTopics(
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: BlogPostWithTopics[]; total: number; hasMore: boolean }> {
    const db = await getDatabase();
    const collection = db.collection<BlogPost>('posts');
    const skip = (page - 1) * limit;

    // Build match filter
    const matchFilter: Record<string, unknown> = { published: true };

    // Aggregation pipeline to populate topic information
    const pipeline = [
      { $match: matchFilter },
      { $sort: { publishedAt: -1 } },
      {
        $addFields: {
          topicObjectId: {
            $cond: {
              if: { $ne: ['$topicId', null] },
              then: { $toObjectId: '$topicId' },
              else: null
            }
          },
          subTopicObjectId: {
            $cond: {
              if: { $ne: ['$subTopicId', null] },
              then: { $toObjectId: '$subTopicId' },
              else: null
            }
          }
        }
      },
      {
        $lookup: {
          from: 'topics',
          localField: 'topicObjectId',
          foreignField: '_id',
          as: 'topic'
        }
      },
      {
        $lookup: {
          from: 'subtopics',
          localField: 'subTopicObjectId',
          foreignField: '_id',
          as: 'subTopic'
        }
      },
      {
        $addFields: {
          topic: { $arrayElemAt: ['$topic', 0] },
          subTopic: { $arrayElemAt: ['$subTopic', 0] }
        }
      },
      {
        $unset: ['topicObjectId', 'subTopicObjectId']
      },
      { $skip: skip },
      { $limit: limit }
    ];

    const posts = await collection.aggregate<BlogPostWithTopics>(pipeline).toArray();
    const total = await collection.countDocuments(matchFilter);
    const hasMore = skip + posts.length < total;

    return { posts, total, hasMore };
  }

  // Get all published blog posts with pagination
  static async getPublishedPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: BlogPost[]; total: number; hasMore: boolean }> {
    const collection = await this.getCollection();
    const skip = (page - 1) * limit;
    
    const filter = { published: true };

    const posts = await collection
      .find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(filter);
    const hasMore = skip + posts.length < total;

    return { posts, total, hasMore };
  }

  // Get all posts (including drafts) for admin
  static async getAllPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: BlogPost[]; total: number; hasMore: boolean }> {
    const collection = await this.getCollection();
    const skip = (page - 1) * limit;

    const posts = await collection
      .find({})
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments({});
    const hasMore = skip + posts.length < total;

    return { posts, total, hasMore };
  }

  // Search posts by title or content with populated topic information
  static async searchPostsWithTopics(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: BlogPostWithTopics[]; total: number; hasMore: boolean }> {
    const db = await getDatabase();
    const collection = db.collection<BlogPost>('posts');
    const skip = (page - 1) * limit;

    const searchFilter = {
      published: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    };

    // Aggregation pipeline to populate topic information
    const pipeline = [
      { $match: searchFilter },
      { $sort: { publishedAt: -1 } },
      {
        $addFields: {
          topicObjectId: {
            $cond: {
              if: { $ne: ['$topicId', null] },
              then: { $toObjectId: '$topicId' },
              else: null
            }
          },
          subTopicObjectId: {
            $cond: {
              if: { $ne: ['$subTopicId', null] },
              then: { $toObjectId: '$subTopicId' },
              else: null
            }
          }
        }
      },
      {
        $lookup: {
          from: 'topics',
          localField: 'topicObjectId',
          foreignField: '_id',
          as: 'topic'
        }
      },
      {
        $lookup: {
          from: 'subtopics',
          localField: 'subTopicObjectId',
          foreignField: '_id',
          as: 'subTopic'
        }
      },
      {
        $addFields: {
          topic: { $arrayElemAt: ['$topic', 0] },
          subTopic: { $arrayElemAt: ['$subTopic', 0] }
        }
      },
      {
        $unset: ['topicObjectId', 'subTopicObjectId']
      },
      { $skip: skip },
      { $limit: limit }
    ];

    const posts = await collection.aggregate<BlogPostWithTopics>(pipeline).toArray();
    const total = await collection.countDocuments(searchFilter);
    const hasMore = skip + posts.length < total;

    return { posts, total, hasMore };
  }

  // Search posts by title or content
  static async searchPosts(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: BlogPost[]; total: number; hasMore: boolean }> {
    const collection = await this.getCollection();
    const skip = (page - 1) * limit;

    const searchFilter = {
      published: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    };

    const posts = await collection
      .find(searchFilter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(searchFilter);
    const hasMore = skip + posts.length < total;

    return { posts, total, hasMore };
  }

  // Get recent posts
  static async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    const collection = await this.getCollection();
    return await collection
      .find({ published: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();
  }
}
