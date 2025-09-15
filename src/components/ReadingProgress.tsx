'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  readTime?: number;
  className?: string;
}

export function ReadingProgress({ readTime, className = '' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const remainingTime = readTime && progress > 0 
    ? Math.ceil((readTime * (100 - progress)) / 100)
    : readTime;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className={`fixed right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Main Progress Container */}
        <div className="relative">
          {/* Progress Track */}
          <div className="w-1.5 h-40 bg-gray-200/70 rounded-full backdrop-blur-sm shadow-sm">
            {/* Progress Fill */}
            <div
              className="absolute top-0 w-full bg-gradient-to-b from-purple-600 via-blue-600 to-blue-500 rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ height: `${progress}%` }}
            />
          </div>
          
          {/* Progress Indicator */}
          <div
            className={`absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-lg transform transition-all duration-300 ease-out ${
              isHovered ? 'scale-125' : 'scale-100'
            }`}
            style={{ 
              top: `${Math.max(0, Math.min(100, progress))}%`,
              left: '50%',
              transform: `translateX(-50%) translateY(-50%) scale(${isHovered ? 1.25 : 1})`
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0.5 bg-blue-500 rounded-full opacity-30" />
          </div>
        </div>

        {/* Info Panel - appears on hover */}
        <div 
          className={`absolute right-8 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-lg p-3 shadow-lg min-w-[120px]">
            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-gray-900">
                {Math.round(progress)}%
              </div>
              
              {readTime && (
                <div className="text-xs text-gray-600">
                  {progress >= 95 ? (
                    <span className="text-green-600 font-medium">✓ Complete</span>
                  ) : remainingTime && remainingTime > 0 ? (
                    <span>{remainingTime} min left</span>
                  ) : (
                    <span>{readTime} min read</span>
                  )}
                </div>
              )}
              
              {/* Back to top button */}
              {progress > 20 && (
                <button
                  onClick={scrollToTop}
                  className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                >
                  ↑ Back to top
                </button>
              )}
            </div>
          </div>
          
          {/* Arrow pointing to progress bar */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 translate-x-[-6px]">
            <div className="w-0 h-0 border-t-4 border-b-4 border-r-6 border-transparent border-r-white/95" />
          </div>
        </div>
      </div>
    </div>
  );
}
