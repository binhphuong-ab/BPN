import React from 'react';
import { SubGenre } from '@/models/bookgenre';

interface SubGenresListProps {
  subGenres: SubGenre[];
  genreName?: string;
  onSubGenreEdit: (subGenre: SubGenre) => void;
  onSubGenreDelete: (subGenre: SubGenre) => void;
  onAddSubGenre: () => void;
  hasSelectedGenre: boolean;
  isLoading?: boolean;
}

export default function SubGenresList({
  subGenres,
  genreName,
  onSubGenreEdit,
  onSubGenreDelete,
  onAddSubGenre,
  hasSelectedGenre,
  isLoading = false
}: SubGenresListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Subgenres {hasSelectedGenre && `(${subGenres.length})`}
        </h3>
        {hasSelectedGenre && (
          <button
            onClick={onAddSubGenre}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Add Subgenre
          </button>
        )}
      </div>

      {hasSelectedGenre ? (
        isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {subGenres.map((subGenre) => (
            <div
              key={subGenre._id?.toString()}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{subGenre.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{subGenre.name}</h4>
                    <p className="text-sm text-gray-500">
                      Order: {subGenre.order}
                      {subGenre.bookCount !== undefined && (
                        <span> • {subGenre.bookCount} book{subGenre.bookCount !== 1 ? 's' : ''}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onSubGenreEdit(subGenre)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Edit subgenre"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onSubGenreDelete(subGenre)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete subgenre"
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

          {subGenres.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No subgenres for &quot;{genreName}&quot;</p>
              <button
                onClick={onAddSubGenre}
                className="mt-2 text-green-600 hover:text-green-800 text-sm"
              >
                Add first subgenre
              </button>
            </div>
          )}
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-gray-500">Select a book genre to view its subgenres</p>
        </div>
      )}
    </div>
  );
}
