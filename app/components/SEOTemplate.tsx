import { Metadata } from 'next';
import Script from 'next/script';

// SEO模板接口定义
export interface SEOTemplateProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'blog';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
  noIndex?: boolean;
  structuredData?: object;
}

// 生成通用SEO元数据
export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  canonical = '/',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author = 'Game Visioning Team',
  noIndex = false,
}: SEOTemplateProps): Metadata {
  const baseUrl = 'https://visionong.dpdns.org';
  const fullTitle = title.includes('Game Visioning') ? title : `${title} | Game Visioning`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: 'Game Visioning',
    publisher: 'Game Visioning',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${baseUrl}${canonical}`,
      siteName: 'Game Visioning',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: ogType,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@gamevisioning',
      site: '@gamevisioning',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// 新闻文章SEO模板
export function generateNewsArticleSEO({
  title,
  description,
  author = 'Game Visioning Team',
  publishedTime,
  modifiedTime,
  category = 'Technology',
  tags = [],
  canonical,
  ogImage,
}: SEOTemplateProps): Metadata {
  const keywords = [
    'news',
    'technology',
    'AI',
    'gaming',
    category.toLowerCase(),
    ...tags,
  ];

  return generateSEOMetadata({
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType: 'article',
    publishedTime,
    modifiedTime,
    author,
  });
}

// 博客文章SEO模板
export function generateBlogPostSEO({
  title,
  description,
  author = 'Game Visioning Team',
  publishedTime,
  modifiedTime,
  category = 'Blog',
  tags = [],
  canonical,
  ogImage,
}: SEOTemplateProps): Metadata {
  const keywords = [
    'blog',
    'analysis',
    'insights',
    'technology',
    'gaming',
    'AI',
    category.toLowerCase(),
    ...tags,
  ];

  return generateSEOMetadata({
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType: 'article',
    publishedTime,
    modifiedTime,
    author,
  });
}

// 分类页面SEO模板
export function generateCategorySEO({
  title,
  description,
  category,
  canonical,
  ogImage,
}: SEOTemplateProps): Metadata {
  const keywords = [
    'category',
    'news',
    'articles',
    category?.toLowerCase() || '',
    'technology',
    'gaming',
    'AI',
  ];

  return generateSEOMetadata({
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType: 'website',
  });
}

// 通用结构化数据组件
export function StructuredDataScript({ data }: { data: object }) {
  return (
    <Script
      id={`structured-data-${Math.random()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
      strategy="beforeInteractive"
    />
  );
}

// 文章结构化数据生成器
export function generateArticleStructuredData({
  title,
  description,
  author = 'Game Visioning Team',
  publishedTime,
  modifiedTime,
  canonical,
  ogImage,
  category = 'Technology',
}: SEOTemplateProps) {
  const baseUrl = 'https://visionong.dpdns.org';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}/og-image.jpg`,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Game Visioning',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${canonical}`,
    },
    articleSection: category,
    inLanguage: 'en-US',
  };
}

// 面包屑导航结构化数据生成器
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  const baseUrl = 'https://visionong.dpdns.org';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}