'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePosts } from '@/hooks/usePosts';
import { useTopics } from '@/hooks/useTopics';
import { useBooks } from '@/hooks/useBooks';
import { useBookGenres } from '@/hooks/useBookGenres';

// Component imports
import AdminLayout from '@/components/admin/AdminLayout';
import PostsStats from '@/components/admin/PostsStats';
import PostsFilters from '@/components/admin/PostsFilters';
import BulkActionsBar from '@/components/admin/BulkActionsBar';
import PostsTable from '@/components/admin/PostsTable';
import EmptyPostsState from '@/components/admin/EmptyPostsState';
import TopicsList from '@/components/admin/TopicsList';
import SubTopicsList from '@/components/admin/SubTopicsList';
import TopicForm from '@/components/admin/TopicForm';
import SubTopicForm from '@/components/admin/SubTopicForm';
import TopicPreview from '@/components/admin/TopicPreview';
import BooksStats from '@/components/admin/BooksStats';
import BooksFilters from '@/components/admin/BooksFilters';
import BooksBulkActions from '@/components/admin/BooksBulkActions';
import BooksTable from '@/components/admin/BooksTable';
import EmptyBooksState from '@/components/admin/EmptyBooksState';
import BookGenresList from '@/components/admin/BookGenresList';
import SubGenresList from '@/components/admin/SubGenresList';
import BookGenreForm from '@/components/admin/BookGenreForm';
import SubGenreForm from '@/components/admin/SubGenreForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Tab = 'posts' | 'topics' | 'books' | 'bookgenres';

