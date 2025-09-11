import React from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkPublish: () => void;
  onBulkUnpublish: () => void;
  onBulkDelete: () => void;
}

export default function BulkActionsBar({ 
  selectedCount, 
  onClearSelection, 
  onBulkPublish, 
  onBulkUnpublish, 
  onBulkDelete 
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-blue-800 font-medium">
            {selectedCount} post{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onBulkPublish}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            Publish
          </button>
          <button
            onClick={onBulkUnpublish}
            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
          >
            Unpublish
          </button>
          <button
            onClick={onBulkDelete}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
