import Link from 'next/link';
import Image from 'next/image';
import { BlogPost, BlogPostWithTopics } from '@/models';

interface BlogCardProps {
  post: BlogPost | BlogPostWithTopics;
  showSummary?: boolean;
  className?: string;
}

export default function BlogCard({ 
  post, 
  showSummary = true, 
  className = '' 
}: BlogCardProps) {
  return (
    <article 
      className={`group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${className}`}
      role="article"
      aria-labelledby={`post-title-${post.slug}`}
    >
      {/* Featured Image */}
      {post.image && (
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Link href={`/blog/${post.slug}`}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>
          {/* Overlay gradient for better text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <div className="p-6 space-y-4">
        {/* Language and Topic Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Language indicator */}
            <span className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${
              post.language === 'Vietnamese' 
                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}>
              {post.language === 'Vietnamese' ? '🇻🇳 VI' : '🇺🇸 EN'}
            </span>

            {/* Topic indicator */}
            {('topic' in post && post.topic) && (
              <span 
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold border bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors"
                style={{
                  backgroundColor: post.topic.color ? `${post.topic.color}20` : undefined,
                  borderColor: post.topic.color ? `${post.topic.color}60` : undefined,
                  color: post.topic.color || undefined
                }}
              >
                {post.topic.icon || '📁'} {post.topic.name}
              </span>
            )}
          </div>
          {post.readTime && (
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readTime} min</span>
              {/* Reading difficulty indicator */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-3 rounded-full ${
                      i < Math.min(Math.ceil((post.readTime || 0) / 3), 3)
                        ? 'bg-blue-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Title Section */}
        <Link href={`/blog/${post.slug}`} className="block group/title focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md">
          <h2 
            id={`post-title-${post.slug}`}
            className="text-xl font-bold text-gray-900 leading-tight group-hover/title:text-blue-600 transition-colors duration-200 cursor-pointer line-clamp-2"
          >
            {post.title}
          </h2>
        </Link>

        {/* Summary Section */}
        {showSummary && post.summary && (
          <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm">
            {post.summary}
          </p>
        )}

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <time className="flex items-center gap-1 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(post.publishedAt || post.createdAt).getFullYear()}
          </time>
          
          {/* Content Freshness Indicator */}
          {(() => {
            const publishDate = new Date(post.publishedAt || post.createdAt);
            const daysOld = Math.floor((Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysOld <= 7) return (
              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Fresh
              </span>
            );
            if (daysOld <= 30) return (
              <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                ⚡ Recent
              </span>
            );
            return null;
          })()}
        </div>
      </div>
    </article>
  );
}
