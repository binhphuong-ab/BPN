'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressWithIndicatorProps {
  target?: string;
  readTime?: number;
  className?: string;
}

export function ReadingProgressWithIndicator({ 
  target = 'article', 
  readTime,
  className = '' 
}: ReadingProgressWithIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const targetElement = document.querySelector(target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;

      // Show indicator when user starts scrolling into the article
      setIsVisible(elementTop < windowHeight * 0.8);

      // Calculate progress
      if (elementTop > windowHeight) {
        setProgress(0);
      } else if (elementTop + elementHeight < 0) {
        setProgress(100);
      } else {
        const scrolled = Math.max(0, windowHeight - elementTop);
        const total = elementHeight + windowHeight;
        const progressPercent = Math.min(100, (scrolled / total) * 100);
        setProgress(progressPercent);
      }
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [target]);

  const remainingTime = readTime && progress > 0 
    ? Math.ceil((readTime * (100 - progress)) / 100)
    : readTime;

  return (
    <>
      {/* Progress Bar */}
      <div 
        className={`fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Reading Time Indicator */}
      {readTime && isVisible && (
        <div 
          className={`fixed top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 font-medium shadow-sm z-40 transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {progress >= 95 ? (
            <span className="text-green-600">✓ Complete</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{remainingTime} min left</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
