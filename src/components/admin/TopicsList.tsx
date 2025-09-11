import React from 'react';
import { Topic } from '@/models/topic';

interface TopicWithCount extends Topic {
  subTopicsCount: number;
}

interface TopicsListProps {
  topics: TopicWithCount[];
  selectedTopic: TopicWithCount | null;
  onTopicSelect: (topic: TopicWithCount) => void;
  onTopicEdit: (topic: TopicWithCount) => void;
  onTopicDelete: (topic: TopicWithCount) => void;
  onAddTopic: () => void;
}

export default function TopicsList({
  topics,
  selectedTopic,
  onTopicSelect,
  onTopicEdit,
  onTopicDelete,
  onAddTopic
}: TopicsListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Topics ({topics.length})</h3>
        <button
          onClick={onAddTopic}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Add Topic
        </button>
      </div>

      <div className="space-y-3">
        {topics.map((topic) => (
          <div
            key={topic._id?.toString()}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedTopic?._id?.toString() === topic._id?.toString()
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTopicSelect(topic)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span 
                  className="text-2xl p-2 rounded-lg"
                  style={{ backgroundColor: topic.color + '20' }}
                >
                  {topic.icon}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                  <p className="text-sm text-gray-500">
                    {topic.subTopicsCount} subtopic{topic.subTopicsCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  topic.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {topic.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTopicEdit(topic);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit topic"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTopicDelete(topic);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete topic"
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

        {topics.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-gray-500">No topics yet</p>
            <button
              onClick={onAddTopic}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Create your first topic
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
