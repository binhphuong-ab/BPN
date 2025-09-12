import React, { useState } from 'react';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Predefined icons organized by categories
const ICON_CATEGORIES = {
  folders: ['📁', '📂', '🗂️', '📋', '📄', '📃', '📝', '📊', '📈', '📉'],
  tech: ['💻', '🖥️', '⌨️', '🖱️', '💾', '💿', '📱', '⚡', '🔧', '⚙️'],
  business: ['💼', '📊', '💰', '💳', '📈', '📉', '🏢', '🏦', '💹', '📋'],
  education: ['📚', '📖', '📝', '✏️', '📐', '🎓', '🏫', '🔬', '🧪', '📏'],
  communication: ['📞', '📧', '💬', '📣', '📢', '📻', '📺', '📡', '🌐', '💻'],
  creative: ['🎨', '🖌️', '✏️', '📷', '🎬', '🎵', '🎸', '🎭', '🎪', '🎯'],
  science: ['🔬', '🧪', '⚗️', '🔭', '🌡️', '⚡', '🔋', '🧬', '🦠', '🌍'],
  general: ['⭐', '❤️', '🔥', '💡', '🎯', '🚀', '🏆', '🎪', '🎁', '🔮']
};

export default function IconSelector({ 
  selectedIcon, 
  onIconSelect, 
  placeholder = "📁",
  disabled = false 
}: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof ICON_CATEGORIES>('folders');

  const handleIconClick = (icon: string) => {
    onIconSelect(icon);
    setIsOpen(false);
  };

  const handleCategoryClick = (category: keyof typeof ICON_CATEGORIES) => {
    setActiveCategory(category);
  };

  return (
    <div className="relative">
      {/* Current Icon Display & Trigger */}
      <div 
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 cursor-pointer bg-white flex items-center justify-between ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="text-lg">
          {selectedIcon || placeholder}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Panel */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-4" onClick={(e) => e.stopPropagation()}>
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1 mb-3 border-b border-gray-200 pb-2">
              {Object.keys(ICON_CATEGORIES).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCategoryClick(category as keyof typeof ICON_CATEGORIES);
                  }}
                  className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {ICON_CATEGORIES[activeCategory].map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleIconClick(icon);
                  }}
                  className={`p-2 text-xl rounded hover:bg-gray-100 transition-colors ${
                    selectedIcon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                  }`}
                  title={`Select ${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
