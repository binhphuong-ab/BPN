import React from 'react';
import { PostFilters } from '@/hooks/usePosts';

interface PostsFiltersProps {
  filters: PostFilters;
  onFiltersChange: (filters: Partial<PostFilters>) => void;
  postsCount: number;
  filteredCount: number;
}

export default function PostsFilters({ filters, onFiltersChange, postsCount, filteredCount }: PostsFiltersProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">
          All Posts
          <span className="ml-2 text-sm text-gray-600 font-normal">
            ({filteredCount} of {postsCount})
          </span>
        </h3>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800 placeholder-gray-500 w-64"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ status: e.target.value as 'all' | 'published' | 'draft' })}
              className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800 font-medium cursor-pointer transition-all duration-200"
            >
              <option value="all">📋 All Status</option>
              <option value="published">✅ Published</option>
              <option value="draft">📝 Draft</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Language Filter */}
          <div className="relative">
            <select
              value={filters.language}
              onChange={(e) => onFiltersChange({ language: e.target.value as 'all' | 'english' | 'vietnamese' })}
              className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800 font-medium cursor-pointer transition-all duration-200"
            >
              <option value="all">🌐 All Languages</option>
              <option value="english">🇺🇸 English</option>
              <option value="vietnamese">🇻🇳 Vietnamese</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({ sortBy: e.target.value as 'date' | 'title' | 'status' })}
                className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800 font-medium cursor-pointer transition-all duration-200"
              >
                <option value="date">📅 Sort by Date</option>
                <option value="title">🔤 Sort by Title</option>
                <option value="status">📊 Sort by Status</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => onFiltersChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
              className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 hover:text-gray-900 font-medium shadow-sm transition-all duration-200 flex items-center justify-center"
              title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {filters.sortOrder === 'asc' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
