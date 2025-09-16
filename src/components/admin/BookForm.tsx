'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CustomMDEditor from '@/components/MDEditor';
import { useToast } from '@/contexts/ToastContext';
import { Book, BookImage, createBookImage } from '@/models/book';
import { generateVietnameseSlug } from '@/utils/vietnamese-slug-generating';

interface BookFormProps {
  mode: 'create' | 'edit';
  bookId?: string;
  onCancel?: () => void;
}

interface ImageInput {
  id: string;
  url: string;
  featured: boolean;
  alt: string;
  error?: string;
  loading?: boolean;
  loadingFailed?: boolean;
}

export default function BookForm({ mode, bookId, onCancel }: BookFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit');
  
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    slug: '',
    author: '',
    publisher: '',
    language: 'English',
    type: 'Paper',
    content: '',
    summary: '',
    downloadUrl: '',
    images: [],
    publishedYear: undefined,
    genre: [],
    pages: undefined,
    fileFormat: '',
    featured: false,
  });
  
  const [imageInputs, setImageInputs] = useState<ImageInput[]>([{ 
    id: '1', 
    url: '', 
    featured: true, 
    alt: '', 
    error: '', 
    loading: false, 
    loadingFailed: false 
  }]);

  // Function to validate image URL (adapted from PostEditor.tsx)
  const validateImageUrl = (url: string): { isValid: boolean; error?: string } => {
    if (!url.trim()) {
      return { isValid: true }; // Empty URL is valid (optional field)
    }

    const trimmedUrl = url.trim();

    // Check for common image extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
    if (!imageExtensions.test(trimmedUrl)) {
      return { isValid: false, error: 'Please use an image file (.jpg, .png, .gif, .webp, .svg)' };
    }

    // Handle different URL types
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      try {
        new URL(trimmedUrl);
        return { isValid: true };
      } catch {
        return { isValid: false, error: 'Invalid URL format' };
      }
    }

    // For relative paths, add additional validation
    if (trimmedUrl.startsWith('/')) {
      // Basic validation for relative paths - check for dangerous patterns
      if (trimmedUrl.includes('..') || trimmedUrl.includes('//')) {
        return { isValid: false, error: 'Invalid relative path. Avoid ".." and "//" in paths.' };
      }
      
      // Suggest proper format for relative paths
      if (!trimmedUrl.startsWith('/images/') && !trimmedUrl.startsWith('/public/')) {
        console.warn('Relative paths should typically start with /images/ for public assets');
      }
    }

    return { isValid: true }; // Allow all relative and absolute paths with warnings
  };

  // Fetch book data if editing
  const fetchBook = useCallback(async () => {
    if (mode === 'create' || !bookId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/books/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
        },
      });

      if (response.ok) {
        const book: Book = await response.json();
        setFormData({
          title: book.title,
          slug: book.slug || '',
          author: book.author || '',
          publisher: book.publisher || '',
          language: book.language || 'English',
          type: book.type || 'Paper',
          content: book.content || '',
          summary: book.summary || '',
          downloadUrl: book.downloadUrl || '',
          publishedYear: book.publishedYear,
          genre: book.genre || [],
          pages: book.pages,
          fileFormat: book.fileFormat || '',
          featured: book.featured || false,
        });

        // Convert book images to imageInputs format
        const bookImageInputs = book.images?.map((img, index) => ({
          id: (index + 1).toString(),
          url: img.url,
          featured: img.featured || false,
          alt: img.alt || '',
          error: '',
          loading: false,
          loadingFailed: false
        })) || [];

        // Ensure at least one image input
        if (bookImageInputs.length === 0) {
          setImageInputs([{ 
            id: '1', 
            url: '', 
            featured: true, 
            alt: '', 
            error: '', 
            loading: false, 
            loadingFailed: false 
          }]);
        } else {
          setImageInputs(bookImageInputs);
        }
      } else if (response.status === 404) {
        showError('Book not found');
        router.push('/admin?tab=books');
      } else {
        showError('Failed to load book');
        router.push('/admin?tab=books');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      showError('Failed to load book');
      router.push('/admin?tab=books');
    } finally {
      setLoading(false);
    }
  }, [mode, bookId, showError, router]);

  useEffect(() => {
    if (mode === 'edit') {
      fetchBook();
    }
  }, [fetchBook, mode]);

  const handleInputChange = (field: keyof Book, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Auto-generate slug when title changes (only if slug is empty or auto-generated)
  const handleTitleChange = (newTitle: string) => {
    const newSlug = generateVietnameseSlug(newTitle);
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      // Only auto-update slug if it's empty or matches the previously generated slug
      slug: prev.slug === '' || prev.slug === generateVietnameseSlug(prev.title || '') ? newSlug : prev.slug
    }));
  };

  const handleGenreChange = (value: string) => {
    const genres = value.split(',').map(g => g.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      genre: genres
    }));
  };
  
  const addImageInput = () => {
    const newId = (imageInputs.length + 1).toString();
    setImageInputs(prev => [...prev, { 
      id: newId, 
      url: '', 
      featured: false, 
      alt: '',
      error: '',
      loading: false,
      loadingFailed: false
    }]);
  };
  
  const removeImageInput = (id: string) => {
    setImageInputs(prev => prev.filter(input => input.id !== id));
  };
  
  const updateImageInput = (id: string, field: string, value: string | boolean) => {
    if (field === 'url' && typeof value === 'string') {
      // Handle image URL changes with validation and loading state
      setImageInputs(prev => prev.map(input => {
        if (input.id !== id) return input;
        
        const updatedInput = { 
          ...input, 
          [field]: value, 
          error: '', 
          loadingFailed: false 
        };
        
        if (value.trim()) {
          const validation = validateImageUrl(value);
          
          if (!validation.isValid) {
            updatedInput.error = validation.error || 'Invalid image URL';
            updatedInput.loading = false;
          } else {
            updatedInput.loading = true;
          }
        } else {
          updatedInput.loading = false;
        }
        
        return updatedInput;
      }));
    } else {
      // Handle other field updates normally
      setImageInputs(prev => prev.map(input => 
        input.id === id ? { ...input, [field]: value } : input
      ));
    }
  };
  
  // Helper functions to handle image loading events
  const handleImageLoad = (id: string) => {
    setImageInputs(prev => prev.map(input => 
      input.id === id 
        ? { ...input, loading: false, loadingFailed: false }
        : input
    ));
  };

  const handleImageError = (id: string) => {
    setImageInputs(prev => prev.map(input => 
      input.id === id 
        ? { ...input, loading: false, loadingFailed: true }
        : input
    ));
  };

  const removeImage = (id: string) => {
    setImageInputs(prev => prev.map(input => 
      input.id === id 
        ? { ...input, url: '', error: '', loading: false, loadingFailed: false }
        : input
    ));
  };

  const processImages = (): BookImage[] => {
    return imageInputs
      .filter(input => input.url.trim())
      .map((input, index) => 
        createBookImage(
          input.url,
          index,
          input.featured,
          input.alt || undefined
        )
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Basic validation
      if (!formData.title?.trim()) {
        showError('Title is required');
        return;
      }

      if (!formData.slug?.trim() && !formData.title?.trim()) {
        showError('URL Slug is required');
        return;
      }

      // Validate download URL if provided
      if (formData.downloadUrl && formData.downloadUrl.trim()) {
        try {
          new URL(formData.downloadUrl);
        } catch {
          showError('Please enter a valid download URL');
          return;
        }
      }

      const processedImages = processImages();
      
      const bookData = {
        ...formData,
        title: formData.title?.trim(),
        slug: formData.slug?.trim() || generateVietnameseSlug(formData.title || ''),
        author: formData.author?.trim() || undefined,
        publisher: formData.publisher?.trim() || undefined,
        downloadUrl: formData.downloadUrl?.trim() || undefined,
        images: processedImages,
        summary: formData.summary?.trim() || undefined,
        fileFormat: formData.fileFormat?.trim() || undefined,
      };

      const url = mode === 'create' ? '/api/books' : `/api/books/${bookId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`,
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const result = await response.json();
        if (mode === 'create') {
          router.push(`/admin/books/edit/${result._id}`);
        } else {
          showSuccess('Book updated successfully!');
        }
      } else {
        const error = await response.json();
        showError(error.error || `Failed to ${mode === 'create' ? 'add' : 'update'} book`);
      }
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'adding' : 'updating'} book:`, error);
      showError(`Failed to ${mode === 'create' ? 'add' : 'update'} book`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading book...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mode === 'create' ? 'Add New Book' : 'Edit Book'}
              </h1>
              <p className="text-gray-600">
                {mode === 'create' ? 'Add a new book to your personal library' : 'Update book information'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin?tab=books"
                className="inline-flex items-center px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Admin Dashboard
              </Link>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter book title"
                  required
                />
              </div>

              {/* URL Slug */}
              <div className="md:col-span-2">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug || ''}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                    placeholder="auto-generated-from-title"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('slug', generateVietnameseSlug(formData.title || ''))}
                    className="absolute right-2 top-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    Auto
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  URL-friendly version of your title. Will be used in: <code className="bg-gray-100 px-1 rounded text-xs">/books/{formData.slug || 'your-slug-here'}</code>
                </p>
              </div>

              {/* Author */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  value={formData.author || ''}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Author name"
                />
              </div>

              {/* Publisher */}
              <div>
                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-2">
                  Publisher
                </label>
                <input
                  type="text"
                  id="publisher"
                  value={formData.publisher || ''}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Publisher name"
                />
              </div>

              {/* Language */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={formData.language || 'English'}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="English">English</option>
                  <option value="Vietnamese">Vietnamese</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  id="type"
                  value={formData.type || 'Paper'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="Paper">Paper Book</option>
                  <option value="Ebook">E-book</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Published Year */}
              <div>
                <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Published Year
                </label>
                <input
                  type="number"
                  id="publishedYear"
                  value={formData.publishedYear || ''}
                  onChange={(e) => handleInputChange('publishedYear', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="2024"
                  min="1000"
                  max="2100"
                />
              </div>

              {/* Pages */}
              <div>
                <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-2">
                  Pages
                </label>
                <input
                  type="number"
                  id="pages"
                  value={formData.pages || ''}
                  onChange={(e) => handleInputChange('pages', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="300"
                  min="1"
                />
              </div>

              {/* File Format */}
              <div>
                <label htmlFor="fileFormat" className="block text-sm font-medium text-gray-700 mb-2">
                  File Format
                </label>
                <input
                  type="text"
                  id="fileFormat"
                  value={formData.fileFormat || ''}
                  onChange={(e) => handleInputChange('fileFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="PDF, EPUB, etc."
                />
              </div>

              {/* Genre */}
              <div className="md:col-span-2">
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Genres (comma-separated)
                </label>
                <input
                  type="text"
                  id="genre"
                  value={formData.genre?.join(', ') || ''}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Fiction, Science, Technology"
                />
              </div>

              {/* Featured */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Featured Book</span>
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Book Images</h2>
              <button
                type="button"
                onClick={addImageInput}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Image
              </button>
            </div>
            
            <div className="space-y-4">
              {imageInputs.map((imageInput, index) => (
                <div key={imageInput.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      Image {index + 1}
                      {imageInput.featured && <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Featured</span>}
                    </h3>
                    {imageInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageInput(imageInput.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image URL */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <input
                          type="url"
                          value={imageInput.url}
                          onChange={(e) => updateImageInput(imageInput.id, 'url', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                          placeholder="/images/book-covers/example.jpg"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Supports relative paths (/images/book-covers/book.jpg) or full URLs (https://...)
                      </p>
                      
                      {/* Error message */}
                      {imageInput.error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-800">{imageInput.error}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Featured Image */}
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={imageInput.featured}
                          onChange={(e) => updateImageInput(imageInput.id, 'featured', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured Image</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Featured images are prioritized for display</p>
                    </div>
                    
                    {/* Alt Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={imageInput.alt}
                        onChange={(e) => updateImageInput(imageInput.id, 'alt', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="Description for accessibility"
                      />
                    </div>
                  </div>

                  {/* Enhanced Image Preview */}
                  {imageInput.url && !imageInput.error && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${imageInput.loadingFailed ? 'bg-red-400' : 'bg-green-400'}`}></div>
                          <span className="text-sm font-medium text-gray-800">
                            {imageInput.loadingFailed ? 'Failed to Load' : 'Preview'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(imageInput.id)}
                          className="text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all duration-200 border border-transparent hover:border-red-200"
                        >
                          Remove Image
                        </button>
                      </div>
                      
                      {imageInput.loadingFailed ? (
                        /* Show error state */
                        <div className="relative inline-block max-w-full">
                          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-sm text-gray-600 mb-2">Failed to load image</p>
                            <p className="text-xs text-gray-500">The image path might be incorrect or the file doesn&apos;t exist</p>
                          </div>
                        </div>
                      ) : (
                        /* Show image preview */
                        <div className="relative inline-block max-w-full group">
                          {imageInput.loading && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                <span className="text-xs text-gray-600 font-medium">Loading...</span>
                              </div>
                            </div>
                          )}
                          
                          <img
                            src={imageInput.url}
                            alt={imageInput.alt || 'Book cover preview'}
                            className="block max-w-full max-h-48 object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                            onLoad={() => handleImageLoad(imageInput.id)}
                            onError={() => handleImageError(imageInput.id)}
                          />
                          
                          {/* Subtle overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-lg"></div>
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-gray-500 truncate flex-1 mr-4">{imageInput.url}</p>
                        <div className="flex items-center text-xs text-gray-400">
                          {imageInput.loadingFailed ? (
                            <>
                              <svg className="w-3 h-3 mr-1 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span className="text-red-400">Error</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Ready
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Download URL */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Download</h2>
            <div>
              <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Download URL (for e-books)
              </label>
              <input
                type="url"
                id="downloadUrl"
                value={formData.downloadUrl || ''}
                onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="https://example.com/book.pdf"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Summary</h2>
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                Book Summary (optional - will be auto-generated from content if not provided)
              </label>
              <textarea
                id="summary"
                value={formData.summary || ''}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Brief description of the book..."
                maxLength={300}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.summary?.length || 0}/300 characters
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Content</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Content (Markdown supported)
              </label>
              <CustomMDEditor
                value={formData.content || ''}
                onChange={(value) => handleInputChange('content', value || '')}
                height={400}
                placeholder="Enter book description, reviews, or any additional content..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.title?.trim() || (!formData.slug?.trim() && !formData.title?.trim())}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving 
                ? (mode === 'create' ? 'Adding Book...' : 'Updating Book...') 
                : (mode === 'create' ? 'Add Book' : 'Update Book')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
