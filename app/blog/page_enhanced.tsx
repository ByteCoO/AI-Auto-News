import { Metadata } from 'next';
import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import CompactTTSPlayer from '@/app/components/CompactTTSPlayer';
import { generateListPageMetadata } from '@/app/templates/ListPageTemplate';
import { generateBreadcrumbStructuredData, StructuredDataScript } from '@/app/components/SEOTemplate';
import { calculateReadingTime, truncateDescription } from '@/app/utils/seoUtils';

// Enhanced metadata with better keywords
export const metadata: Metadata = generateListPageMetadata({
  title: "Game Visioning Blog - AI, Gaming & Tech Insights",
  description: "Explore cutting-edge articles on artificial intelligence, gaming industry analysis, and emerging technology trends. Expert insights and comprehensive resources for tech enthusiasts.",
  currentPage: 1,
  canonical: "/blog",
});

// Enhanced Post interface with additional fields
export interface Post {
  id: number;
  created_at: string;
  updated_at?: string;
  title: string;
  slug: string;
  content: string | null;
  content_cn: string | null;
  excerpt: string | null;
  summary?: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category: string | null;
  tags: string[] | null;
  status: string | null;
  youtube_url: string | null;
  source: string | null;
  author?: string | null;
  reading_time?: number;
  view_count?: number;
  featured?: boolean;
}

// Enhanced data fetching with better error handling and caching
const getPosts = async (): Promise<Array<Post>> => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        view_count,
        featured
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(50); // Limit for better performance

    if (error) {
      console.error('Error fetching posts:', error.message);
      return [];
    }

    // Calculate reading time for posts that don't have it
    const enhancedPosts = posts?.map(post => ({
      ...post,
      reading_time: post.reading_time || (post.content ? calculateReadingTime(post.content) : 5),
      excerpt: post.excerpt || (post.content ? truncateDescription(post.content, 150) : 'Read more...'),
    })) || [];

    return enhancedPosts;
  } catch (error) {
    console.error('Unexpected error fetching posts:', error);
    return [];
  }
};

// Enhanced Filter Component
const BlogFilters: React.FC<{
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ categories, selectedCategory, onCategoryChange }) => (
  <div className="mb-6 flex flex-wrap gap-2">
    <button
      onClick={() => onCategoryChange('all')}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        selectedCategory === 'all'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      All ({categories.length})
    </button>
    {categories.map(category => (
      <button
        key={category}
        onClick={() => onCategoryChange(category)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === category
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

// Enhanced Article Card with better accessibility and features
const EnhancedArticleCard: React.FC<{ post: Post }> = ({ post }) => {
  const readingTime = post.reading_time || 5;
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute top-4 left-4 z-10 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          ⭐ Featured
        </div>
      )}

      {/* Image with optimized loading */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.cover_image_url || '/placeholder-blog.jpg'}
          alt={post.cover_image_alt || `Cover image for ${post.title}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={post.featured}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-6">
        {/* Category and Reading Time */}
        <div className="flex justify-between items-center mb-3">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {post.category || 'General'}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            📖 {readingTime} min read
          </span>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.slug || post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="mb-4 text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {post.excerpt || 'Read this article to learn more...'}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <span>{post.author || post.source || 'Game Visioning'}</span>
            <span className="mx-2">•</span>
            <time dateTime={post.created_at}>{formattedDate}</time>
          </div>

          <div className="flex items-center space-x-2">
            {/* View count */}
            {post.view_count && (
              <span className="text-xs text-gray-500 flex items-center">
                👁️ {post.view_count}
              </span>
            )}
            
            {/* TTS Player */}
            <CompactTTSPlayer 
              postId={post.id.toString()} 
              englishText={post.content} 
              chineseText={post.content_cn} 
            />
          </div>
        </div>
      </div>
    </article>
  );
};

// Loading skeleton component
const ArticleCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-300" />
    <div className="p-6">
      <div className="flex justify-between items-center mb-3">
        <div className="h-4 bg-gray-300 rounded w-20" />
        <div className="h-4 bg-gray-300 rounded w-16" />
      </div>
      <div className="h-6 bg-gray-300 rounded mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-300 rounded w-3/4" />
      </div>
      <div className="flex space-x-2 mb-4">
        <div className="h-6 bg-gray-300 rounded w-16" />
        <div className="h-6 bg-gray-300 rounded w-20" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-300 rounded w-24" />
        <div className="h-4 bg-gray-300 rounded w-16" />
      </div>
    </div>
  </div>
);

// Enhanced Blog Page Component
export default async function EnhancedBlogPage() {
  const posts = await getPosts();
  
  // Extract unique categories
  const categories = Array.from(new Set(
    posts
      .map(post => post.category)
      .filter((category): category is string => category !== null)
  ));

  // Separate featured and regular posts
  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  // Generate structured data
  const breadcrumbLD = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ]);

  const enhancedBlogLD = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://visionong.dpdns.org/blog',
    name: 'Game Visioning Blog',
    description: 'AI, Gaming & Technology Insights',
    url: 'https://visionong.dpdns.org/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Game Visioning',
      logo: {
        '@type': 'ImageObject',
        url: 'https://visionong.dpdns.org/logo.png',
      },
    },
    inLanguage: 'en-US',
    about: [
      'Artificial Intelligence',
      'Gaming Industry',
      'Technology Trends',
      'Software Development',
      'Market Analysis'
    ],
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 10).map((post, index) => ({
        '@type': 'BlogPosting',
        position: index + 1,
        headline: post.title,
        description: post.excerpt || post.summary,
        url: `https://visionong.dpdns.org/blog/${post.slug || post.id}`,
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        author: {
          '@type': 'Organization',
          name: post.author || 'Game Visioning',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Game Visioning',
        },
        image: post.cover_image_url,
        articleSection: post.category,
        keywords: post.tags?.join(', '),
        wordCount: post.content?.length || 0,
        timeRequired: `PT${post.reading_time || 5}M`,
      })),
    },
  };

  return (
    <>
      <StructuredDataScript data={breadcrumbLD} />
      <StructuredDataScript data={enhancedBlogLD} />
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 dark:text-gray-100" aria-current="page">Blog</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI, Gaming & Tech Insights
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover cutting-edge articles, expert analysis, and comprehensive resources 
              covering artificial intelligence, gaming industry trends, and emerging technologies.
            </p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {posts.length} articles • Updated daily
            </div>
          </header>

          {/* Featured Posts Section */}
          {featuredPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                ⭐ Featured Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredPosts.slice(0, 3).map((post) => (
                  <EnhancedArticleCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* All Articles Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Latest Articles
              </h2>
              
              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">View:</span>
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-2 text-blue-600 bg-blue-50 rounded transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Articles Grid */}
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            }>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <EnhancedArticleCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Articles Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We're working on adding new content. Please check back later.
                  </p>
                  <Link 
                    href="/" 
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              )}
            </Suspense>
          </section>

          {/* Load More Button */}
          {posts.length >= 50 && (
            <div className="text-center mt-12">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}