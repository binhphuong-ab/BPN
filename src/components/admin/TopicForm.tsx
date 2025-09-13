import React from 'react';
import { TopicFormData } from '@/hooks/useTopics';
import { generateRandomColor } from '@/models/topic';
import { generateVietnameseSlug } from '@/utils/vietnamese-slug-generating';
import IconSelector from './IconSelector';

interface TopicFormProps {
  formData: TopicFormData;
  onFormDataChange: (data: Partial<TopicFormData>) => void;
  onSubmit: (data: TopicFormData) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
}

export default function TopicForm({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  onCancel, 
  isEditing,
  isSubmitting = false
}: TopicFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure slug is generated if empty
    const finalFormData = {
      ...formData,
      slug: formData.slug || generateVietnameseSlug(formData.name)
    };
    
    await onSubmit(finalFormData);
  };

  // Auto-generate slug when name changes (only if slug is empty or auto-generated)
  const handleNameChange = (newName: string) => {
    const newSlug = generateVietnameseSlug(newName);
    onFormDataChange({ 
      name: newName,
      // Only auto-update slug if it's empty or matches the previously generated slug
      slug: formData.slug === '' || formData.slug === generateVietnameseSlug(formData.name) ? newSlug : formData.slug
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        {isEditing ? 'Edit Topic' : 'Create New Topic'}
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Enter topic name..."
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="topic-slug" className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug *
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              id="topic-slug"
              required
              value={formData.slug}
              onChange={(e) => onFormDataChange({ slug: e.target.value })}
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
              placeholder="auto-generated-from-name"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => onFormDataChange({ slug: generateVietnameseSlug(formData.name) })}
              className="absolute right-2 top-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
              disabled={isSubmitting}
            >
              Auto
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            URL-friendly version of your topic name. Will be used in URLs.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => onFormDataChange({ description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            rows={3}
            placeholder="Optional description..."
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
          <IconSelector
            selectedIcon={formData.icon}
            onIconSelect={(icon) => onFormDataChange({ icon })}
            placeholder="📁"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => onFormDataChange({ color: e.target.value })}
              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => onFormDataChange({ color: generateRandomColor() })}
              className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded border disabled:opacity-50"
              disabled={isSubmitting}
            >
              Random
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="topicActive"
            checked={formData.isActive}
            onChange={(e) => onFormDataChange({ isActive: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <label htmlFor="topicActive" className="ml-2 text-sm text-gray-700">
            Active
          </label>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Topic' : 'Create Topic'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
