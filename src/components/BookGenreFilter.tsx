'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { BookGenreWithSubGenres } from '@/models/bookgenre';
import { Book } from '@/models/book';

interface BookGenreFilterProps {
  onBooksUpdate: (books: Book[]) => void;
}

interface FilterState {
  genres: BookGenreWithSubGenres[];
  loading: boolean;
  error: string | null;
  selectedGenreId: string | null;
  selectedSubGenreId: string | null;
}

function BookGenreFilter({ onBooksUpdate }: BookGenreFilterProps) {
  const [state, setState] = useState<FilterState>({
    genres: [],
    loading: true,
    error: null,
    selectedGenreId: null,
    selectedSubGenreId: null,
  });

  // Extract state values for cleaner code
  const { genres, loading, error, selectedGenreId, selectedSubGenreId } = state;

  // OPTIMIZED: Fetch all genres with subgenres in a single API call
  useEffect(() => {
    const abortController = new AbortController();

    const fetchGenres = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const startTime = Date.now();
        
        // Use the new optimized endpoint that fetches everything in one query
        const response = await fetch('/api/bookgenres/with-subgenres', {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const fetchTime = Date.now() - startTime;
        
        console.log(`⚡ Optimized genres loaded in ${fetchTime}ms (API: ${data.queryTime || 'N/A'}ms)`);
        console.log(`📊 Loaded ${data.genres?.length || 0} genres with subgenres`);
        
        // Validate response structure
        if (!data.genres || !Array.isArray(data.genres)) {
          throw new Error('Invalid response format: expected genres array');
        }
        
        setState(prev => ({
          ...prev,
          genres: data.genres,
          loading: false,
          error: null
        }));
        
      } catch (error: unknown) {
        // Don't show error for aborted requests (component unmount)
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('🔄 Genre fetch aborted');
          return;
        }
        
        console.error('❌ Error fetching genres:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to load book genres';
        setState(prev => ({
          ...prev,
          genres: [],
          loading: false,
          error: errorMessage
        }));
      }
    };

    fetchGenres();

    // Cleanup: abort request if component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  // OPTIMIZED: Fetch books with proper error handling and request cancellation
  const fetchFilteredBooks = useCallback(async (genreId?: string, subGenreId?: string) => {
    const abortController = new AbortController();
    
    try {
      const startTime = Date.now();
      
      // Build query parameters
      const params = new URLSearchParams();
      if (subGenreId) {
        params.append('subGenre', subGenreId);
      } else if (genreId) {
        params.append('genre', genreId);
      }
      params.append('limit', '50');
      
      const endpoint = `/api/books${params.toString() ? '?' + params.toString() : '?limit=50'}`;
      
      console.log(`🔍 Fetching books: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        signal: abortController.signal,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch books: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const fetchTime = Date.now() - startTime;
      
      console.log(`⚡ Books loaded in ${fetchTime}ms (API: ${data.queryTime || 'N/A'}ms), found ${data.books?.length || 0} books`);
      
      // Validate response
      if (!data.books || !Array.isArray(data.books)) {
        console.warn('⚠️ Invalid books response format, defaulting to empty array');
        onBooksUpdate([]);
        return;
      }
      
      onBooksUpdate(data.books);
      
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🔄 Book fetch aborted');
        return;
      }
      
      console.error('❌ Error fetching filtered books:', error);
      
      // Don't leave users hanging - show empty state instead of keeping old data
      onBooksUpdate([]);
    }
  }, [onBooksUpdate]);

  // IMPROVED: Handle genre selection with better state management
  const handleGenreSelect = useCallback((genreId: string) => {
    if (!genreId) return;
    
    setState(prev => {
      const isCurrentlySelected = prev.selectedGenreId === genreId;
      
      if (isCurrentlySelected) {
        // Deselect current genre
        return {
          ...prev,
          selectedGenreId: null,
          selectedSubGenreId: null,
        };
      } else {
        // Select new genre and clear subgenre
        return {
          ...prev,
          selectedGenreId: genreId,
          selectedSubGenreId: null,
        };
      }
    });
    
    // Fetch books after state update
    const isCurrentlySelected = selectedGenreId === genreId;
    if (isCurrentlySelected) {
      fetchFilteredBooks(); // Fetch all books
    } else {
      fetchFilteredBooks(genreId); // Fetch genre-filtered books
    }
  }, [selectedGenreId, fetchFilteredBooks]);

  // IMPROVED: Handle subgenre selection
  const handleSubGenreSelect = useCallback((genreId: string, subGenreId: string) => {
    if (!genreId || !subGenreId) return;
    
    setState(prev => {
      const isCurrentlySelected = prev.selectedSubGenreId === subGenreId;
      
      if (isCurrentlySelected) {
        // Deselect current subgenre - keep genre selected but clear subgenre
        return {
          ...prev,
          selectedGenreId: genreId,
          selectedSubGenreId: null,
        };
      } else {
        // Select new subgenre
        return {
          ...prev,
          selectedGenreId: genreId,
          selectedSubGenreId: subGenreId,
        };
      }
    });
    
    // Fetch books after state update
    const isCurrentlySelected = selectedSubGenreId === subGenreId;
    if (isCurrentlySelected) {
      fetchFilteredBooks(genreId); // Fetch genre-filtered books (deselect subgenre)
    } else {
      fetchFilteredBooks(genreId, subGenreId); // Fetch subgenre-filtered books
    }
  }, [selectedSubGenreId, fetchFilteredBooks]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedGenreId: null,
      selectedSubGenreId: null,
    }));
    
    fetchFilteredBooks(); // Fetch all books
  }, [fetchFilteredBooks]);

  // Retry mechanism for failed requests
  const handleRetry = useCallback(() => {
    window.location.reload(); // Simple retry by reloading component
  }, []);

  // ENHANCED: Error state with retry option
  if (error) {
    return (
      <section className="py-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Failed to Load Genres
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ENHANCED: Loading state with skeleton
  if (loading) {
    return (
      <section className="py-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-3 animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
          
          {/* Loading Genre Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                  <div className="flex gap-1">
                    <div className="h-6 bg-gray-100 rounded w-16"></div>
                    <div className="h-6 bg-gray-100 rounded w-20"></div>
                    <div className="h-6 bg-gray-100 rounded w-14"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore by Genre</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover books across different genres and find your next great read
          </p>
        </div>

        {/* Genre Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {genres.map((genre) => (
            <div 
              key={genre._id?.toString()} 
              className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                selectedGenreId === genre._id?.toString()
                  ? 'ring-4 ring-blue-500 ring-opacity-60 shadow-xl'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Card Background with Gradient */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{ 
                  background: `linear-gradient(135deg, ${genre.color || '#3B82F6'}, ${genre.color || '#3B82F6'}99)` 
                }}
              />
              
              {/* Card Content */}
              <div className="relative bg-white bg-opacity-95 backdrop-blur-sm p-6 h-full">
                {/* Genre Header - Clickable */}
                <div 
                  className="flex items-center mb-4 cursor-pointer"
                  onClick={() => handleGenreSelect(genre._id?.toString() || '')}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg mr-4"
                    style={{ backgroundColor: genre.color || '#3B82F6' }}
                  >
                    {genre.icon || genre.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{genre.name}</h3>
                    <p className="text-sm text-gray-500">
                      {genre.subGenres?.length || 0} {genre.subGenres?.length === 1 ? 'category' : 'categories'}
                    </p>
                  </div>
                  
                  {/* Selection Indicator */}
                  {selectedGenreId === genre._id?.toString() && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ml-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Subgenres - Always Visible and Clickable */}
                {genre.subGenres && genre.subGenres.length > 0 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {genre.subGenres.map((subGenre) => (
                        <button
                          key={subGenre._id?.toString()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubGenreSelect(genre._id?.toString() || '', subGenre._id?.toString() || '');
                          }}
                          className={`p-2 text-left rounded-lg transition-all duration-200 text-sm ${
                            selectedSubGenreId === subGenre._id?.toString()
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            {subGenre.icon && (
                              <span className="text-xs mr-1">{subGenre.icon}</span>
                            )}
                            <span className="font-medium truncate">{subGenre.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {genres.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No genres available</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Book genres will appear here once they are added to the system. Check back later for exciting reading categories!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(BookGenreFilter);