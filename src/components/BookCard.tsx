import Link from 'next/link';
import Image from 'next/image';
import { Book, isBookDownloadable, getPrimaryCoverImage } from '@/models/book';

interface BookCardProps {
  book: Book;
  className?: string;
}

export default function BookCard({ book, className = '' }: BookCardProps) {
  const canDownload = isBookDownloadable(book);

  return (
    <article 
      className={`group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${className}`}
      role="article"
      aria-labelledby={`book-title-${book.slug}`}
    >
      {/* Book Cover */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <Link href={`/books/${book.slug}`}>
          {(() => {
            const primaryImage = getPrimaryCoverImage(book);
            return primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || book.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            );
          })()
        }
        </Link>
        
        {/* Multiple Images Indicator */}
        {book.images && book.images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-xs font-medium">
            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {book.images.length}
          </div>
        )}
        
        {/* Featured Badge */}
        {book.featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold ${
            book.type === 'Ebook' ? 'bg-green-100 text-green-800 border border-green-200' :
            book.type === 'Paper' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
            'bg-purple-100 text-purple-800 border border-purple-200'
          }`}>
            {book.type === 'Ebook' ? '💻' : book.type === 'Paper' ? '📚' : '📚💻'} {book.type}
          </span>
        </div>
        
        {/* Download indicator */}
        {canDownload && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-green-500 text-white p-2 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        {/* Language and Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${
              book.language === 'Vietnamese' 
                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}>
              {book.language === 'Vietnamese' ? '🇻🇳 VI' : '🇺🇸 EN'}
            </span>
          </div>
          
          {book.publishedYear && (
            <span className="text-sm text-gray-500 font-medium">
              {book.publishedYear}
            </span>
          )}
        </div>

        {/* Title Section */}
        <Link href={`/books/${book.slug}`} className="block group/title focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md">
          <h2 
            id={`book-title-${book.slug}`}
            className="text-xl font-bold text-gray-900 leading-tight group-hover/title:text-blue-600 transition-colors duration-200 cursor-pointer line-clamp-2"
          >
            {book.title}
          </h2>
        </Link>

        {/* Author */}
        {book.author && (
          <p className="text-gray-600 font-medium">
            by {book.author}
          </p>
        )}

        {/* Publisher */}
        {book.publisher && (
          <p className="text-sm text-gray-500">
            {book.publisher}
          </p>
        )}

        {/* Summary */}
        {book.summary && (
          <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm">
            {book.summary}
          </p>
        )}

        {/* Genres - TODO: Implement genre display with new genreIds/subGenreIds structure */}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {book.pages && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {book.pages} pages
              </span>
            )}
            
            {book.downloadCount && book.downloadCount > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                {book.downloadCount} downloads
              </span>
            )}
          </div>

          {/* File Format */}
          {book.fileFormat && (
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              {book.fileFormat}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}