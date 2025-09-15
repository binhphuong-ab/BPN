'use client';

import { useEffect, useState } from 'react';

interface SimpleRightProgressProps {
  className?: string;
}

export function SimpleRightProgress({ className = '' }: SimpleRightProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const { top, height } = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      setIsVisible(top < windowHeight * 0.8);
      
      if (top > windowHeight) {
        setProgress(0);
      } else if (top + height < 0) {
        setProgress(100);
      } else {
        const scrolled = Math.max(0, windowHeight - top);
        const total = height + windowHeight;
        setProgress(Math.min(100, (scrolled / total) * 100));
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div 
      className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <div className="w-1 h-32 bg-gray-200 rounded-full">
        <div
          className="w-full bg-blue-500 rounded-full transition-all duration-150 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>
    </div>
  );
}
