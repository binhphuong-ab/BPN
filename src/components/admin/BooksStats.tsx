'use client';

import { Book } from '@/models/book';

interface BooksStatsProps {
  books: Book[];
}

export default function BooksStats({ books }: BooksStatsProps) {
  const totalBooks = books.length;
  const ebooks = books.filter(book => book.type === 'Ebook' || book.type === 'Both').length;
  const paperBooks = books.filter(book => book.type === 'Paper' || book.type === 'Both').length;
  const featuredBooks = books.filter(book => book.featured).length;
  const englishBooks = books.filter(book => book.language === 'English').length;
  const vietnameseBooks = books.filter(book => book.language === 'Vietnamese').length;
  const totalDownloads = books.reduce((sum, book) => sum + (book.downloadCount || 0), 0);

  const stats = [
    {
      name: 'Total Books',
      value: totalBooks,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      name: 'E-Books',
      value: ebooks,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      name: 'Paper Books',
      value: paperBooks,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      name: 'Featured',
      value: featuredBooks,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'bg-yellow-500',
    },
    {
      name: 'English',
      value: englishBooks,
      icon: (
        <span className="text-lg">🇺🇸</span>
      ),
      color: 'bg-indigo-500',
    },
    {
      name: 'Vietnamese',
      value: vietnameseBooks,
      icon: (
        <span className="text-lg">🇻🇳</span>
      ),
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Library Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {totalDownloads > 0 && (
        <div className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-4 text-white">
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <div>
              <p className="text-sm opacity-90">Total Downloads</p>
              <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}