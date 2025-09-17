import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Books | Personal Library',
  description: 'Browse my personal collection of books on rationality, math, business and more. Filter by genres and subgenres to find books that match your interests.',
  keywords: ['books', 'library', 'rationality', 'math', 'business', 'reading', 'genres', 'subgenres'],
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
