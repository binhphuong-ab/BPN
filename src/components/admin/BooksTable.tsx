'use client';

import { Book, getPrimaryCoverImage } from '@/models/book';
import Image from 'next/image';
import Link from 'next/link';

interface BooksTableProps {
  books: Book[];
  selectedBooks: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectBook: (id: string, selected: boolean) => void;
  onToggleFeatured: (id: string) => void;
  onDeleteBook: (id: string) => void;
}

export default function BooksTable({
  books,
  selectedBooks,
  onSelectAll,
  onSelectBook,
  onToggleFeatured,
  onDeleteBook,
}: BooksTableProps) {
  const allSelected = books.length > 0 && selectedBooks.length === books.length;
  const someSelected = selectedBooks.length > 0 && selectedBooks.length < books.length;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Book
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Language
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Downloads
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book._id?.toString()} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(book._id?.toString() || '')}
                  onChange={(e) =>
                    onSelectBook(book._id?.toString() || '', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 relative">
                    {(() => {
                      const primaryImage = getPrimaryCoverImage(book);
                      return primaryImage ? (
                        <Image
                          className="h-12 w-12 rounded-lg object-cover"
                          src={primaryImage.url}
                          alt={primaryImage.alt || book.title}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      );
                    })()
                    }
                    {/* Image count indicator */}
                    {book.images && book.images.length > 1 && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {book.images.length}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {book.title}
                    </div>
                    {book.publisher && (
                      <div className="text-sm text-gray-500">{book.publisher}</div>
                    )}
                    {book.publishedYear && (
                      <div className="text-xs text-gray-400">{book.publishedYear}</div>
                    )}
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {book.author || '-'}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  book.type === 'Ebook' ? 'bg-green-100 text-green-800' :
                  book.type === 'Paper' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {book.type}
                </span>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                  book.language === 'Vietnamese' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {book.language === 'Vietnamese' ? '🇻🇳 VI' : '🇺🇸 EN'}
                </span>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {book.downloadCount || 0}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onToggleFeatured(book._id?.toString() || '')}
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                    book.featured
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {book.featured ? 'Featured' : 'Feature'}
                </button>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/admin/books/edit/${book._id}`}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDeleteBook(book._id?.toString() || '')}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}