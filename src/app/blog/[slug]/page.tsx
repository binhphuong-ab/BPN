import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BlogService } from '@/lib/blog-service';
import { MarkdownPreview } from '@/components/MDEditor';
import { format } from 'date-fns';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await BlogService.getPostBySlugWithTopic(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.summary,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      ...(post.image && {
        images: [
          {
            url: post.image,
            alt: post.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      ...(post.image && {
        images: [post.image],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await BlogService.getPostBySlugWithTopic(params.slug);

  if (!post) {
    notFound();
  }

  // Get recent posts for sidebar
  const recentPosts = await BlogService.getRecentPosts(5);
  const otherRecentPosts = recentPosts.filter(p => p.slug !== post.slug);

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-12" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors font-medium">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gray-900 transition-colors font-medium">
                Blog
              </Link>
            </li>
            <li>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium truncate">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="prose prose-lg prose-gray max-w-none">
          {/* Header */}
          <header className="not-prose mb-16 pb-8 border-b border-gray-200">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-base font-bold shadow-lg">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-base">{post.author}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <time className="font-medium">
                      {format(new Date(post.publishedAt || post.createdAt), 'MMMM d, yyyy')}
                    </time>
                    {post.readTime && (
                      <>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {post.readTime} min read
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Pills inline with author section */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Topic indicator */}
                {('topic' in post && post.topic) && (
                  <span 
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium border"
                    style={{
                      backgroundColor: post.topic.color ? `${post.topic.color}15` : '#F3F4F6',
                      borderColor: post.topic.color ? `${post.topic.color}40` : '#D1D5DB',
                      color: post.topic.color || '#374151'
                    }}
                  >
                    <span className="text-sm">{post.topic.icon || '📁'}</span>
                    <span>{post.topic.name}</span>
                  </span>
                )}
                
                {/* Subtopic indicator */}
                {('subTopic' in post && post.subTopic) && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <span className="text-sm">{post.subTopic.icon || '📄'}</span>
                    <span>{post.subTopic.name}</span>
                  </span>
                )}
                
                {/* Language indicator */}
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium border ${
                  post.language === 'Vietnamese' 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <span className="text-sm">{post.language === 'Vietnamese' ? '🇻🇳' : '🇺🇸'}</span>
                  <span>{post.language === 'Vietnamese' ? 'VI' : 'EN'}</span>
                </span>
              </div>
            </div>
          </header>

          {/* Feature Image */}
          {post.image && (
            <div className="mb-12">
              <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose-content">
            <MarkdownPreview 
              content={post.content} 
              className="prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic"
            />
          </div>
        </div>
      </article>

      {/* Sidebar with recent posts */}
      {otherRecentPosts.length > 0 && (
        <aside className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="border-t border-gray-200 pt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-8">More from this blog</h3>
            <div className="space-y-8">
              {otherRecentPosts.slice(0, 3).map((recentPost) => (
                <Link
                  key={recentPost._id?.toString()}
                  href={`/blog/${recentPost.slug}`}
                  className="block group hover:bg-gray-50 rounded-lg p-4 -m-4 transition-colors"
                >
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {recentPost.title}
                    </h4>
                    {recentPost.summary && (
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {recentPost.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <time>
                        {format(new Date(recentPost.publishedAt || recentPost.createdAt), 'MMM d, yyyy')}
                      </time>
                      {recentPost.readTime && (
                        <>
                          <span>•</span>
                          <span>{recentPost.readTime} min read</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <span>View all posts</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
