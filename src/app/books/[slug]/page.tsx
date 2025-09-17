import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { LibraryService } from '@/lib/library-service';
import { BookGenreService } from '@/lib/bookgenre-service';
import { Book, isBookDownloadable, getPrimaryCoverImage, getPrimaryDownload } from '@/models/book';
import { BookGenre, SubGenre } from '@/models/bookgenre';
import { ReadingProgress } from '@/components/ReadingProgress';
import { MarkdownPreview } from '@/components/MDEditor';
import BookImageGallery from '@/components/BookImageGallery';
import BookCard from '@/components/BookCard';

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

  // Fetch genre data for SEO keywords
  let genreNames: string[] = [];
  let subGenreNames: string[] = [];
  
  if (book.genreIds?.length || book.subGenreIds?.length) {
    const genrePromises = (book.genreIds || []).map(id => 
      BookGenreService.getBookGenreById(id.toString())
    );
    const subGenrePromises = (book.subGenreIds || []).map(id => 
      BookGenreService.getSubGenreById(id.toString())
    );

    try {
      const [genres, subGenres] = await Promise.all([
        Promise.all(genrePromises),
        Promise.all(subGenrePromises)
      ]);
      
      genreNames = genres.filter(Boolean).map(g => g!.name);
      subGenreNames = subGenres.filter(Boolean).map(sg => sg!.name);
    } catch (error) {
      console.warn('Error fetching genre data for metadata:', error);
    }
  }

  return {
    title: `${book.title} | Personal Library`,
    description: book.summary || `Read "${book.title}" ${book.author ? `by ${book.author}` : ''} in my personal library`,
    keywords: [
      book.title,
      book.author || '',
      book.language,
      book.type,
      ...genreNames,
      ...subGenreNames,
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

// Download handler component - Extract to separate client component file later
function DownloadButton({ book }: { book: Book }) {
  const primaryDownload = getPrimaryDownload(book);
  
  const handleDownload = async () => {
    try {
      await fetch(`/api/books/${book._id}/download`, {
        method: 'POST',
      });
      
      if (primaryDownload?.url) {
        // Use location.href for better compatibility and avoid popup blockers
        window.location.href = primaryDownload.url;
      }
    } catch (error) {
      console.error('Error tracking download:', error);
      if (primaryDownload?.url) {
        window.location.href = primaryDownload.url;
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

  // Fetch genre and subgenre data
  const genrePromises = (book.genreIds || []).map(id => 
    BookGenreService.getBookGenreById(id.toString())
  );
  const subGenrePromises = (book.subGenreIds || []).map(id => 
    BookGenreService.getSubGenreById(id.toString())
  );

  const [genres, subGenres] = await Promise.all([
    Promise.all(genrePromises),
    Promise.all(subGenrePromises)
  ]);

  // Filter out null results
  const validGenres = genres.filter(Boolean) as BookGenre[];
  const validSubGenres = subGenres.filter(Boolean) as SubGenre[];

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
                {/* Interactive Image Gallery */}
                <BookImageGallery book={book} />

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
                {(validGenres.length > 0 || validSubGenres.length > 0) && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Display actual genres with their icons and colors */}
                      {validGenres.slice(0, 3).map((genre) => (
                        <span
                          key={genre._id?.toString()}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: `${genre.color}20`,
                            borderColor: genre.color,
                            color: genre.color
                          }}
                        >
                          <span className="mr-1.5">{genre.icon || '📚'}</span>
                          {genre.name}
                        </span>
                      ))}
                      {/* Display actual subgenres */}
                      {validSubGenres.slice(0, 2).map((subGenre) => (
                        <span
                          key={subGenre._id?.toString()}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200"
                        >
                          <span className="mr-1.5">{subGenre.icon || '📖'}</span>
                          {subGenre.name}
                        </span>
                      ))}
                    </div>
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
                  <MarkdownPreview 
                    content={book.content} 
                    className="prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic"
                  />
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