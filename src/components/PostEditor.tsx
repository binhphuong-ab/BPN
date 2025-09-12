'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CustomMDEditor from '@/components/MDEditor';
import { BlogPost } from '@/models';
import { useTopics } from '@/hooks/useTopics';

interface PostEditorProps {
  mode: 'create' | 'edit';
  postId?: string;
}

interface FormData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  image: string;
  language: 'English' | 'Vietnamese';
  published: boolean;
  topicId?: string;
  subTopicId?: string;
}

export default function PostEditor({ mode, postId }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(mode === 'edit');
  const [post, setPost] = useState<BlogPost | null>(null);
  const { 
    topics, 
    subtopics, 
    loading: topicsLoading, 
    subtopicsLoading,
    refreshTopics,
    setSelectedTopic 
  } = useTopics();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    author: 'Binh Phuong Nguyen',
    image: '',
    language: 'English',
    published: false,
    topicId: '',
    subTopicId: '',
  });
  const [imageError, setImageError] = useState<string>('');
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  // Function to generate slug from title with Vietnamese support
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      // Convert Vietnamese characters to ASCII equivalents
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      // Remove any remaining special characters (keep only letters, numbers, spaces, hyphens)
      .replace(/[^a-z0-9 -]/g, '')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // Replace spaces with hyphens
      .replace(/\s/g, '-')
      // Replace multiple hyphens with single hyphen
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      .trim();
  };

  // Function to validate image URL
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

    return { isValid: true }; // Allow all relative and absolute paths
  };

  // Function to handle image URL changes with validation
  const handleImageChange = (newImageUrl: string) => {
    setFormData({ ...formData, image: newImageUrl });
    setImageError('');
    
    if (newImageUrl.trim()) {
      const validation = validateImageUrl(newImageUrl);
      
      if (!validation.isValid) {
        setImageError(validation.error || 'Invalid image URL');
        setImageLoading(false);
        return;
      }
      
      setImageLoading(true);
    } else {
      setImageLoading(false);
    }
  };

  // Auto-generate slug when title changes (only if slug is empty or auto-generated)
  const handleTitleChange = (newTitle: string) => {
    const newSlug = generateSlug(newTitle);
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      // Only auto-update slug if it's empty or matches the previously generated slug
      slug: prev.slug === '' || prev.slug === generateSlug(prev.title) ? newSlug : prev.slug
    }));
  };

  // Handle topic selection
  const handleTopicChange = (topicId: string) => {
    const topic = topics.find(t => t._id?.toString() === topicId);
    setSelectedTopic(topic || null);
    setFormData(prev => ({
      ...prev,
      topicId: topicId,
      subTopicId: '', // Reset subtopic when topic changes
    }));
  };

  // Handle subtopic selection
  const handleSubTopicChange = (subTopicId: string) => {
    setFormData(prev => ({
      ...prev,
      subTopicId: subTopicId,
    }));
  };

  const fetchPost = useCallback(async () => {
    if (mode === 'create' || !postId) return;
    
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const postData: BlogPost = await response.json();
        setPost(postData);
        setFormData({
          title: postData.title,
          slug: postData.slug,
          summary: postData.summary || '',
          content: postData.content,
          author: postData.author,
          image: postData.image || '',
          language: postData.language || 'English',
          published: postData.published,
          topicId: postData.topicId?.toString() || '',
          subTopicId: postData.subTopicId?.toString() || '',
        });
        
        // Set selected topic if post has one
        if (postData.topicId) {
          const topic = topics.find(t => t._id?.toString() === postData.topicId?.toString());
          if (topic) {
            setSelectedTopic(topic);
          }
        }
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/admin');
    } finally {
      setFetchLoading(false);
    }
  }, [mode, postId, router, topics, setSelectedTopic]);

  useEffect(() => {
    // Load topics when component mounts
    refreshTopics();
  }, [refreshTopics]);

  useEffect(() => {
    if (mode === 'edit') {
      fetchPost();
    }
  }, [fetchPost, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title), // Use manual slug or generate from title
        summary: formData.summary,
        content: formData.content,
        author: formData.author,
        image: formData.image.trim() || undefined,
        language: formData.language,
        published: formData.published,
        topicId: formData.topicId || undefined,
        subTopicId: formData.subTopicId || undefined,
      };

      const url = mode === 'create' ? '/api/posts' : `/api/posts/${postId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        if (mode === 'create') {
          router.push(`/admin/edit/${result._id}`);
        } else {
          setPost(result);
          alert('Post updated successfully!');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || `Failed to ${mode} post`);
      }
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} post:`, error);
      alert(`Failed to ${mode} post`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    setFormData({ ...formData, published: false });
    setTimeout(() => {
      document.querySelector('form')?.requestSubmit();
    }, 0);
  };

  const handlePublish = () => {
    setFormData({ ...formData, published: true });
    setTimeout(() => {
      document.querySelector('form')?.requestSubmit();
    }, 0);
  };

  const deletePost = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  // Variables for page content
  const pageTitle = mode === 'create' ? 'Create New Post' : 'Edit Post';
  const pageDescription = mode === 'create' 
    ? 'Write and publish a new blog post' 
    : 'Update your blog post';

  // Loading state for edit mode
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state for edit mode
  if (mode === 'edit' && !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Admin Dashboard
              </Link>
              <div className="text-gray-300">/</div>
              <span className="text-gray-900 font-medium">{pageTitle}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              {mode === 'edit' && post?.published && (
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Live
                </Link>
              )}
              
              {/* Save Status Indicator */}
              {mode === 'edit' && (
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid grid-cols-1 ${mode === 'edit' ? 'lg:grid-cols-4' : ''} gap-8`}>
          {/* Main Content */}
          <div className={mode === 'edit' ? 'lg:col-span-3' : ''}>
            {/* Post Title Header for Edit Mode */}
            {mode === 'edit' && post && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Created {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Updated {new Date(post.updatedAt).toLocaleDateString()}
                      </span>
                      {post.views && post.views > 0 && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {post.views} views
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    post.published 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      post.published ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></div>
                    {post.published ? 'Published' : 'Draft'}
                  </div>
                </div>
              </div>
            )}

            {/* Page Header for Create Mode */}
            {mode === 'create' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
                  <p className="text-gray-600 mt-2">{pageDescription}</p>
                </div>
              </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-black">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                      Post Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-medium text-black"
                      placeholder="Enter an engaging title for your post..."
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-black mb-2">
                      URL Slug *
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <input
                        type="text"
                        id="slug"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                        placeholder="auto-generated-from-title"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, slug: generateSlug(formData.title) })}
                        className="absolute right-2 top-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                      >
                        Auto
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      URL-friendly version of your title. Will be used in: <code className="bg-gray-100 px-1 rounded text-xs">/blog/{formData.slug || 'your-slug-here'}</code>
                    </p>
                  </div>

                  {/* Author */}
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-black mb-2">
                      Author *
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        type="text"
                        id="author"
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                        placeholder="Author name"
                      />
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div className="md:col-span-2">
                    <label htmlFor="image" className="block text-sm font-medium text-black mb-2">
                      Featured Image
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="text"
                        id="image"
                        value={formData.image}
                        onChange={(e) => handleImageChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                        placeholder="/images/blog/Strategy.jpg"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Optional. Supports relative paths (/images/blog/hero.jpg) or full URLs (https://...)
                    </p>
                    
                    {/* Error message */}
                    {imageError && (
                      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{imageError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image preview */}
                    {formData.image && !imageError && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-800">Preview</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, image: '' });
                              setImageError('');
                              setImageLoading(false);
                            }}
                            className="text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all duration-200 border border-transparent hover:border-red-200"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="relative inline-block max-w-full group">
                          {imageLoading && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                <span className="text-xs text-gray-600 font-medium">Loading...</span>
                              </div>
                            </div>
                          )}
                          
                          <img
                            src={formData.image}
                            alt="Featured image preview"
                            className="block max-w-full max-h-48 object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                            onLoad={() => setImageLoading(false)}
                            onError={() => {
                              setImageLoading(false);
                              setImageError('Failed to load image. Please check the URL.');
                            }}
                          />
                          
                          {/* Subtle overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-lg"></div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs text-gray-500 truncate flex-1 mr-4">{formData.image}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Ready
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Topic Selection */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-black mb-3">
                      Topic (Optional)
                    </label>
                    {topicsLoading ? (
                      <div className="flex items-center justify-center p-8 border border-gray-200 rounded-lg">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading topics...</span>
                      </div>
                    ) : (
                      <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
                        <div className="space-y-1">
                          {/* Default "Select a topic" option */}
                          <div
                            onClick={() => handleTopicChange('')}
                            className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                              !formData.topicId
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-blue-100'
                            }`}
                          >
                            Select a topic (optional)
                          </div>
                          
                          {/* Topic options */}
                          {topics.map((topic) => (
                            <div
                              key={topic._id?.toString()}
                              onClick={() => handleTopicChange(topic._id?.toString() || '')}
                              className={`px-3 py-2 rounded cursor-pointer transition-colors flex items-center ${
                                formData.topicId === topic._id?.toString()
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 hover:bg-blue-100'
                              }`}
                            >
                              <span className="mr-2">{topic.icon || '📁'}</span>
                              <span className="flex-1 truncate">{topic.name}</span>
                              {topic.subTopicsCount && topic.subTopicsCount > 0 && (
                                <span className={`ml-2 text-xs flex-shrink-0 ${
                                  formData.topicId === topic._id?.toString()
                                    ? 'text-blue-200'
                                    : 'text-gray-500'
                                }`}>
                                  {topic.subTopicsCount}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Choose a topic to categorize your post
                    </p>
                  </div>

                  {/* SubTopic Selection - Only show if topic is selected */}
                  {formData.topicId ? (
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-black mb-3">
                        Sub Topic (Optional)
                      </label>
                      {subtopicsLoading ? (
                        <div className="flex items-center justify-center p-8 border border-gray-200 rounded-lg">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-gray-600">Loading subtopics...</span>
                        </div>
                      ) : (
                        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                          <div className="space-y-1">
                            {/* Default "Select a sub topic" option */}
                            <div
                              onClick={() => handleSubTopicChange('')}
                              className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                                !formData.subTopicId
                                  ? 'bg-gray-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              Select a sub topic (optional)
                            </div>
                            
                            {/* SubTopic options */}
                            {subtopics.length > 0 ? (
                              subtopics.map((subtopic) => (
                                <div
                                  key={subtopic._id?.toString()}
                                  onClick={() => handleSubTopicChange(subtopic._id?.toString() || '')}
                                  className={`px-3 py-2 rounded cursor-pointer transition-colors flex items-center ${
                                    formData.subTopicId === subtopic._id?.toString()
                                      ? 'bg-gray-600 text-white'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  <span className="mr-2">{subtopic.icon || '📄'}</span>
                                  <span className="flex-1 truncate">{subtopic.name}</span>
                                </div>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-gray-500 italic">
                                No subtopics available for this topic
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mt-2">
                        Choose a subtopic for more specific categorization
                      </p>
                    </div>
                  ) : (
                    /* Empty placeholder div to maintain grid layout */
                    <div className="md:col-span-1"></div>
                  )}

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-3">
                      Language *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        onClick={() => setFormData({ ...formData, language: 'English' })}
                        className={`relative cursor-pointer rounded-xl p-4 transition-all duration-200 border-2 ${
                          formData.language === 'English' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg' 
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <span className="text-2xl">🇺🇸</span>
                          </div>
                          <div className="flex-1">
                            <div className={`text-base font-semibold ${
                              formData.language === 'English' ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              English
                            </div>
                            <div className={`text-sm ${
                              formData.language === 'English' ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              International audience
                            </div>
                          </div>
                        </div>
                        {formData.language === 'English' && (
                          <div className="absolute top-3 right-3">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div 
                        onClick={() => setFormData({ ...formData, language: 'Vietnamese' })}
                        className={`relative cursor-pointer rounded-xl p-4 transition-all duration-200 border-2 ${
                          formData.language === 'Vietnamese' 
                            ? 'border-blue-500 bg-blue-50 shadow-lg' 
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <span className="text-2xl">🇻🇳</span>
                          </div>
                          <div className="flex-1">
                            <div className={`text-base font-semibold ${
                              formData.language === 'Vietnamese' ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              Vietnamese
                            </div>
                            <div className={`text-sm ${
                              formData.language === 'Vietnamese' ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              Vietnamese audience
                            </div>
                          </div>
                        </div>
                        {formData.language === 'Vietnamese' && (
                          <div className="absolute top-3 right-3">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Select the primary language of your post
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Summary Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <h2 className="text-lg font-semibold text-black">Post Summary</h2>
                </div>
                
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium text-black mb-2">
                    Summary *
                  </label>
                  <textarea
                    id="summary"
                    required
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black resize-none"
                    placeholder="Write a compelling summary that will appear in blog previews, social media shares, and search results..."
                    rows={4}
                    maxLength={300}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">
                      This summary will be used for blog previews, meta descriptions, and social media shares.
                    </p>
                    <span className="text-sm text-gray-500">
                      {formData.summary.length}/300
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-black">Content Editor</h2>
                  </div>
                  <div className="flex items-center text-sm text-black">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Supports Markdown & KaTeX
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <CustomMDEditor
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    height={650}
                    placeholder={mode === 'create' ? `Write your blog post content here...

# Your Amazing Post Title

Start writing your content here. You can use:

- **Bold text** and *italic text*
- [Links](https://example.com)
- Code blocks with syntax highlighting
- Math expressions: $E = mc^2$ or $$\\int_0^1 x dx$$

## Subheadings
Add your content sections here...

You can use markdown syntax including:
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- ![Images](/images/blog/example.jpg)
- Code blocks with syntax highlighting
- Math expressions with KaTeX: $x = y + z$ or $$\\int_0^1 x dx$$

## Headers
### Subheaders

1. Numbered lists
2. More items

- Bullet points
- More bullets

> Blockquotes for important notes

\`\`\`javascript
// Code blocks with syntax highlighting
const example = 'Hello World';
console.log(example);
\`\`\`

Happy writing! 🚀` : `Write your blog post content here...

# Your Amazing Post Title

Start writing your content here. You can use:

- **Bold text** and *italic text*
- [Links](https://example.com)
- Code blocks with syntax highlighting
- Math expressions: $E = mc^2$ or $$\\int_0^1 x dx$$

## Subheadings
Add your content sections here...`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="flex items-center text-sm text-black">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {mode === 'create' ? 'Ready to publish' : 'Last saved: just now'}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={loading || !formData.title || !formData.content}
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {loading ? 'Saving...' : 'Save as Draft'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={loading || !formData.title || !formData.content}
                      className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      {loading ? (mode === 'create' ? 'Creating...' : 'Publishing...') : (mode === 'create' ? 'Publish Post' : (formData.published ? 'Update & Keep Published' : 'Publish Post'))}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Writing Tips for Create Mode */}
            {mode === 'create' && (
              <>
                {/* Topic Breadcrumb for Create Mode */}
                {(formData.topicId || formData.subTopicId) && (
                  <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">📂 Post Category</h3>
                    <div className="flex items-center space-x-2 text-green-800">
                      {formData.topicId && (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full`} style={{
                              backgroundColor: topics.find(t => t._id?.toString() === formData.topicId)?.color || '#10B981'
                            }}></div>
                            <span className="font-medium">
                              {topics.find(t => t._id?.toString() === formData.topicId)?.icon} {topics.find(t => t._id?.toString() === formData.topicId)?.name}
                            </span>
                          </div>
                          {formData.subTopicId && (
                            <>
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span className="font-medium">
                                {subtopics.find(s => s._id?.toString() === formData.subTopicId)?.icon} {subtopics.find(s => s._id?.toString() === formData.subTopicId)?.name}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Your post will be categorized under this topic{formData.subTopicId ? ' and subtopic' : ''}.
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">✨ Writing Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                      <h4 className="font-medium mb-2">Markdown Support:</h4>
                      <ul className="space-y-1">
                        <li>• Use <code className="bg-blue-100 px-1 rounded">**bold**</code> and <code className="bg-blue-100 px-1 rounded">*italic*</code> for emphasis</li>
                        <li>• Create headers with <code className="bg-blue-100 px-1 rounded"># ## ###</code></li>
                        <li>• Add images with <code className="bg-blue-100 px-1 rounded">![Alt text](/images/blog/image.jpg)</code></li>
                        <li>• Add code with <code className="bg-blue-100 px-1 rounded">`backticks`</code> or <code className="bg-blue-100 px-1 rounded">```blocks```</code></li>
                        <li>• Create lists with <code className="bg-blue-100 px-1 rounded">-</code> or <code className="bg-blue-100 px-1 rounded">1.</code></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Math Support (KaTeX):</h4>
                      <ul className="space-y-1">
                        <li>• Inline math: <code className="bg-blue-100 px-1 rounded">$x = y + z$</code></li>
                        <li>• Block math: <code className="bg-blue-100 px-1 rounded">$$\\int_0^1 x dx$$</code></li>
                        <li>• Supports LaTeX syntax</li>
                        <li>• Great for technical posts!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar for Edit Mode */}
          {mode === 'edit' && post && (
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Topic/SubTopic Info */}
                {(formData.topicId || formData.subTopicId) && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
                    <div className="space-y-3">
                      {formData.topicId && (
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            topics.find(t => t._id?.toString() === formData.topicId)?.color || 'bg-gray-400'
                          }`} style={{
                            backgroundColor: topics.find(t => t._id?.toString() === formData.topicId)?.color || '#9CA3AF'
                          }}></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {topics.find(t => t._id?.toString() === formData.topicId)?.icon} {topics.find(t => t._id?.toString() === formData.topicId)?.name}
                            </div>
                            <div className="text-xs text-gray-500">Topic</div>
                          </div>
                        </div>
                      )}
                      {formData.subTopicId && (
                        <div className="flex items-center space-x-3 ml-6">
                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              {subtopics.find(s => s._id?.toString() === formData.subTopicId)?.icon} {subtopics.find(s => s._id?.toString() === formData.subTopicId)?.name}
                            </div>
                            <div className="text-xs text-gray-500">SubTopic</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Post Statistics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Views</span>
                      <span className="text-sm font-medium text-gray-900">{post.views || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Reading Time</span>
                      <span className="text-sm font-medium text-gray-900">{post.readTime || 1} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Word Count</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formData.content.split(' ').filter(word => word.length > 0).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {post.published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Preview Post
                      </Link>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(window.location.href)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Edit Link
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                  <p className="text-sm text-red-600 mb-4">
                    Once you delete this post, there is no going back. Please be certain.
                  </p>
                  <button
                    type="button"
                    onClick={deletePost}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {loading ? 'Deleting...' : 'Delete Post'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
