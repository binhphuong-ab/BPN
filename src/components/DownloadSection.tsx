'use client';

import { Book, BookDownload } from '@/models/book';

interface DownloadSectionProps {
  book: Book;
}

export default function DownloadSection({ book }: DownloadSectionProps) {
  if (!book.downloads || book.downloads.length === 0) {
    return null;
  }

  // Sort downloads by order
  const sortedDownloads = book.downloads.sort((a, b) => a.order - b.order);

  const handleDownload = async (download: BookDownload) => {
    try {
      // Track download
      await fetch(`/api/books/${book._id}/download`, {
        method: 'POST',
      });
      
      if (download.url) {
        // Open download in new tab to preserve current page
        window.open(download.url, '_blank');
      }
    } catch (error) {
      console.error('Error tracking download:', error);
      if (download.url) {
        window.open(download.url, '_blank');
      }
    }
  };

  // Helper function to get file format icon
  const getFormatIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('pdf')) return '📄';
    if (lowerName.includes('epub')) return '📖';
    if (lowerName.includes('mobi')) return '📱';
    if (lowerName.includes('doc') || lowerName.includes('word')) return '📝';
    if (lowerName.includes('txt')) return '📃';
    return '📁';
  };

  // Single download - show as primary button
  if (sortedDownloads.length === 1) {
    const download = sortedDownloads[0];
    return (
      <div className="pt-4 border-t">
        <button
          onClick={() => handleDownload(download)}
          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Download {download.name}
        </button>
        
        {book.downloadCount && book.downloadCount > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 mt-4 border">
            <p className="text-sm text-gray-700 text-center">
              📊 Downloaded {book.downloadCount} times
            </p>
          </div>
        )}
      </div>
    );
  }

  // Multiple downloads - show as cards
  return (
    <div className="pt-4 border-t space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Download Options</h4>
      
      <div className="space-y-3">
        {sortedDownloads.map((download) => (
          <div 
            key={download.id}
            className="bg-gray-50 rounded-lg p-4 border hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getFormatIcon(download.name)}</span>
                <div>
                  <h5 className="font-medium text-gray-900">{download.name}</h5>
                  <p className="text-sm text-gray-500">
                    {book.fileFormat || 'Digital format'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleDownload(download)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {book.downloadCount && book.downloadCount > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 mt-4 border">
          <p className="text-sm text-gray-700 text-center">
            📊 Total downloads: <span className="font-semibold">{book.downloadCount}</span>
          </p>
        </div>
      )}
    </div>
  );
}
