'use client';

import { useState, useEffect, useCallback } from 'react';
import BookCard from '@/components/BookCard';
import BookGenreFilter from '@/components/BookGenreFilter';
import Link from 'next/link';
import { Book } from '@/models/book';

interface LibraryStats {
  totalBooks: number;
  totalEbooks: number;
  totalPaperBooks: number;
  totalDownloads: number;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]); // Keep original books for reference
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [libraryStats, setLibraryStats] = useState<LibraryStats>({
    totalBooks: 0,
    totalEbooks: 0,
    totalPaperBooks: 0,
    totalDownloads: 0,
  });
  const [loading, setLoading] = useState(true);


  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch all initial data - OPTIMIZED with performance logging
        const startTime = Date.now();
        const [booksResponse, statsResponse, featuredResponse] = await Promise.all([
          fetch('/api/books?limit=50'),
          fetch('/api/library/stats'),
          fetch('/api/books?featured=true&limit=6')
        ]);

        if (booksResponse.ok) {
          const booksData = await booksResponse.json();
          setBooks(booksData.books);
          setAllBooks(booksData.books);
          
          const loadTime = Date.now() - startTime;
          console.log(`⚡ Initial books loaded in ${loadTime}ms (API: ${booksData.queryTime || 'N/A'}ms)`);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setLibraryStats(statsData);
        }

        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          setFeaturedBooks(featuredData.books);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle books update from genre filter
  const handleBooksUpdate = useCallback((filteredBooks: Book[]) => {
    // Always set the books to what the filter returned
    // If empty, show empty state - don't fallback to all books
    setBooks(filteredBooks);
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading library...
          </div>
        </div>
      </div>
    );
  }

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

      {/* Genre Filter Section */}
      <BookGenreFilter 
        onBooksUpdate={handleBooksUpdate}
      />

      {/* All Books Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Books
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore books from the collection, or use the filters above to narrow your search
            </p>
          </div>

          {books.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <BookCard key={book._id?.toString()} book={book} />
                ))}
              </div>
              
              {/* Results Summary */}
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-6">
                  Showing {books.length} book{books.length !== 1 ? 's' : ''}
                  {books.length !== allBooks.length && allBooks.length > 0 && (
                    <span> (filtered from {libraryStats.totalBooks} total)</span>
                  )}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {allBooks.length > 0 ? 'No books match your filters' : 'No books available yet'}
              </h3>
              <p className="text-gray-500">
                {allBooks.length > 0 
                  ? 'Try selecting different genres or subgenres to find books.'
                  : 'The library is being updated. Check back soon for new additions!'
                }
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}