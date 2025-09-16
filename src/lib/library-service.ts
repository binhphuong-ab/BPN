import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { 
  Book, 
  BookFilter, 
  generateBookSlug, 
  extractBookSummary 
} from '@/models/book';

export class LibraryService {
  private static async getCollection() {
    const db = await getDatabase();
    return db.collection<Book>('books');
  }

  // Create a new book
  static async createBook(bookData: Omit<Book, '_id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const collection = await this.getCollection();
    
    const slug = generateBookSlug(bookData.title);
    const summary = bookData.summary || extractBookSummary(bookData.content || '');
    
    const book: Book = {
      ...bookData,
      slug,
      summary,
      createdAt: new Date(),
      updatedAt: new Date(),
      downloadCount: 0,
    };

    const result = await collection.insertOne(book);
    return { ...book, _id: result.insertedId };
  }

  // Update an existing book
  static async updateBook(id: string, updateData: Partial<Book>): Promise<Book | null> {
    const collection = await this.getCollection();
    
    const updates: Partial<Book> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Update slug if title changed
    if (updateData.title) {
      updates.slug = generateBookSlug(updateData.title);
    }

    // Update summary if content changed
    if (updateData.content && !updateData.summary) {
      updates.summary = extractBookSummary(updateData.content);
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result;
  }

  // Delete a book
  static async deleteBook(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Get a single book by ID
  static async getBookById(id: string): Promise<Book | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  // Get a single book by slug
  static async getBookBySlug(slug: string): Promise<Book | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ slug });
  }

  // Get all books with filtering and pagination
  static async getBooks(
    filter: BookFilter = {},
    page: number = 1,
    limit: number = 12
  ): Promise<{ books: Book[]; total: number; hasMore: boolean }> {
    const collection = await this.getCollection();
    const skip = (page - 1) * limit;

    // Build MongoDB filter
    const mongoFilter: Record<string, unknown> = {};

    if (filter.language) {
      mongoFilter.language = filter.language;
    }

    if (filter.type) {
      mongoFilter.type = filter.type;
    }

    if (filter.genreId) {
      mongoFilter.genreIds = { $in: [filter.genreId] };
    }

    if (filter.author) {
      mongoFilter.author = { $regex: filter.author, $options: 'i' };
    }

    if (filter.featured !== undefined) {
      mongoFilter.featured = filter.featured;
    }

    if (filter.search) {
      mongoFilter.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { author: { $regex: filter.search, $options: 'i' } },
        { content: { $regex: filter.search, $options: 'i' } },
        { summary: { $regex: filter.search, $options: 'i' } }
      ];
    }

    const books = await collection
      .find(mongoFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(mongoFilter);
    const hasMore = skip + books.length < total;

    return { books, total, hasMore };
  }

  // Get featured books
  static async getFeaturedBooks(limit: number = 6): Promise<Book[]> {
    const collection = await this.getCollection();
    return await collection
      .find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  // Get recently added books
  static async getRecentBooks(limit: number = 6): Promise<Book[]> {
    const collection = await this.getCollection();
    return await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  // Download an ebook (increment download count)
  static async downloadBook(bookId: string): Promise<Book | null> {
    const collection = await this.getCollection();
    
    const result = await collection.findOneAndUpdate(
      { 
        _id: new ObjectId(bookId),
        $or: [{ type: 'Ebook' }, { type: 'Both' }],
        downloads: { $exists: true, $not: { $size: 0 } }
      },
      { 
        $inc: { downloadCount: 1 },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );

    return result;
  }

  // Get simple library statistics
  static async getLibraryStats(): Promise<{
    totalBooks: number;
    totalEbooks: number;
    totalPaperBooks: number;
    totalDownloads: number;
    featuredBooks: Book[];
    recentlyAdded: Book[];
  }> {
    const collection = await this.getCollection();
    
    const [
      totalBooks,
      totalEbooks,
      totalPaperBooks,
      featuredBooks,
      recentlyAdded
    ] = await Promise.all([
      collection.countDocuments({}),
      collection.countDocuments({ $or: [{ type: 'Ebook' }, { type: 'Both' }] }),
      collection.countDocuments({ $or: [{ type: 'Paper' }, { type: 'Both' }] }),
      this.getFeaturedBooks(5),
      this.getRecentBooks(5),
    ]);

    const totalDownloads = await collection.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]).toArray();

    return {
      totalBooks,
      totalEbooks,
      totalPaperBooks,
      totalDownloads: totalDownloads[0]?.total || 0,
      featuredBooks,
      recentlyAdded,
    };
  }

  // Search books with full-text search
  static async searchBooks(
    query: string,
    page: number = 1,
    limit: number = 12
  ): Promise<{ books: Book[]; total: number; hasMore: boolean }> {
    return await this.getBooks({ search: query }, page, limit);
  }

  // Get books by genre
  static async getBooksByGenre(
    genreId: string | ObjectId,
    page: number = 1,
    limit: number = 12
  ): Promise<{ books: Book[]; total: number; hasMore: boolean }> {
    const genreObjectId = typeof genreId === 'string' ? new ObjectId(genreId) : genreId;
    return await this.getBooks({ genreId: genreObjectId }, page, limit);
  }

  // Get all unique genres
  static async getGenres(): Promise<string[]> {
    const collection = await this.getCollection();
    const genres = await collection.distinct('genre');
    return genres.filter((genre): genre is string => typeof genre === 'string' && genre.length > 0).sort();
  }

  // Get all unique authors
  static async getAuthors(): Promise<string[]> {
    const collection = await this.getCollection();
    const authors = await collection.distinct('author');
    return authors.filter((author): author is string => typeof author === 'string' && author.length > 0).sort();
  }
}