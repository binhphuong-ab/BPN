import { LibraryService } from '@/lib/library-service';
import BookCard from '@/components/BookCard';
import Link from 'next/link';

export const metadata = {
  title: 'Books | Personal Library',
  description: 'Browse my personal collection of books on rationality, math, business and more',
  keywords: ['books', 'library', 'rationality', 'math', 'business', 'reading'],
};

export default async function BooksPage() {
  // Fetch books and stats
  const [booksResult, libraryStats, featuredBooks] = await Promise.all([
    LibraryService.getBooks({}, 1, 50), // Get more books for the main listing
    LibraryService.getLibraryStats(),
    LibraryService.getFeaturedBooks(6)
  ]);

  const { books } = booksResult;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Personal Library
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            My curated collection of books on rationality, mathematics, business, and critical thinking.
            Discover insightful reads and expand your knowledge.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{libraryStats.totalBooks}</div>
              <div className="text-sm text-gray-600">Total Books</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{libraryStats.totalEbooks}</div>
              <div className="text-sm text-gray-600">E-books</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">{libraryStats.totalPaperBooks}</div>
              <div className="text-sm text-gray-600">Paper Books</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-orange-600">{libraryStats.totalDownloads}</div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      {featuredBooks.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Books
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hand-picked recommendations from my personal collection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredBooks.map((book) => (
                <BookCard key={book._id?.toString()} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Books Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse All Books
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the complete collection organized by topics and interests
            </p>
          </div>

          {books.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <BookCard key={book._id?.toString()} book={book} />
                ))}
              </div>
              
              {/* Browse More */}
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-6">
                  Showing {books.length} of {libraryStats.totalBooks} books
                </p>
                {books.length >= 50 && (
                  <Link
                    href="/books/browse"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Browse All Books
                    <svg
                      className="ml-2 -mr-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books available yet</h3>
              <p className="text-gray-500">
                The library is being updated. Check back soon for new additions!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find books that match your interests and learning goals
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Rationality', icon: '🧠', color: 'bg-blue-100 text-blue-800' },
              { name: 'Mathematics', icon: '📊', color: 'bg-green-100 text-green-800' },
              { name: 'Business', icon: '💼', color: 'bg-purple-100 text-purple-800' },
              { name: 'Philosophy', icon: '🤔', color: 'bg-yellow-100 text-yellow-800' },
              { name: 'Science', icon: '🔬', color: 'bg-red-100 text-red-800' },
              { name: 'Technology', icon: '💻', color: 'bg-indigo-100 text-indigo-800' },
              { name: 'Psychology', icon: '🧭', color: 'bg-pink-100 text-pink-800' },
              { name: 'History', icon: '📜', color: 'bg-orange-100 text-orange-800' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/books?category=${encodeURIComponent(category.name)}`}
                className={`p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:scale-105 ${category.color} group`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium text-sm">{category.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}