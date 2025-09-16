import { useState, useEffect, useCallback } from 'react';
import { ErrorHandler } from '@/utils/errorHandler';
import { BookGenre, SubGenre, BookGenreWithCount, generateRandomGenreColor } from '@/models/bookgenre';

export interface BookGenreFormData {
  name: string;
  slug: string;
  icon: string;
  color: string;
  order: number;
  featured: boolean;
}

export interface SubGenreFormData {
  name: string;
  slug: string;
  icon: string;
  order: number;
}

export interface UseBookGenres {
  bookGenres: BookGenreWithCount[];
  selectedBookGenre: BookGenreWithCount | null;
  subGenres: SubGenre[];
  loading: boolean;
  subGenresLoading: boolean;
  showBookGenreForm: boolean;
  showSubGenreForm: boolean;
  editingBookGenre: BookGenreWithCount | null;
  editingSubGenre: SubGenre | null;
  bookGenreFormData: BookGenreFormData;
  subGenreFormData: SubGenreFormData;

  // Actions
  refreshBookGenres: () => Promise<void>;
  setSelectedBookGenre: (bookGenre: BookGenreWithCount | null) => void;
  createBookGenre: (data: BookGenreFormData) => Promise<void>;
  updateBookGenre: (data: BookGenreFormData) => Promise<void>;
  deleteBookGenre: (bookGenre: BookGenreWithCount) => Promise<void>;
  createSubGenre: (data: SubGenreFormData) => Promise<void>;
  updateSubGenre: (data: SubGenreFormData) => Promise<void>;
  deleteSubGenre: (subGenre: SubGenre) => Promise<void>;
  
  // Form management
  openBookGenreForm: (bookGenre?: BookGenreWithCount) => void;
  openSubGenreForm: (subGenre?: SubGenre) => void;
  closeForms: () => void;
  updateBookGenreForm: (data: Partial<BookGenreFormData>) => void;
  updateSubGenreForm: (data: Partial<SubGenreFormData>) => void;
}