function AdminDashboard() {
  // Check URL parameters for tab
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialTab = searchParams?.get('tab') as Tab || 'posts';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  
  // Custom hooks for managing state and logic
  const postsHook = usePosts();
  const topicsHook = useTopics();
  const booksHook = useBooks();
  const bookGenresHook = useBookGenres();

  const hasSearchOrFilters = !!(postsHook.filters.search || 
    postsHook.filters.status !== 'all' || 
    postsHook.filters.language !== 'all');

  const hasBooksSearchOrFilters = !!(booksHook.filters.search ||
    booksHook.filters.language !== 'all' ||
    booksHook.filters.type !== 'all');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your blog posts and content</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/blog"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                View Blog
              </Link>
              {activeTab === 'books' ? (
                <Link
                  href="/admin/books/new"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Add New Book
                </Link>
              ) : activeTab === 'bookgenres' ? (
                <button
                  onClick={() => bookGenresHook.openBookGenreForm()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Add Book Genre
                </button>
              ) : (
                <Link
                  href="/admin/new"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Create New Post
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>All Posts</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    {postsHook.filteredPosts.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('topics')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'topics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Topic Management</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    {topicsHook.topics.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('books')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'books'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Library Books</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    {booksHook.books.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('bookgenres')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'bookgenres'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Book Genres</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    {bookGenresHook.bookGenres.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div>
                {/* Posts Stats */}
                <PostsStats posts={postsHook.posts} />

                {/* Posts Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <PostsFilters
                    filters={postsHook.filters}
                    onFiltersChange={postsHook.updateFilters}
                    postsCount={postsHook.posts.length}
                    filteredCount={postsHook.filteredPosts.length}
                  />

                  <BulkActionsBar
                    selectedCount={postsHook.selectedPosts.length}
                    onClearSelection={postsHook.clearSelection}
                    onBulkPublish={() => postsHook.bulkPublish(true)}
                    onBulkUnpublish={() => postsHook.bulkPublish(false)}
                    onBulkDelete={postsHook.bulkDelete}
                  />

                  {postsHook.loading ? (
                    <LoadingSpinner />
                  ) : postsHook.filteredPosts.length > 0 ? (
                    <PostsTable
                      posts={postsHook.filteredPosts}
                      selectedPosts={postsHook.selectedPosts}
                      onSelectAll={postsHook.selectAll}
                      onSelectPost={postsHook.selectPost}
                      onTogglePublish={postsHook.togglePublish}
                      onDeletePost={postsHook.deletePost}
                    />
                  ) : (
                    <EmptyPostsState hasFilters={hasSearchOrFilters} />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'topics' && (
              <div key="topics-tab">
                {topicsHook.loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Topics List */}
                    <TopicsList
                      topics={topicsHook.topics}
                      selectedTopic={topicsHook.selectedTopic}
                      onTopicSelect={topicsHook.setSelectedTopic}
                      onTopicEdit={topicsHook.openTopicForm}
                      onTopicDelete={topicsHook.deleteTopic}
                      onAddTopic={() => topicsHook.openTopicForm()}
                    />

                    {/* Subtopics List */}
                    <SubTopicsList
                      key={topicsHook.selectedTopic?._id?.toString() || 'no-topic'}
                      subtopics={topicsHook.subtopics}
                      topicName={topicsHook.selectedTopic?.name}
                      onSubTopicEdit={topicsHook.openSubTopicForm}
                      onSubTopicDelete={topicsHook.deleteSubTopic}
                      onAddSubTopic={() => topicsHook.openSubTopicForm()}
                      hasSelectedTopic={!!topicsHook.selectedTopic}
                      isLoading={topicsHook.subtopicsLoading}
                    />

                    {/* Forms and Preview Column */}
                    <div className="space-y-6">
                      {/* Topic Form */}
                      {topicsHook.showTopicForm && (
                        <TopicForm
                          formData={topicsHook.topicFormData}
                          onFormDataChange={topicsHook.updateTopicForm}
                          onSubmit={topicsHook.editingTopic ? topicsHook.updateTopic : topicsHook.createTopic}
                          onCancel={topicsHook.closeForms}
                          isEditing={!!topicsHook.editingTopic}
                        />
                      )}

                      {/* SubTopic Form */}
                      {topicsHook.showSubTopicForm && topicsHook.selectedTopic && (
                        <SubTopicForm
                          formData={topicsHook.subTopicFormData}
                          onFormDataChange={topicsHook.updateSubTopicForm}
                          onSubmit={topicsHook.editingSubTopic ? topicsHook.updateSubTopic : topicsHook.createSubTopic}
                          onCancel={topicsHook.closeForms}
                          isEditing={!!topicsHook.editingSubTopic}
                          topicName={topicsHook.selectedTopic.name}
                        />
                      )}

                      {/* Topic Preview */}
                      {topicsHook.selectedTopic && !topicsHook.showTopicForm && !topicsHook.showSubTopicForm && (
                        <TopicPreview 
                          key={topicsHook.selectedTopic._id?.toString()} 
                          topic={topicsHook.selectedTopic} 
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'books' && (
              <div>
                {/* Books Stats */}
                <BooksStats books={booksHook.books} />

                {/* Books Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <BooksFilters
                    filters={booksHook.filters}
                    onFiltersChange={booksHook.updateFilters}
                    booksCount={booksHook.books.length}
                    filteredCount={booksHook.filteredBooks.length}
                  />

                  <BooksBulkActions
                    selectedCount={booksHook.selectedBooks.length}
                    onClearSelection={booksHook.clearSelection}
                    onBulkFeature={() => booksHook.bulkToggleFeatured(true)}
                    onBulkUnfeature={() => booksHook.bulkToggleFeatured(false)}
                    onBulkDelete={booksHook.bulkDelete}
                  />

                  {booksHook.loading ? (
                    <LoadingSpinner />
                  ) : booksHook.filteredBooks.length > 0 ? (
                    <BooksTable
                      books={booksHook.filteredBooks}
                      selectedBooks={booksHook.selectedBooks}
                      onSelectAll={booksHook.selectAll}
                      onSelectBook={booksHook.selectBook}
                      onToggleFeatured={booksHook.toggleFeatured}
                      onDeleteBook={booksHook.deleteBook}
                    />
                  ) : (
                    <EmptyBooksState hasFilters={hasBooksSearchOrFilters} />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookgenres' && (
              <div key="bookgenres-tab">
                {bookGenresHook.loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Book Genres List */}
                    <BookGenresList
                      bookGenres={bookGenresHook.bookGenres}
                      selectedBookGenre={bookGenresHook.selectedBookGenre}
                      onBookGenreSelect={bookGenresHook.setSelectedBookGenre}
                      onBookGenreEdit={bookGenresHook.openBookGenreForm}
                      onBookGenreDelete={bookGenresHook.deleteBookGenre}
                      onAddBookGenre={() => bookGenresHook.openBookGenreForm()}
                    />

                    {/* Subgenres List */}
                    <SubGenresList
                      key={bookGenresHook.selectedBookGenre?._id?.toString() || 'no-genre'}
                      subGenres={bookGenresHook.subGenres}
                      genreName={bookGenresHook.selectedBookGenre?.name}
                      onSubGenreEdit={bookGenresHook.openSubGenreForm}
                      onSubGenreDelete={bookGenresHook.deleteSubGenre}
                      onAddSubGenre={() => bookGenresHook.openSubGenreForm()}
                      hasSelectedGenre={!!bookGenresHook.selectedBookGenre}
                      isLoading={bookGenresHook.subGenresLoading}
                    />

                    {/* Forms Column */}
                    <div className="space-y-6">
                      {/* BookGenre Form */}
                      {bookGenresHook.showBookGenreForm && (
                        <BookGenreForm
                          formData={bookGenresHook.bookGenreFormData}
                          onFormDataChange={bookGenresHook.updateBookGenreForm}
                          onSubmit={bookGenresHook.editingBookGenre ? bookGenresHook.updateBookGenre : bookGenresHook.createBookGenre}
                          onCancel={bookGenresHook.closeForms}
                          isEditing={!!bookGenresHook.editingBookGenre}
                        />
                      )}

                      {/* SubGenre Form */}
                      {bookGenresHook.showSubGenreForm && bookGenresHook.selectedBookGenre && (
                        <SubGenreForm
                          formData={bookGenresHook.subGenreFormData}
                          onFormDataChange={bookGenresHook.updateSubGenreForm}
                          onSubmit={bookGenresHook.editingSubGenre ? bookGenresHook.updateSubGenre : bookGenresHook.createSubGenre}
                          onCancel={bookGenresHook.closeForms}
                          isEditing={!!bookGenresHook.editingSubGenre}
                          genreName={bookGenresHook.selectedBookGenre.name}
                        />
                      )}

                      {/* Empty state when no forms are shown */}
                      {!bookGenresHook.showBookGenreForm && !bookGenresHook.showSubGenreForm && (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                          <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Book Genre Management</h3>
                          <p className="text-gray-500 mb-4">
                            Create and organize book genres and their subgenres to categorize your library.
                          </p>
                          <div className="space-y-2">
                            <button
                              onClick={() => bookGenresHook.openBookGenreForm()}
                              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Create New Genre
                            </button>
                            {bookGenresHook.selectedBookGenre && (
                              <button
                                onClick={() => bookGenresHook.openSubGenreForm()}
                                className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                              >
                                Add Subgenre to &quot;{bookGenresHook.selectedBookGenre.name}&quot;
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
