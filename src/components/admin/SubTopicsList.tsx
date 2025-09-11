import React from 'react';
import { SubTopic } from '@/models/topic';

interface SubTopicsListProps {
  subtopics: SubTopic[];
  topicName?: string;
  onSubTopicEdit: (subtopic: SubTopic) => void;
  onSubTopicDelete: (subtopic: SubTopic) => void;
  onAddSubTopic: () => void;
  hasSelectedTopic: boolean;
  isLoading?: boolean;
}

export default function SubTopicsList({
  subtopics,
  topicName,
  onSubTopicEdit,
  onSubTopicDelete,
  onAddSubTopic,
  hasSelectedTopic,
  isLoading = false
}: SubTopicsListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Subtopics {hasSelectedTopic && `(${subtopics.length})`}
        </h3>
        {hasSelectedTopic && (
          <button
            onClick={onAddSubTopic}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Add Subtopic
          </button>
        )}
      </div>

      {hasSelectedTopic ? (
        isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {subtopics.map((subtopic) => (
            <div
              key={subtopic._id?.toString()}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{subtopic.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{subtopic.name}</h4>
                    {subtopic.description && (
                      <p className="text-sm text-gray-500">{subtopic.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    subtopic.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subtopic.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onSubTopicEdit(subtopic)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Edit subtopic"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onSubTopicDelete(subtopic)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete subtopic"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {subtopics.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No subtopics for &quot;{topicName}&quot;</p>
              <button
                onClick={onAddSubTopic}
                className="mt-2 text-green-600 hover:text-green-800 text-sm"
              >
                Add first subtopic
              </button>
            </div>
          )}
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-gray-500">Select a topic to view its subtopics</p>
        </div>
      )}
    </div>
  );
}
