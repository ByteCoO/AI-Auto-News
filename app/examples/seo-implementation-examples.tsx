// 实际使用示例文件
// 这个文件展示了如何在现有页面中集成SEO模板

// ====================================
// 示例 1: 更新 app/ft-news/[id]/page.tsx
// ====================================

/*
import { Metadata } from 'next';
import { generateNewsPageMetadata } from '@/app/templates/NewsPageTemplate';
import { generateBreadcrumbStructuredData, StructuredDataScript } from '@/app/components/SEOTemplate';
import { supabase } from '@/app/lib/supabase';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: article } = await supabase
    .from('all_latest_news')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!article) {
    return { 
      title: 'Article Not Found | Game Visioning',
      description: 'The requested article could not be found.',
    };
  }

  return generateNewsPageMetadata({
    title: article.title,
    description: article.description || `Latest ${article.source} news: ${article.title}`,
    author: article.source,
    publishedTime: article.publication_time_utc,
    modifiedTime: article.publication_time_utc,
    category: 'Financial News',
    tags: [article.source.toLowerCase(), 'financial news', 'market analysis'],
    slug: params.id,
    source: article.source,
  });
}

export default async function FTNewsDetailPage({ params }: PageProps) {
  const { data: article } = await supabase
    .from('all_latest_news')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!article) {
    return <div>Article not found</div>;
  }

  const breadcrumbLD = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Financial News', url: '/ft-news' },
    { name: article.source, url: `/news/source/${article.source.toLowerCase()}` },
    { name: article.title, url: `/ft-news/${params.id}` },
  ]);

  return (
    <>
      <StructuredDataScript data={breadcrumbLD} />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li><span className="mx-2">/</span></li>
            <li><a href="/ft-news" className="hover:text-blue-600">Financial News</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 dark:text-gray-100" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
              {article.source}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={article.publication_time_utc}>
              {new Date(article.publication_time_utc).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
            <span>Source: {article.source}</span>
          </div>
        </header>

        {article.url && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              Read the full article at the original source:
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {article.url}
            </a>
          </div>
        )}
      </article>
    </>
  );
}
*/

// ====================================
// 示例 2: 更新 app/blog/page.tsx
// ====================================

/*
import { Metadata } from 'next';
import { generateListPageMetadata } from '@/app/templates/ListPageTemplate';
import { useLazyLoading } from '@/app/hooks/useSEO';

export const metadata: Metadata = generateListPageMetadata({
  title: "Game Visioning Blog - AI, Gaming & Tech Insights",
  description: "Explore in-depth articles about artificial intelligence, gaming industry trends, and cutting-edge technology insights from our expert team.",
  currentPage: 1,
  canonical: "/blog",
});

export default function BlogPage() {
  // 现有的博客页面逻辑...
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Game Visioning Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Explore in-depth articles about artificial intelligence, gaming industry trends, and cutting-edge technology insights.
        </p>
      </header>
      
      {/* 博客文章列表 */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* 博客文章项目 */}
      </div>
    </div>
  );
}
*/

// ====================================
// 示例 3: 更新 app/Channels/page.tsx
// ====================================

/*
import { Metadata } from 'next';
import { generateCategorySEO } from '@/app/components/SEOTemplate';
import { generateBreadcrumbStructuredData, StructuredDataScript } from '@/app/components/SEOTemplate';

export const metadata: Metadata = generateCategorySEO({
  title: "News Channels - Curated Content from Top Sources",
  description: "Access curated news from leading sources including Bloomberg, Financial Times, Reuters, and more. Stay informed with our comprehensive channel coverage.",
  category: "Channels",
  canonical: "/Channels",
});

export default function ChannelsPage() {
  const breadcrumbLD = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Channels', url: '/Channels' },
  ]);

  const channelsLD = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'News Channels',
    description: 'Curated news channels from top financial and technology sources',
    url: 'https://visionong.dpdns.org/Channels',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'Thing',
          name: 'Market & Finance',
          description: 'Latest market news and financial analysis',
          url: 'https://visionong.dpdns.org/Channels?category=Market%20%26%20Finance',
        },
        {
          '@type': 'Thing',
          name: 'Business',
          description: 'In-depth business coverage and market trends',
          url: 'https://visionong.dpdns.org/Channels?category=Business',
        },
        // ... 更多频道
      ],
    },
  };

  return (
    <>
      <StructuredDataScript data={breadcrumbLD} />
      <StructuredDataScript data={channelsLD} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 dark:text-gray-100" aria-current="page">Channels</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            News Channels
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Access curated news from leading sources including Bloomberg, Financial Times, Reuters, and more.
          </p>
        </header>

        {/* 现有的频道网格布局 */}
        <section className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 频道卡片 */}
          </div>
        </section>
      </div>
    </>
  );
}
*/

// ====================================
// 示例 4: 为 app/price/page.tsx 添加SEO
// ====================================

/*
import { Metadata } from 'next';
import { generateSEOMetadata } from '@/app/components/SEOTemplate';

export const metadata: Metadata = generateSEOMetadata({
  title: "Pricing Plans - Game Visioning Premium Subscriptions",
  description: "Choose the perfect Game Visioning subscription plan for your needs. Get premium access to exclusive news analysis, advanced features, and ad-free browsing.",
  keywords: ['pricing', 'subscription', 'premium', 'plans', 'news', 'analysis'],
  canonical: '/price',
  ogType: 'website',
});

export default function PricingPage() {
  const pricingLD = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Game Visioning Premium Subscription',
    description: 'Premium news analysis and exclusive content access',
    brand: {
      '@type': 'Brand',
      name: 'Game Visioning',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Monthly Plan',
        price: '9.99',
        priceCurrency: 'USD',
        priceValidUntil: '2024-12-31',
        availability: 'https://schema.org/InStock',
        url: 'https://visionong.dpdns.org/price',
      },
      {
        '@type': 'Offer',
        name: 'Annual Plan',
        price: '99.99',
        priceCurrency: 'USD',
        priceValidUntil: '2024-12-31',
        availability: 'https://schema.org/InStock',
        url: 'https://visionong.dpdns.org/price',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingLD) }}
      />
      
      {/* 现有的定价页面内容 */}
    </>
  );
}
*/

// ====================================
// 示例 5: 动态SEO使用示例
// ====================================

/*
'use client';
import { useSEO, usePagePerformance, useLazyLoading } from '@/app/hooks/useSEO';
import { useEffect, useState } from 'react';

export default function DynamicContentPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // 动态SEO更新
  useSEO({
    title: content ? `${content.title} | Game Visioning` : 'Loading... | Game Visioning',
    description: content?.description || 'Loading content...',
    canonical: '/dynamic-content',
  });

  // 性能监控
  usePagePerformance();
  
  // 懒加载
  useLazyLoading();

  useEffect(() => {
    // 模拟数据获取
    setTimeout(() => {
      setContent({
        title: 'Dynamic Content Title',
        description: 'This is dynamically loaded content with SEO optimization.',
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      
      {/* 使用懒加载的图片 */}
      <img 
        data-src="/images/dynamic-content.jpg" 
        alt="Dynamic content" 
        className="lazy-load"
      />
    </div>
  );
}
*/

export {}; // 使文件成为模块