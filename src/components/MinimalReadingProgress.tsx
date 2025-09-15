'use client';

import { useEffect, useState } from 'react';

interface MinimalReadingProgressProps {
  className?: string;
}

export function MinimalReadingProgress({ className = '' }: MinimalReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const { top, height } = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
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
    <div className={`fixed top-0 left-0 w-full h-0.5 bg-gray-100 z-50 ${className}`}>
      <div
        className="h-full bg-blue-500 transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
