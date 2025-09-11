import React, { memo } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/models';
import { formatDistanceToNow } from 'date-fns';

interface PostsTableProps {
  posts: BlogPost[];
  selectedPosts: string[];
  onSelectAll: () => void;
  onSelectPost: (postId: string) => void;
  onTogglePublish: (post: BlogPost) => void;
  onDeletePost: (postId: string) => void;
  isLoading?: boolean;
}

export default memo(function PostsTable({ 
  posts, 
  selectedPosts, 
  onSelectAll, 
  onSelectPost, 
  onTogglePublish, 
  onDeletePost,
  isLoading = false
}: PostsTableProps) {
  const allSelected = selectedPosts.length === posts.length && posts.length > 0;

  if (isLoading) {
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Language</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-200 rounded"></div></td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-12"></div></td>
                <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                aria-label="Select all posts"
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Title
            </th>
            <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Language
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => {
            const postId = post._id?.toString() || '';
            const isSelected = selectedPosts.includes(postId);
            
            return (
              <tr key={postId} className={`transition-colors duration-150 ${isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectPost(postId)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    aria-label={`Select post: ${post.title}`}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-semibold text-gray-900 truncate">{post.title}</div>
                    <div className="text-sm text-gray-600 truncate mt-1">
                      {post.excerpt || 'No excerpt available'}
                    </div>
                    {/* Show language on mobile */}
                    <div className="sm:hidden mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        post.language?.toLowerCase() === 'vietnamese' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {post.language?.toUpperCase() || 'EN'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    post.language?.toLowerCase() === 'vietnamese' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {post.language?.toUpperCase() || 'EN'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onTogglePublish(post)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      post.published
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200 focus:ring-amber-500'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      post.published ? 'bg-green-400' : 'bg-amber-400'
                    }`}></span>
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/edit/${postId}`}
                      className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      <svg className="w-4 h-4 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 hover:text-green-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                    >
                      <svg className="w-4 h-4 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="hidden sm:inline">View</span>
                    </Link>
                    <button
                      onClick={() => onDeletePost(postId)}
                      className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 hover:text-red-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      <svg className="w-4 h-4 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                  {/* Show creation date on mobile */}
                  <div className="md:hidden mt-2 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
