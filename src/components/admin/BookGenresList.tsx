import React, { memo } from 'react';
import { BookGenreWithCount } from '@/models/bookgenre';

interface BookGenresListProps {
  bookGenres: BookGenreWithCount[];
  selectedBookGenre: BookGenreWithCount | null;
  onBookGenreSelect: (bookGenre: BookGenreWithCount) => void;
  onBookGenreEdit: (bookGenre: BookGenreWithCount) => void;
  onBookGenreDelete: (bookGenre: BookGenreWithCount) => void;
  onAddBookGenre: () => void;
  onRefresh?: () => void;
}

export default memo(function BookGenresList({
  bookGenres,
  selectedBookGenre,
  onBookGenreSelect,
  onBookGenreEdit,
  onBookGenreDelete,
  onAddBookGenre,
  onRefresh
}: BookGenresListProps) {
  // Safety check to ensure bookGenres is always an array
  const safeBookGenres = Array.isArray(bookGenres) ? bookGenres : [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Book Genres ({safeBookGenres.length})</h3>
        <div className="flex space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              title="Refresh book genres"
            >
              🔄 Refresh
            </button>
          )}
          <button
            onClick={onAddBookGenre}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Add Genre
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {safeBookGenres.map((bookGenre) => (
          <div
            key={bookGenre._id?.toString()}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedBookGenre?._id?.toString() === bookGenre._id?.toString()
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onBookGenreSelect(bookGenre)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span 
                  className="text-2xl p-2 rounded-lg"
                  style={{ backgroundColor: bookGenre.color + '20' }}
                >
                  {bookGenre.icon}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{bookGenre.name}</h4>
                    {bookGenre.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {bookGenre.subGenresCount} subgenre{bookGenre.subGenresCount !== 1 ? 's' : ''}
                    {bookGenre.bookCount !== undefined && (
                      <span> • {bookGenre.bookCount} book{bookGenre.bookCount !== 1 ? 's' : ''}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookGenreEdit(bookGenre);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit book genre"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookGenreDelete(bookGenre);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete book genre"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {safeBookGenres.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-500">No book genres yet</p>
            <button
              onClick={onAddBookGenre}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Create your first book genre
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
