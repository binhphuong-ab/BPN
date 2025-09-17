import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { BookGenre, SubGenre, BookGenreWithCount, BookGenreWithSubGenres } from '@/models/bookgenre';

export class BookGenreService {
  private static async getBookGenresCollection() {
    const db = await getDatabase();
    return db.collection<BookGenre>('bookgenres');
  }

  private static async getSubGenresCollection() {
    const db = await getDatabase();
    return db.collection<SubGenre>('subgenres');
  }

  // ===== BOOK GENRE METHODS =====

  // Create a new book genre
  static async createBookGenre(genreData: Omit<BookGenre, '_id' | 'createdAt' | 'updatedAt'>): Promise<BookGenre> {
    const collection = await this.getBookGenresCollection();
    
    const bookGenre: BookGenre = {
      ...genreData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(bookGenre);
    return { ...bookGenre, _id: result.insertedId };
  }

  // Update an existing book genre
  static async updateBookGenre(id: string, updateData: Partial<BookGenre>): Promise<BookGenre | null> {
    const collection = await this.getBookGenresCollection();
    
    const updates: Partial<BookGenre> = {
      ...updateData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result;
  }

  // Delete a book genre and all its subgenres
  static async deleteBookGenre(id: string): Promise<boolean> {
    const genresCollection = await this.getBookGenresCollection();
    const subGenresCollection = await this.getSubGenresCollection();

    // First delete all subgenres belonging to this genre
    await subGenresCollection.deleteMany({ genreId: new ObjectId(id) });
    
    // Then delete the genre
    const result = await genresCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Get all book genres with their subgenres count
  static async getAllBookGenres(): Promise<BookGenreWithCount[]> {
    const genresCollection = await this.getBookGenresCollection();
    const subGenresCollection = await this.getSubGenresCollection();

    const genres = await genresCollection.find({}).sort({ order: 1, createdAt: 1 }).toArray();
    
    // Get subgenres count for each genre
    const genresWithCount = await Promise.all(
      genres.map(async (genre) => {
        const subGenresCount = await subGenresCollection.countDocuments({ 
          genreId: genre._id
        });
        return { ...genre, subGenresCount };
      })
    );

    return genresWithCount;
  }

  // OPTIMIZED: Get all book genres with their actual subgenres in a single aggregation query
  static async getAllBookGenresWithSubGenres(featuredOnly: boolean = false): Promise<BookGenreWithSubGenres[]> {
    const genresCollection = await this.getBookGenresCollection();
    
    const matchStage = featuredOnly ? { featured: true } : {};
    
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'subgenres',
          localField: '_id',
          foreignField: 'genreId',
          as: 'subGenres',
          pipeline: [
            { $sort: { order: 1, name: 1 } }
          ]
        }
      },
      {
        $sort: { order: 1, createdAt: 1 }
      }
    ];

    const genresWithSubGenres = await genresCollection.aggregate(pipeline).toArray() as BookGenreWithSubGenres[];
    
    console.log(`🔍 Aggregation returned ${genresWithSubGenres.length} genres with embedded subgenres`);
    
    return genresWithSubGenres;
  }

  // Get featured book genres for public use
  static async getFeaturedBookGenres(): Promise<BookGenre[]> {
    const collection = await this.getBookGenresCollection();
    return await collection.find({ featured: true }).sort({ order: 1, name: 1 }).toArray();
  }

  // Get book genre by ID
  static async getBookGenreById(id: string): Promise<BookGenre | null> {
    const collection = await this.getBookGenresCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  // Get book genre by slug
  static async getBookGenreBySlug(slug: string): Promise<BookGenre | null> {
    const collection = await this.getBookGenresCollection();
    return await collection.findOne({ slug });
  }

  // Check if slug exists (for validation)
  static async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const collection = await this.getBookGenresCollection();
    const query: { slug: string; _id?: { $ne: ObjectId } } = { slug };
    
    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }
    
    const genre = await collection.findOne(query);
    return !!genre;
  }

  // ===== SUBGENRE METHODS =====

  // Create a new subgenre
  static async createSubGenre(subGenreData: Omit<SubGenre, '_id' | 'createdAt' | 'updatedAt'>): Promise<SubGenre> {
    const collection = await this.getSubGenresCollection();
    
    const subGenre: SubGenre = {
      ...subGenreData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(subGenre);
    return { ...subGenre, _id: result.insertedId };
  }

  // Update an existing subgenre
  static async updateSubGenre(id: string, updateData: Partial<SubGenre>): Promise<SubGenre | null> {
    const collection = await this.getSubGenresCollection();
    
    const updates: Partial<SubGenre> = {
      ...updateData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result;
  }

  // Delete a subgenre
  static async deleteSubGenre(id: string): Promise<boolean> {
    const collection = await this.getSubGenresCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Get all subgenres for a book genre
  static async getSubGenresByGenreId(genreId: string): Promise<SubGenre[]> {
    const collection = await this.getSubGenresCollection();
    return await collection.find({ genreId: new ObjectId(genreId) }).sort({ order: 1, name: 1 }).toArray();
  }

  // Get subgenre by ID
  static async getSubGenreById(id: string): Promise<SubGenre | null> {
    const collection = await this.getSubGenresCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  // Get subgenre by slug within a genre
  static async getSubGenreBySlug(genreSlug: string, subGenreSlug: string): Promise<SubGenre | null> {
    const genresCollection = await this.getBookGenresCollection();
    const subGenresCollection = await this.getSubGenresCollection();

    // First find the genre
    const genre = await genresCollection.findOne({ slug: genreSlug });
    if (!genre) return null;

    // Then find the subgenre
    return await subGenresCollection.findOne({ 
      genreId: genre._id,
      slug: subGenreSlug
    });
  }

  // Check if subgenre slug exists within a genre (for validation)
  static async isSubGenreSlugTaken(genreId: string, slug: string, excludeId?: string): Promise<boolean> {
    const collection = await this.getSubGenresCollection();
    const query: { genreId: ObjectId; slug: string; _id?: { $ne: ObjectId } } = { 
      genreId: new ObjectId(genreId),
      slug 
    };
    
    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }
    
    const subGenre = await collection.findOne(query);
    return !!subGenre;
  }

  // Update genre order
  static async updateBookGenreOrder(updates: { id: string; order: number }[]): Promise<void> {
    const collection = await this.getBookGenresCollection();
    
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

  // Update subgenre order
  static async updateSubGenreOrder(updates: { id: string; order: number }[]): Promise<void> {
    const collection = await this.getSubGenresCollection();
    
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
