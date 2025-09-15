'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  target?: string; // CSS selector for the target element to track
  className?: string;
}

export default function ReadingProgress({ 
  target = 'article', 
  className = '' 
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const targetElement = document.querySelector(target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;

      // Calculate how much of the element has been scrolled past
      if (elementTop > windowHeight) {
        // Element hasn't entered viewport yet
        setProgress(0);
      } else if (elementTop + elementHeight < 0) {
        // Element has completely passed viewport
        setProgress(100);
      } else {
        // Element is partially or fully in viewport
        const scrolled = Math.max(0, windowHeight - elementTop);
        const total = elementHeight + windowHeight;
        const progressPercent = Math.min(100, (scrolled / total) * 100);
        setProgress(progressPercent);
      }
    };

    // Update on mount
    updateProgress();

    // Add scroll listener
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [target]);

  return (
    <div 
      className={`fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 ${className}`}
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
