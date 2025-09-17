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
    <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Filter Books</h2>
              <p className="text-sm text-gray-600">Find and organize your library</p>
            </div>
          </div>
          
          {/* Results Counter */}
          <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
            {filteredCount === booksCount ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{booksCount}</div>
                <div className="text-xs text-gray-500">Total Books</div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredCount}</div>
                <div className="text-xs text-gray-500">of {booksCount} books</div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-4 gap-4 mb-3">
          {/* Enhanced Search - Takes up 2 columns (1/2) */}
          <div className="col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                placeholder="Search by title, author, or ISBN..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
              />
              {filters.search && (
                <button
                  onClick={() => onFiltersChange({ search: '' })}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Language Filter - Takes up 1 column (1/4) */}
          <div className="col-span-1">
            <div className="relative">
              <select
                name="language"
                id="language"
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-sm cursor-pointer"
                value={filters.language}
                onChange={(e) =>
                  onFiltersChange({
                    language: e.target.value as 'all' | 'English' | 'Vietnamese',
                  })
                }
              >
                <option value="all">🌍 All Languages</option>
                <option value="English">🇺🇸 English</option>
                <option value="Vietnamese">🇻🇳 Vietnamese</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Format Filter - Takes up 1 column (1/4) */}
          <div className="col-span-1">
            <div className="relative">
              <select
                name="type"
                id="type"
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-sm cursor-pointer"
                value={filters.type}
                onChange={(e) =>
                  onFiltersChange({
                    type: e.target.value as 'all' | 'Paper' | 'Ebook' | 'Both',
                  })
                }
              >
                <option value="all">📋 All Formats</option>
                <option value="Paper">📚 Paper Book</option>
                <option value="Ebook">💻 Digital Book</option>
                <option value="Both">📚💻 Both Formats</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Section */}
        {(filters.search || filters.language !== 'all' || filters.type !== 'all') && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a1 1 0 01-1-1V3a1 1 0 011-1z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Active Filters</span>
              </div>
              
              <button
                onClick={() =>
                  onFiltersChange({
                    search: '',
                    language: 'all',
                    type: 'all',
                  })
                }
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="font-medium">Search:</span>
                  <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded text-xs font-medium">
                    &ldquo;{filters.search}&rdquo;
                  </span>
                  <button
                    onClick={() => onFiltersChange({ search: '' })}
                    className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" d="m1 1 6 6m0-6-6 6" />
                    </svg>
                  </button>
                </div>
              )}
              
              {filters.language !== 'all' && (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="font-medium">Language:</span>
                  <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded text-xs font-medium">
                    {filters.language === 'Vietnamese' ? '🇻🇳 Vietnamese' : '🇺🇸 English'}
                  </span>
                  <button
                    onClick={() => onFiltersChange({ language: 'all' })}
                    className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" d="m1 1 6 6m0-6-6 6" />
                    </svg>
                  </button>
                </div>
              )}
              
              {filters.type !== 'all' && (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="font-medium">Format:</span>
                  <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded text-xs font-medium">
                    {filters.type === 'Paper' ? '📚 Paper' : filters.type === 'Ebook' ? '💻 Digital' : '📚💻 Both'}
                  </span>
                  <button
                    onClick={() => onFiltersChange({ type: 'all' })}
                    className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" d="m1 1 6 6m0-6-6 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}