'use client';

import { useEffect, useState } from 'react';

interface SideReadingProgressProps {
  className?: string;
}

export function SideReadingProgress({ className = '' }: SideReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const { top, height } = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Show progress when article starts entering viewport
      setIsVisible(top < windowHeight * 0.9);
      
      if (top > windowHeight) {
        setProgress(0);
      } else if (top + height < 0) {
        setProgress(100);
      } else {
        const scrolled = Math.max(0, windowHeight - top);
        const total = height + windowHeight;
        const progressPercent = Math.min(100, (scrolled / total) * 100);
        setProgress(progressPercent);
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div 
      className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      } ${className}`}
    >
      {/* Progress Track */}
      <div className="relative w-1 h-32 bg-gray-200 rounded-full shadow-sm">
        {/* Progress Fill */}
        <div
          className="absolute top-0 w-full bg-gradient-to-b from-purple-600 to-blue-500 rounded-full transition-all duration-200 ease-out"
          style={{ height: `${progress}%` }}
        />
        
        {/* Progress Indicator Dot */}
        <div
          className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow-md transform -translate-x-1 transition-all duration-200 ease-out"
          style={{ 
            top: `${Math.max(0, Math.min(100, progress))}%`,
            transform: 'translateX(-25%) translateY(-50%)'
          }}
        />
      </div>
      
      {/* Progress Percentage */}
      <div className="mt-3 text-center">
        <span className="text-xs font-medium text-gray-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
