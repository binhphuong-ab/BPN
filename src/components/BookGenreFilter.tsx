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
    
    setState(prev => ({
      ...prev,
      selectedGenreId: genreId,
      selectedSubGenreId: subGenreId,
    }));
    
    fetchFilteredBooks(genreId, subGenreId);
  }, [fetchFilteredBooks]);

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
      <section className="py-8 bg-white border-b border-gray-200 min-h-[200px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[120px] text-center">
            <div className="mx-auto h-12 w-12 text-red-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to Load Genres
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section className="py-8 bg-white border-b border-gray-200 min-h-[200px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-64 animate-pulse"></div>
            </div>
          </div>
          
          <div className="min-h-[120px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-gray-50 rounded-md border border-gray-200 animate-pulse">
                  <div className="w-full px-2.5 py-2 rounded-md">
                    <div className="flex flex-col items-center text-center space-y-1">
                      <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                      <div className="min-w-0 w-full">
                        <div className="h-3 bg-gray-300 rounded mb-1 w-3/4 mx-auto"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white border-b border-gray-200 min-h-[200px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Filter by Genre</h2>
            <p className="text-sm text-gray-600">
              Select a genre or subgenre to narrow your search
            </p>
          </div>
          
          {/* Clear filters button */}
          {(selectedGenreId || selectedSubGenreId) && (
            <button
              onClick={clearFilters}
              className="mt-3 sm:mt-0 inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="min-h-[120px]">
          {/* Ultra Compact Genres Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {genres.map((genre) => (
              <div key={genre._id?.toString()} className="bg-gray-50 rounded-md border border-gray-200">
                {/* Ultra Compact Genre Button */}
                <button
                  onClick={() => handleGenreSelect(genre._id?.toString() || '')}
                  className={`w-full text-left px-2.5 py-2 rounded-md transition-all duration-200 ${
                    selectedGenreId === genre._id?.toString()
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-1">
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: genre.color || '#3B82F6' }}
                    >
                      {genre.icon || genre.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 text-xs truncate leading-tight">{genre.name}</div>
                      <div className="text-xs text-gray-500 leading-tight">
                        {genre.subGenres?.length || 0}
                      </div>
                    </div>
                    {selectedGenreId === genre._id?.toString() && (
                      <svg 
                        className="w-3 h-3 text-blue-500"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Fixed Height Subgenre Area */}
          <div className="mt-3 h-8 flex items-center">
            {selectedGenreId && (
              <div className="flex flex-wrap gap-2 w-full">
                {genres
                  .find(g => g._id?.toString() === selectedGenreId)
                  ?.subGenres?.map((subGenre) => (
                    <button
                      key={subGenre._id?.toString()}
                      onClick={() => handleSubGenreSelect(
                        selectedGenreId, 
                        subGenre._id?.toString() || ''
                      )}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedSubGenreId === subGenre._id?.toString()
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {subGenre.icon && (
                        <span className="mr-1 text-xs">{subGenre.icon}</span>
                      )}
                      <span>{subGenre.name}</span>
                    </button>
                  )) || []}
              </div>
            )}
          </div>

          {/* Enhanced Empty state */}
          {genres.length === 0 && !loading && !error && (
            <div className="flex flex-col items-center justify-center min-h-[120px] text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No genres available</h3>
              <p className="text-sm text-gray-500">
                Genres will appear here once added to the system.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(BookGenreFilter);