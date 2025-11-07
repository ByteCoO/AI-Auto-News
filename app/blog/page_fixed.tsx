import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import CompactTTSPlayer from '@/app/components/CompactTTSPlayer';

import { generateListPageMetadata } from '@/app/templates/ListPageTemplate';
import { generateBreadcrumbStructuredData, StructuredDataScript } from '@/app/components/SEOTemplate';

export const metadata: Metadata = generateListPageMetadata({
  title: "Game Visioning Blog - AI Content & Resources",
  description: "Explore our comprehensive collection of articles, research, and resources on Artificial Intelligence. Stay updated with the latest trends, tools, and discussions in the AI world.",
  currentPage: 1,
  canonical: "/blog",
});

// ============================================================================
// 1. TYPE DEFINITIONS
// ============================================================================

export interface Post {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  content: string | null;
  content_cn: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category: string | null;
  tags: string[] | null;
  status: string | null;
  youtube_url: string | null;
  source: string | null;
}

// ============================================================================
// 2. DATA FETCHING
// ============================================================================

const getPosts = async (): Promise<Array<Post>> => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts directly from Supabase:', error.message);
      return [];
    }

    return posts || [];
    
  } catch (error) {
    if (error instanceof Error) {
        console.error('An unexpected error occurred while fetching posts:', error.message);
    }
    return [];
  }
};

// ============================================================================
// 3. UI HELPER COMPONENTS (ICONS)
// ============================================================================

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const CubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// ============================================================================
// 4. UI COMPONENTS
// ============================================================================

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'All Content', description: 'View all collected content', href: '/blog', icon: <GridIcon />, active: true },
    { name: 'Products', description: 'AI products and tools', href: '#', icon: <CubeIcon />, active: false },
    { name: 'Papers', description: 'Academic research papers', href: '#', icon: <DocumentTextIcon />, active: false },
    { name: 'Articles', description: 'Technical articles and blogs', href: '#', icon: <BookOpenIcon />, active: false },
    { name: 'Updates', description: 'Latest news and updates', href: '#', icon: <TrendingUpIcon />, active: false },
  ];
  
  return (
    <aside className="w-full lg:w-64 lg:flex-shrink-0">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Categories</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                item.active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className={`mr-3 h-6 w-6 ${item.active ? 'text-white' : 'text-gray-500 group-hover:text-gray-600'}`}>
                {item.icon}
              </div>
              <div>
                <span className={`font-semibold ${item.active ? 'text-white' : 'text-gray-800'}`}>{item.name}</span>
                <p className={`text-xs ${item.active ? 'text-blue-100' : 'text-gray-500'}`}>{item.description}</p>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

const ArticleCard: React.FC<{ post: Post }> = ({ post }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow duration-300 overflow-hidden">
    <img 
      src={post.cover_image_url || 'https://placehold.co/600x400/0f172a/3b82f6?text=Image'} 
      alt={post.cover_image_alt || `Cover image for ${post.title}`} 
      className="w-full h-40 object-cover" 
    />
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-center mb-3 text-gray-500">
        <span className="flex items-center text-sm font-medium">
          <div className="w-4 h-4 mr-1.5"><TrendingUpIcon /></div>
          {post.category || 'General'}
        </span>
        {post.source && (
          <a 
            href={!post.source.startsWith('http') ? `https://${post.source}` : post.source} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-blue-600"
          >
            <ExternalLinkIcon />
          </a>
        )}
      </div>
      <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
        <Link href={`/blog/${post.id}`} className="hover:underline">{post.title}</Link>
      </h2>
      <p className="mb-4 text-gray-600 font-light flex-grow">{post.excerpt}</p>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">{post.source || 'N/A'}</span>
        
        <div className="flex items-center gap-2">
          <CompactTTSPlayer 
            postId={post.id.toString()} 
            englishText={post.content} 
            chineseText={post.content_cn} 
          />
          <span className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// 5. PAGE COMPONENT
// ============================================================================

export default async function BlogPage() {
  const posts = await getPosts();

  // 生成结构化数据
  const breadcrumbLD = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ]);

  const blogLD = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://visionong.dpdns.org/blog',
    name: 'Game Visioning Blog',
    description: 'AI Content & Resources',
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
      'Machine Learning',
      'Technology Trends',
      'AI Research',
      'Tech Resources',
    ],
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts?.length || 0,
      itemListElement: posts?.slice(0, 10).map((post, index) => ({
        '@type': 'BlogPosting',
        position: index + 1,
        name: post.title,
        description: post.excerpt || post.title,
        url: `https://visionong.dpdns.org/blog/${post.id}`,
        datePublished: post.created_at,
        author: {
          '@type': 'Organization',
          name: 'Game Visioning',
        },
      })) || [],
    },
  };

  return (
    <>
      <StructuredDataScript data={breadcrumbLD} />
      <StructuredDataScript data={blogLD} />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="flex flex-col lg:flex-row max-w-screen-2xl mx-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* 面包屑导航 */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="/" className="hover:text-blue-600">Home</a></li>
                <li><span className="mx-2">/</span></li>
                <li className="text-gray-900 dark:text-gray-100" aria-current="page">Blog</li>
              </ol>
            </nav>

            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">AI Content & Resources</h1>
              <p className="text-lg text-gray-600 mt-1">Discover the latest AI-related content and resources</p>
              <div className="text-sm text-gray-500 mt-2">
                {posts?.length || 0} articles available
              </div>
            </header>
          
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  <h3 className="text-xl font-semibold">No Articles Found</h3>
                  <p>There are currently no articles to display. Please check back later.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}