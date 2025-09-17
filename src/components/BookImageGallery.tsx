'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Book, getPrimaryCoverImage, getGalleryImages } from '@/models/book';

interface BookImageGalleryProps {
  book: Book;
}

export default function BookImageGallery({ book }: BookImageGalleryProps) {
  // Get all images and set the primary as initial
  const primaryImage = getPrimaryCoverImage(book);
  const galleryImages = getGalleryImages(book);
  const allImages = primaryImage ? [primaryImage, ...galleryImages] : galleryImages;
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = allImages[selectedImageIndex];

  if (!selectedImage) return null;

  return (
    <>
      {/* Main Cover Image */}
      <div className="aspect-[3/4] relative mb-6 rounded-xl overflow-hidden shadow-lg">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt || book.title}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 768px) 100vw, 400px"
          priority={selectedImageIndex === 0}
        />
        
        {/* Featured Badge */}
        {book.featured && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          </div>
        )}
        
        {/* Image Count Badge */}
        {book.images && book.images.length > 1 && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-900 bg-opacity-75 text-white">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {selectedImageIndex + 1} / {allImages.length}
            </span>
          </div>
        )}
      </div>
      
      {/* Image Gallery Thumbnails */}
      {allImages.length > 1 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Images ({allImages.length})
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {allImages.slice(0, 6).map((image, index) => (
              <div 
                key={image.id} 
                className={`aspect-square relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedImageIndex === index 
                    ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-105' 
                    : 'hover:opacity-80 hover:scale-105 bg-gray-100'
                }`}
                title={image.alt || `${book.title} - Image ${index + 1}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${book.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
            ))}
            {allImages.length > 6 && (
              <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium cursor-default">
                +{allImages.length - 6} more
              </div>
            )}
          </div>
          
          {/* Navigation Buttons for Mobile */}
          {allImages.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2 md:hidden">
              <button
                onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                disabled={selectedImageIndex === 0}
                className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                ← Prev
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                {selectedImageIndex + 1} / {allImages.length}
              </span>
              <button
                onClick={() => setSelectedImageIndex(Math.min(allImages.length - 1, selectedImageIndex + 1))}
                disabled={selectedImageIndex === allImages.length - 1}
                className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
