import { useState, useEffect, useCallback } from 'react';
import { BlogPost } from '@/models';
import { ErrorHandler } from '@/utils/errorHandler';

export interface PostFilters {
  search: string;
  status: 'all' | 'published' | 'draft';
  language: 'all' | 'english' | 'vietnamese';
  sortBy: 'date' | 'title' | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface UsePosts {
  posts: BlogPost[];
  filteredPosts: BlogPost[];
  loading: boolean;
  selectedPosts: string[];
  filters: PostFilters;
  showBulkActions: boolean;
  
  // Actions
  refreshPosts: () => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  togglePublish: (post: BlogPost) => Promise<void>;
  updateFilters: (filters: Partial<PostFilters>) => void;
  selectAll: () => void;
  selectPost: (postId: string) => void;
  clearSelection: () => void;
  bulkDelete: () => Promise<void>;
  bulkPublish: (publish: boolean) => Promise<void>;
}

export function usePosts(): UsePosts {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [filters, setFilters] = useState<PostFilters>({
    search: '',
    status: 'all',
    language: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Fetch posts
  const refreshPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?page=1&limit=100');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  // Filter and sort posts
  useEffect(() => {
    let filtered = posts;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.content.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(post => 
        filters.status === 'published' ? post.published : !post.published
      );
    }

    // Apply language filter
    if (filters.language !== 'all') {
      filtered = filtered.filter(post => {
        if (filters.language === 'english') {
          return post.language === 'English' || !post.language;
        }
        return post.language === 'Vietnamese';
      });
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let aValue: string | number | Date | boolean, bValue: string | number | Date | boolean;
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          aValue = a.published;
          bValue = b.published;
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredPosts(filtered);
  }, [posts, filters]);

  // Delete a single post
  const deletePost = async (id: string) => {
    await ErrorHandler.handleAsyncOperation(async () => {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      const deletedPost = posts.find(post => post._id?.toString() === id);
      setPosts(posts.filter(post => post._id?.toString() !== id));
      ErrorHandler.showSuccess(`Post "${deletedPost?.title || 'Untitled'}" deleted successfully`);
    }, 'Failed to delete post');
  };

  // Toggle publish status
  const togglePublish = async (post: BlogPost) => {
    await ErrorHandler.handleAsyncOperation(async () => {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !post.published,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post status');
      }

      const updatedPost = await response.json();
      setPosts(posts.map(p => 
        p._id?.toString() === post._id?.toString() ? updatedPost : p
      ));
      
      ErrorHandler.showSuccess(`Post ${updatedPost.published ? 'published' : 'unpublished'} successfully`);
    }, 'Failed to update post status');
  };

  // Update filters
  const updateFilters = (newFilters: Partial<PostFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Selection management
  const selectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post._id?.toString() || ''));
    }
  };

  const selectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const clearSelection = () => {
    setSelectedPosts([]);
  };

  // Bulk operations
  const bulkDelete = async () => {
    await ErrorHandler.handleAsyncOperation(async () => {
      const deletePromises = selectedPosts.map(postId =>
        fetch(`/api/posts/${postId}`, { method: 'DELETE' })
      );
      
      const results = await Promise.all(deletePromises);
      const failedDeletes = results.filter(r => !r.ok);
      
      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} posts`);
      }
      
      setPosts(posts.filter(post => !selectedPosts.includes(post._id?.toString() || '')));
      setSelectedPosts([]);
      ErrorHandler.showSuccess(`${selectedPosts.length} posts deleted successfully`);
    }, 'Failed to delete posts');
  };

  const bulkPublish = async (publish: boolean) => {
    await ErrorHandler.handleAsyncOperation(async () => {
      const updatePromises = selectedPosts.map(postId =>
        fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ published: publish })
        })
      );
      
      const results = await Promise.all(updatePromises);
      const failedUpdates = results.filter(r => !r.ok);
      
      if (failedUpdates.length > 0) {
        throw new Error(`Failed to update ${failedUpdates.length} posts`);
      }
      
      setPosts(posts.map(post => 
        selectedPosts.includes(post._id?.toString() || '')
          ? { ...post, published: publish }
          : post
      ));
      setSelectedPosts([]);
      ErrorHandler.showSuccess(`${selectedPosts.length} posts ${publish ? 'published' : 'unpublished'} successfully`);
    }, `Failed to ${publish ? 'publish' : 'unpublish'} posts`);
  };

  const showBulkActions = selectedPosts.length > 0;

  return {
    posts,
    filteredPosts,
    loading,
    selectedPosts,
    filters,
    showBulkActions,
    
    refreshPosts,
    deletePost,
    togglePublish,
    updateFilters,
    selectAll,
    selectPost,
    clearSelection,
    bulkDelete,
    bulkPublish,
  };
}
