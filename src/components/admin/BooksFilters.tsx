'use client';

interface BookFilters {
  search: string;
  language: 'all' | 'English' | 'Vietnamese';
  type: 'all' | 'Paper' | 'Ebook' | 'Both';
}

interface BooksFiltersProps {
  filters: BookFilters;
  onFiltersChange: (filters: Partial<BookFilters>) => void;
  booksCount: number;
  filteredCount: number;
}

export default function BooksFilters({
  filters,
  onFiltersChange,
  booksCount,
  filteredCount,
}: BooksFiltersProps) {
  return (
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <label htmlFor="search" className="sr-only">
              Search books
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search books, authors..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
              />
              {filters.search && (
                <button
                  onClick={() => onFiltersChange({ search: '' })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Language Filter */}
          <div className="min-w-0 flex-shrink-0">
            <label htmlFor="language" className="sr-only">
              Filter by language
            </label>
            <select
              name="language"
              id="language"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md text-sm"
              value={filters.language}
              onChange={(e) =>
                onFiltersChange({
                  language: e.target.value as 'all' | 'English' | 'Vietnamese',
                })
              }
            >
              <option value="all">All Languages</option>
              <option value="English">🇺🇸 English</option>
              <option value="Vietnamese">🇻🇳 Vietnamese</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="min-w-0 flex-shrink-0">
            <label htmlFor="type" className="sr-only">
              Filter by type
            </label>
            <select
              name="type"
              id="type"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md text-sm"
              value={filters.type}
              onChange={(e) =>
                onFiltersChange({
                  type: e.target.value as 'all' | 'Paper' | 'Ebook' | 'Both',
                })
              }
            >
              <option value="all">All Types</option>
              <option value="Paper">📚 Paper</option>
              <option value="Ebook">💻 Ebook</option>
              <option value="Both">📚💻 Both</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500 whitespace-nowrap">
          {filteredCount === booksCount ? (
            <span>
              Showing <strong>{booksCount}</strong> books
            </span>
          ) : (
            <span>
              Showing <strong>{filteredCount}</strong> of{' '}
              <strong>{booksCount}</strong> books
            </span>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(filters.search || filters.language !== 'all' || filters.type !== 'all') && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          
          {filters.search && (
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: &ldquo;{filters.search}&rdquo;
              <button
                onClick={() => onFiltersChange({ search: '' })}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
              >
                <span className="sr-only">Remove search filter</span>
                <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" d="m1 1 6 6m0-6-6 6" />
                </svg>
              </button>
            </span>
          )}
          
          {filters.language !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Language: {filters.language === 'Vietnamese' ? '🇻🇳 Vietnamese' : '🇺🇸 English'}
              <button
                onClick={() => onFiltersChange({ language: 'all' })}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600"
              >
                <span className="sr-only">Remove language filter</span>
                <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" d="m1 1 6 6m0-6-6 6" />
                </svg>
              </button>
            </span>
          )}
          
          {filters.type !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Type: {filters.type}
              <button
                onClick={() => onFiltersChange({ type: 'all' })}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600"
              >
                <span className="sr-only">Remove type filter</span>
                <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" d="m1 1 6 6m0-6-6 6" />
                </svg>
              </button>
            </span>
          )}
          
          <button
            onClick={() =>
              onFiltersChange({
                search: '',
                language: 'all',
                type: 'all',
              })
            }
            className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:text-gray-800 underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}