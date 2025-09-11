import React, { memo } from 'react';
import { Topic } from '@/models/topic';

interface TopicWithCount extends Topic {
  subTopicsCount: number;
}

interface TopicPreviewProps {
  topic: TopicWithCount;
}

export default memo(function TopicPreview({ topic }: TopicPreviewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Topic Details</h4>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <span 
            className="text-3xl p-3 rounded-lg"
            style={{ backgroundColor: topic.color + '20' }}
          >
            {topic.icon}
          </span>
          <div>
            <h5 className="font-semibold text-gray-900">{topic.name}</h5>
            <p className="text-sm text-gray-500">
              Created {new Date(topic.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {topic.description && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p className="text-gray-600">{topic.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block font-medium text-gray-700">Status</label>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              topic.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {topic.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Color</label>
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: topic.color }}
              ></div>
              <span className="text-gray-600">{topic.color}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Subtopics</label>
          <p className="text-gray-600">
            {topic.subTopicsCount} subtopic{topic.subTopicsCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
});
