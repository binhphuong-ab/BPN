import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { LibraryService } from '@/lib/library-service';
import { Book, isBookDownloadable, getPrimaryCoverImage, getGalleryImages, getPrimaryDownload } from '@/models/book';
import { ReadingProgress } from '@/components/ReadingProgress';
import BookCard from '@/components/BookCard';

// Dynamic import for markdown preview
const Markdown = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface BookPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const book = await LibraryService.getBookBySlug(params.slug);

  if (!book) {
    return {
      title: 'Book Not Found',
    };
  }

  return {
    title: `${book.title} | Personal Library`,
    description: book.summary || `Read "${book.title}" ${book.author ? `by ${book.author}` : ''} in my personal library`,
    keywords: [
      book.title,
      book.author || '',
      ...(book.genre || []),
      book.language,
      book.type,
    ].filter(Boolean),
    authors: book.author ? [{ name: book.author }] : undefined,
    openGraph: {
      title: book.title,
      description: book.summary || `Read "${book.title}" in my personal library`,
      type: 'article',
      images: (() => {
        const primaryImage = getPrimaryCoverImage(book);
        return primaryImage ? [{ url: primaryImage.url, alt: primaryImage.alt || book.title }] : undefined;
      })(),
    },
  };
}

// Download handler component
function DownloadButton({ book }: { book: Book }) {
  const primaryDownload = getPrimaryDownload(book);
  
  const handleDownload = async () => {
    try {
      await fetch(`/api/books/${book._id}/download`, {
        method: 'POST',
      });
      
      if (primaryDownload?.url) {
        window.open(primaryDownload.url, '_blank');
      }
    } catch (error) {
      console.error('Error tracking download:', error);
      if (primaryDownload?.url) {
        window.open(primaryDownload.url, '_blank');
      }
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
      Download {book.fileFormat || 'File'}
    </button>
  );
}

export default async function BookPage({ params }: BookPageProps) {
  const book = await LibraryService.getBookBySlug(params.slug);

  if (!book) {
    notFound();
  }

  const canDownload = isBookDownloadable(book);
  const relatedBooks = await LibraryService.getRecentBooks(4);
  const filteredRelatedBooks = relatedBooks.filter(b => b._id?.toString() !== book._id?.toString());

  return (
    <div className="min-h-screen bg-gray-50">
      <ReadingProgress />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/books" className="text-gray-500 hover:text-gray-700">
                  Books
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 font-medium line-clamp-1" title={book.title}>
                  {book.title}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Book Details */}
      <article className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Book Cover & Info */}
            <div className="lg:col-span-1 mb-8 lg:mb-0">
              <div className="sticky top-8">
                {/* Cover Image */}
                <div className="aspect-[3/4] relative mb-6 rounded-xl overflow-hidden shadow-lg">
                  {(() => {
                    const primaryImage = getPrimaryCoverImage(book);
                    return primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt || book.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    );
                  })()}
                  
                  {/* Featured Badge */}
                  {book.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </span>
                    </div>
                  )}
                  
                  {/* Image Count Badge */}
                  {book.images && book.images.length > 1 && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-900 bg-opacity-75 text-white">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {book.images.length}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Image Gallery */}
                {(() => {
                  const galleryImages = getGalleryImages(book);
                  return galleryImages.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">More Images</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {galleryImages.slice(0, 6).map((image) => (
                          <div key={image.id} className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity" title={image.alt}>
                            <Image
                              src={image.url}
                              alt={image.alt || `${book.title} - Image ${image.order + 1}`}
                              fill
                              className="object-cover"
                              sizes="120px"
                            />
                          </div>
                        ))}
                        {galleryImages.length > 6 && (
                          <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                            +{galleryImages.length - 6} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Quick Info */}
                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Language</span>
                      <span className={`inline-flex items-center gap-1 font-medium ${
                        book.language === 'Vietnamese' ? 'text-red-700' : 'text-blue-700'
                      }`}>
                        {book.language === 'Vietnamese' ? '🇻🇳 Vietnamese' : '🇺🇸 English'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Type</span>
                      <span className="font-medium text-gray-900">
                        {book.type === 'Ebook' ? '💻 E-book' : 
                         book.type === 'Paper' ? '📚 Paper' : 
                         '📚💻 Both'}
                      </span>
                    </div>
                    {book.pages && (
                      <div>
                        <span className="text-gray-500 block">Pages</span>
                        <span className="font-medium text-gray-900">{book.pages}</span>
                      </div>
                    )}
                    {book.publishedYear && (
                      <div>
                        <span className="text-gray-500 block">Published</span>
                        <span className="font-medium text-gray-900">{book.publishedYear}</span>
                      </div>
                    )}
                  </div>

                  {/* Download Button */}
                  {canDownload && (
                    <div className="pt-4 border-t">
                      <DownloadButton book={book} />
                      {book.downloadCount && book.downloadCount > 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                          Downloaded {book.downloadCount} times
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title and Author */}
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {book.title}
                </h1>
                
                {book.author && (
                  <p className="text-xl text-gray-600 mb-4">
                    by <span className="font-semibold">{book.author}</span>
                  </p>
                )}
                
                {book.publisher && (
                  <p className="text-lg text-gray-500">
                    Published by {book.publisher}
                  </p>
                )}

                {/* Genres */}
                {book.genre && book.genre.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {book.genre.map((genre, index) => (
                      <Link
                        key={index}
                        href={`/books?genre=${encodeURIComponent(genre)}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                )}
              </header>

              {/* Summary */}
              {book.summary && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
                  <h2 className="text-lg font-semibold text-blue-900 mb-3">Summary</h2>
                  <p className="text-blue-800 leading-relaxed">
                    {book.summary}
                  </p>
                </div>
              )}

              {/* Main Content */}
              {book.content && (
                <div className="bg-white rounded-xl shadow-sm border p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Book</h2>
                  <div className="prose prose-lg prose-blue max-w-none">
                    <Markdown source={book.content} />
                  </div>
                </div>
              )}

              {/* Book Details */}
              {(book.fileFormat || book.pages || (book.downloads && book.downloads.length > 0)) && (
                <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {book.fileFormat && (
                      <div>
                        <dt className="font-medium text-gray-500">File Format</dt>
                        <dd className="text-gray-900">{book.fileFormat}</dd>
                      </div>
                    )}
                    {book.pages && (
                      <div>
                        <dt className="font-medium text-gray-500">Number of Pages</dt>
                        <dd className="text-gray-900">{book.pages}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-medium text-gray-500">Added to Library</dt>
                      <dd className="text-gray-900">
                        {new Date(book.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Last Updated</dt>
                      <dd className="text-gray-900">
                        {new Date(book.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Books */}
      {filteredRelatedBooks.length > 0 && (
        <section className="py-16 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                More Books from the Library
              </h2>
              <p className="text-lg text-gray-600">
                Discover other books in the collection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRelatedBooks.slice(0, 3).map((relatedBook) => (
                <BookCard key={relatedBook._id?.toString()} book={relatedBook} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/books"
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
            </div>
          </div>
        </section>
      )}
    </div>
  );
}