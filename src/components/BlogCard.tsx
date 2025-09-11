import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/models';
import { formatDistanceToNow } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
  showExcerpt?: boolean;
  className?: string;
}

export default function BlogCard({ 
  post, 
  showExcerpt = true, 
  className = '' 
}: BlogCardProps) {
  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Featured Image */}
      {post.image && (
        <div className="relative h-48 overflow-hidden">
          <Link href={`/blog/${post.slug}`}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {/* Language indicator */}
            <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
              post.language === 'Vietnamese' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {post.language === 'Vietnamese' ? '🇻🇳 VI' : '🇺🇸 EN'}
            </span>
            
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          {post.readTime && (
            <span className="text-gray-500 text-sm">
              {post.readTime} min read
            </span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
            {post.title}
          </h2>
        </Link>

        {showExcerpt && post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>By {post.author}</span>
            <span>
              {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {post.views && post.views > 0 && (
            <span className="flex items-center space-x-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{post.views}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
