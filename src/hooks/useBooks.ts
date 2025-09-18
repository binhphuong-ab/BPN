import { useState, useEffect, useCallback } from 'react';
import { Book } from '@/models/book';
import { useToast } from '@/contexts/ToastContext';

interface BookFilters {
  search: string;
  language: 'all' | 'English' | 'Vietnamese';
  type: 'all' | 'Paper' | 'Ebook' | 'Both';
}

export function useBooks() {
  const { showSuccess, showError } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [filters, setFilters] = useState<BookFilters>({
    search: '',
    language: 'all',
    type: 'all',
  });

  // Fetch books
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter books based on current filters
  const applyFilters = useCallback(() => {
    let filtered = books;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower) ||
        book.summary?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.language !== 'all') {
      filtered = filtered.filter(book => book.language === filters.language);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(book => book.type === filters.type);
    }

    setFilteredBooks(filtered);
  }, [books, filters]);

  // Update filters
  const updateFilters = (newFilters: Partial<BookFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Delete book
  const deleteBook = async (id: string) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
        },
      });

      if (response.ok) {
        setBooks(prev => prev.filter(book => book._id?.toString() !== id));
        setSelectedBooks(prev => prev.filter(bookId => bookId !== id));
        showSuccess('Book deleted successfully');
      } else {
        throw new Error('Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      showError('Failed to delete book');
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string) => {
    try {
      const book = books.find(b => b._id?.toString() === id);
      if (!book) return;

      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
        },
        body: JSON.stringify({ featured: !book.featured }),
      });

      if (response.ok) {
        const updatedBook = await response.json();
        setBooks(prev =>
          prev.map(b => (b._id?.toString() === id ? updatedBook : b))
        );
        showSuccess(`Book ${updatedBook.featured ? 'featured' : 'unfeatured'} successfully`);
      } else {
        throw new Error('Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      showError('Failed to update book');
    }
  };

  // Select/deselect books
  const selectBook = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedBooks(prev => [...prev, id]);
    } else {
      setSelectedBooks(prev => prev.filter(bookId => bookId !== id));
    }
  };

  const selectAll = (selected: boolean) => {
    if (selected) {
      setSelectedBooks(filteredBooks.map(book => book._id?.toString() || ''));
    } else {
      setSelectedBooks([]);
    }
  };

  const clearSelection = () => {
    setSelectedBooks([]);
  };

  // Bulk delete
  const bulkDelete = async () => {
    try {
      const deletePromises = selectedBooks.map(async (id) => {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
          },
        });
        return response.ok;
      });
      
      const results = await Promise.all(deletePromises);
      const successCount = results.filter(Boolean).length;
      
      if (successCount > 0) {
        setBooks(prev => prev.filter(book => !selectedBooks.includes(book._id?.toString() || '')));
        showSuccess(`${successCount} book${successCount === 1 ? '' : 's'} deleted successfully`);
      }
      
      if (successCount < selectedBooks.length) {
        showError(`Failed to delete ${selectedBooks.length - successCount} book${selectedBooks.length - successCount === 1 ? '' : 's'}`);
      }
      
      setSelectedBooks([]);
    } catch (error) {
      console.error('Error in bulk delete:', error);
      showError('Failed to delete books');
    }
  };

  // Bulk toggle featured
  const bulkToggleFeatured = async (featured: boolean) => {
    try {
      const updatePromises = selectedBooks.map(async (id) => {
        try {
          const response = await fetch(`/api/books/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
            },
            body: JSON.stringify({ featured }),
          });

          if (response.ok) {
            const updatedBook = await response.json();
            return updatedBook;
          }
        } catch (error) {
          console.error('Error updating book:', error);
        }
        return null;
      });

      const results = await Promise.all(updatePromises);
      const validResults = results.filter(Boolean);

      if (validResults.length > 0) {
        setBooks(prev =>
          prev.map(book => {
            const updated = validResults.find(r => r._id === book._id?.toString());
            return updated || book;
          })
        );
        showSuccess(`${validResults.length} book${validResults.length === 1 ? '' : 's'} ${featured ? 'featured' : 'unfeatured'} successfully`);
      }

      if (validResults.length < selectedBooks.length) {
        showError(`Failed to update ${selectedBooks.length - validResults.length} book${selectedBooks.length - validResults.length === 1 ? '' : 's'}`);
      }

      setSelectedBooks([]);
    } catch (error) {
      console.error('Error in bulk toggle featured:', error);
      showError('Failed to update books');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return {
    books,
    filteredBooks,
    loading,
    selectedBooks,
    filters,
    updateFilters,
    deleteBook,
    toggleFeatured,
    selectBook,
    selectAll,
    clearSelection,
    bulkDelete,
    bulkToggleFeatured,
    refetch: fetchBooks,
  };
}