export function useBookGenres(): UseBookGenres {
  const [bookGenres, setBookGenres] = useState<BookGenreWithCount[]>([]);
  const [selectedBookGenre, setSelectedBookGenreState] = useState<BookGenreWithCount | null>(null);
  const [subGenres, setSubGenres] = useState<SubGenre[]>([]);
  const [loading, setLoading] = useState(false);
  const [subGenresLoading, setSubGenresLoading] = useState(false);
  
  // Form states
  const [showBookGenreForm, setShowBookGenreForm] = useState(false);
  const [showSubGenreForm, setShowSubGenreForm] = useState(false);
  const [editingBookGenre, setEditingBookGenre] = useState<BookGenreWithCount | null>(null);
  const [editingSubGenre, setEditingSubGenre] = useState<SubGenre | null>(null);
  
  const [bookGenreFormData, setBookGenreFormData] = useState<BookGenreFormData>({
    name: '',
    slug: '',
    icon: '📚',
    color: generateRandomGenreColor(),
    order: 0,
    featured: false,
  });

  const [subGenreFormData, setSubGenreFormData] = useState<SubGenreFormData>({
    name: '',
    slug: '',
    icon: '📖',
    order: 0,
  });

  // Fetch book genres
  const refreshBookGenres = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookgenres');
      
      if (response.ok) {
        const data = await response.json();
        setBookGenres(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch book genres. Status:', response.status, 'Error:', errorText);
        ErrorHandler.showError(`Failed to fetch book genres: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Network error fetching book genres:', error);
      ErrorHandler.showError('Network error fetching book genres. Check if API server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load book genres on mount and set first genre as selected if none is selected
  useEffect(() => {
    refreshBookGenres();
  }, [refreshBookGenres]);

  // Auto-select first genre when genres are loaded and no genre is selected
  useEffect(() => {
    if (bookGenres.length > 0 && !selectedBookGenre) {
      setSelectedBookGenreState(bookGenres[0]);
    }
  }, [bookGenres, selectedBookGenre]);

  // Fetch subgenres when genre changes
  const fetchSubGenres = useCallback(async (genreId: string) => {
    setSubGenresLoading(true);
    try {
      const response = await fetch(`/api/bookgenres/${genreId}/subgenres`);
      
      if (response.ok) {
        const data = await response.json();
        setSubGenres(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch subgenres. Status:', response.status, 'Error:', errorText);
        setSubGenres([]); // Set empty array as fallback
      }
    } catch (error) {
      console.error('Network error fetching subgenres:', error);
      setSubGenres([]); // Set empty array as fallback
    } finally {
      setSubGenresLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedBookGenre?._id) {
      fetchSubGenres(selectedBookGenre._id.toString());
    } else {
      setSubGenres([]);
    }
  }, [selectedBookGenre, fetchSubGenres]);

  // Set selected book genre
  const setSelectedBookGenre = useCallback((bookGenre: BookGenreWithCount | null) => {
    // Only update if the genre is actually different
    if (bookGenre?._id?.toString() !== selectedBookGenre?._id?.toString()) {
      setSelectedBookGenreState(bookGenre);
    }
  }, [selectedBookGenre]);

  // Form management - closeForms defined first to avoid circular dependencies
  const closeForms = useCallback(() => {
    setShowBookGenreForm(false);
    setShowSubGenreForm(false);
    setEditingBookGenre(null);
    setEditingSubGenre(null);
    setBookGenreFormData({
      name: '',
      slug: '',
      icon: '📚',
      color: generateRandomGenreColor(),
      order: bookGenres.length,
      featured: false,
    });
    setSubGenreFormData({
      name: '',
      slug: '',
      icon: '📖',
      order: subGenres.length,
    });
  }, [bookGenres.length, subGenres.length]);

  // BookGenre CRUD operations
  const createBookGenre = useCallback(async (data: BookGenreFormData) => {
    try {
      const response = await fetch('/api/bookgenres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newBookGenre = await response.json();
        setBookGenres(prev => [...prev, { ...newBookGenre, subGenresCount: 0 }]);
        closeForms();
        ErrorHandler.showSuccess(`Book genre "${data.name}" created successfully`);
      } else {
        const errorText = await response.text();
        
        let errorMessage = `Failed to create book genre (${response.status})`;
        if (errorText) {
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorMessage;
          } catch {
            errorMessage = errorText.length > 100 ? errorText.substring(0, 100) + '...' : errorText;
          }
        }
        
        ErrorHandler.showError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating book genre:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        ErrorHandler.showError('Network error: Unable to connect to API server');
      } else if (!(error instanceof Error) || !error.message.includes('Failed to create book genre')) {
        ErrorHandler.showError('Failed to create book genre: ' + (error instanceof Error ? error.message : String(error)));
      }
      throw error;
    }
  }, [closeForms]);

  const updateBookGenre = useCallback(async (data: BookGenreFormData) => {
    if (!editingBookGenre) return;

    try {
      const response = await fetch(`/api/bookgenres/${editingBookGenre._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedBookGenre = await response.json();
        setBookGenres(prev => prev.map(bg => 
          bg._id?.toString() === editingBookGenre._id?.toString() 
            ? { ...updatedBookGenre, subGenresCount: bg.subGenresCount }
            : bg
        ));
        
        if (selectedBookGenre?._id?.toString() === editingBookGenre._id?.toString()) {
          setSelectedBookGenreState({ ...updatedBookGenre, subGenresCount: selectedBookGenre?.subGenresCount || 0 });
        }
        
        closeForms();
        ErrorHandler.showSuccess(`Book genre "${data.name}" updated successfully`);
      } else {
        throw new Error('Failed to update book genre');
      }
    } catch (error) {
      console.error('Error updating book genre:', error);
      ErrorHandler.showError('Failed to update book genre');
      throw error;
    }
  }, [editingBookGenre, selectedBookGenre, closeForms]);

  const deleteBookGenre = useCallback(async (bookGenre: BookGenreWithCount) => {
    await ErrorHandler.handleAsyncOperation(async () => {
      const response = await fetch(`/api/bookgenres/${bookGenre._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete book genre');
      }

      setBookGenres(prev => prev.filter(bg => bg._id?.toString() !== bookGenre._id?.toString()));
      if (selectedBookGenre?._id?.toString() === bookGenre._id?.toString()) {
        setSelectedBookGenreState(null);
      }
      ErrorHandler.showSuccess(`Book genre "${bookGenre.name}" and all its subgenres deleted successfully`);
    }, 'Failed to delete book genre');
  }, [selectedBookGenre]);

  // SubGenre CRUD operations
  const createSubGenre = useCallback(async (data: SubGenreFormData) => {
    if (!selectedBookGenre) return;

    try {
      const response = await fetch(`/api/bookgenres/${selectedBookGenre._id}/subgenres`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newSubGenre = await response.json();
        setSubGenres(prev => [...prev, newSubGenre]);
        setBookGenres(prev => prev.map(bg => 
          bg._id?.toString() === selectedBookGenre._id?.toString()
            ? { ...bg, subGenresCount: bg.subGenresCount + 1 }
            : bg
        ));
        closeForms();
        ErrorHandler.showSuccess(`Subgenre "${data.name}" created successfully`);
      } else {
        throw new Error('Failed to create subgenre');
      }
    } catch (error) {
      console.error('Error creating subgenre:', error);
      ErrorHandler.showError('Failed to create subgenre');
      throw error;
    }
  }, [selectedBookGenre, closeForms]);

  const updateSubGenre = useCallback(async (data: SubGenreFormData) => {
    if (!editingSubGenre) return;

    try {
      const response = await fetch(`/api/subgenres/${editingSubGenre._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedSubGenre = await response.json();
        setSubGenres(prev => prev.map(sg => 
          sg._id?.toString() === editingSubGenre._id?.toString() ? updatedSubGenre : sg
        ));
        closeForms();
        ErrorHandler.showSuccess(`Subgenre "${data.name}" updated successfully`);
      } else {
        throw new Error('Failed to update subgenre');
      }
    } catch (error) {
      console.error('Error updating subgenre:', error);
      ErrorHandler.showError('Failed to update subgenre');
      throw error;
    }
  }, [editingSubGenre, closeForms]);

  const deleteSubGenre = useCallback(async (subGenre: SubGenre) => {
    try {
      const response = await fetch(`/api/subgenres/${subGenre._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubGenres(prev => prev.filter(sg => sg._id?.toString() !== subGenre._id?.toString()));
        if (selectedBookGenre) {
          setBookGenres(prev => prev.map(bg => 
            bg._id?.toString() === selectedBookGenre._id?.toString()
              ? { ...bg, subGenresCount: bg.subGenresCount - 1 }
              : bg
          ));
        }
        ErrorHandler.showSuccess(`Subgenre "${subGenre.name}" deleted successfully`);
      } else {
        throw new Error('Failed to delete subgenre');
      }
    } catch (error) {
      console.error('Error deleting subgenre:', error);
      ErrorHandler.showError(`Failed to delete subgenre "${subGenre.name}"`);
    }
  }, [selectedBookGenre]);

  // Form management
  const openBookGenreForm = useCallback((bookGenre?: BookGenreWithCount) => {
    if (bookGenre) {
      setEditingBookGenre(bookGenre);
      setBookGenreFormData({
        name: bookGenre.name,
        slug: bookGenre.slug,
        icon: bookGenre.icon || '📚',
        color: bookGenre.color || generateRandomGenreColor(),
        order: bookGenre.order,
        featured: bookGenre.featured || false,
      });
    } else {
      setEditingBookGenre(null);
      setBookGenreFormData({
        name: '',
        slug: '',
        icon: '📚',
        color: generateRandomGenreColor(),
        order: bookGenres.length,
        featured: false,
      });
    }
    setShowBookGenreForm(true);
  }, [bookGenres.length]);

  const openSubGenreForm = useCallback((subGenre?: SubGenre) => {
    if (subGenre) {
      setEditingSubGenre(subGenre);
      setSubGenreFormData({
        name: subGenre.name,
        slug: subGenre.slug,
        icon: subGenre.icon || '📖',
        order: subGenre.order,
      });
    } else {
      setEditingSubGenre(null);
      setSubGenreFormData({
        name: '',
        slug: '',
        icon: '📖',
        order: subGenres.length,
      });
    }
    setShowSubGenreForm(true);
  }, [subGenres.length]);

  const updateBookGenreForm = useCallback((data: Partial<BookGenreFormData>) => {
    setBookGenreFormData(prev => ({ ...prev, ...data }));
  }, []);

  const updateSubGenreForm = useCallback((data: Partial<SubGenreFormData>) => {
    setSubGenreFormData(prev => ({ ...prev, ...data }));
  }, []);

  return {
    bookGenres,
    selectedBookGenre,
    subGenres,
    loading,
    subGenresLoading,
    showBookGenreForm,
    showSubGenreForm,
    editingBookGenre,
    editingSubGenre,
    bookGenreFormData,
    subGenreFormData,

    refreshBookGenres,
    setSelectedBookGenre,
    createBookGenre,
    updateBookGenre,
    deleteBookGenre,
    createSubGenre,
    updateSubGenre,
    deleteSubGenre,
    
    openBookGenreForm,
    openSubGenreForm,
    closeForms,
    updateBookGenreForm,
    updateSubGenreForm,
  };
}
