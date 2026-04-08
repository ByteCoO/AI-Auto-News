import { Metadata } from 'next';
import Script from 'next/script';

// ============================================================================
// 1. UNIFIED INTERFACE FOR ALL SEO NEEDS
// ============================================================================

export interface UnifiedSEOProps {
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
  languages?: Record<string, string>;
  slug?: string;
  source?: string;
}

// ============================================================================
// 2. MAIN SEO METADATA GENERATOR (Combines best of all components)
// ============================================================================

export function generateUnifiedSEOMetadata({
  title,
  description,
  keywords = [],
  canonical = '/',
  ogImage = '/opengraph-image',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author = 'Game Visioning Team',
  noIndex = false,
  languages,
}: UnifiedSEOProps): Metadata {
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
      languages,
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

// ============================================================================
// 3. STRUCTURED DATA COMPONENTS
// ============================================================================

export function SEOJsonLd({ data }: { data: object }) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
      strategy="beforeInteractive"
    />
  );
}

// Alias for backward compatibility
export const StructuredDataScript = SEOJsonLd;

// ============================================================================
// 4. STRUCTURED DATA GENERATORS
// ============================================================================

export function generateArticleStructuredData({
  title,
  description,
  author = 'Game Visioning Team',
  publishedTime,
  modifiedTime,
  canonical,
  ogImage,
  category = 'Technology',
}: UnifiedSEOProps) {
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

export function generateWebsiteStructuredData() {
  const baseUrl = 'https://visionong.dpdns.org';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Game Visioning',
    description: 'Your hub for AI, gaming, and technology news',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  };
}

export function generateOrganizationStructuredData() {
  const baseUrl = 'https://visionong.dpdns.org';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Game Visioning',
    url: baseUrl,
    description: 'Your hub for AI, gaming, and technology news',
    logo: {
      '@type': 'ImageObject',
      '@id': `${baseUrl}/#logo`,
      url: `${baseUrl}/logo.png`,
      width: 180,
      height: 60,
      caption: 'Game Visioning',
    },
    image: {
      '@id': `${baseUrl}/#logo`,
    },
    sameAs: [
      'https://twitter.com/gamevisioning',
      'https://github.com/gamevisioning',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    foundingDate: '2024',
    knowsAbout: [
      'Artificial Intelligence',
      'Gaming Industry', 
      'Technology News',
      'Software Development',
    ],
  };
}

// ============================================================================
// 5. SPECIALIZED SEO FUNCTIONS (From SEOTemplate.tsx)
// ============================================================================

export function generateCategorySEO(category: string, description?: string): Metadata {
  return generateUnifiedSEOMetadata({
    title: `${category} News & Updates`,
    description: description || `Stay up to date with the latest ${category.toLowerCase()} news, analysis, and insights from Game Visioning.`,
    canonical: `/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
    keywords: [category, 'news', 'updates', 'analysis', 'gaming', 'technology'],
    ogType: 'website',
  });
}

export function generateNewsSEO({
  title,
  description,
  author,
  publishedTime,
  category,
  slug,
  source,
}: UnifiedSEOProps): Metadata {
  return generateUnifiedSEOMetadata({
    title,
    description,
    canonical: `/news/${slug}`,
    author,
    publishedTime,
    category,
    keywords: ['news', category || 'technology', 'gaming', source || 'Game Visioning'].filter(Boolean),
    ogType: 'article',
  });
}

// ============================================================================
// 6. COMBINED STRUCTURED DATA COMPONENT (From SEOOptimized.tsx)
// ============================================================================

export function UnifiedStructuredData() {
  return (
    <>
      <SEOJsonLd data={generateWebsiteStructuredData()} />
      <SEOJsonLd data={generateOrganizationStructuredData()} />
      <SEOJsonLd data={generateBreadcrumbStructuredData([
        { name: 'Home', url: '/' }
      ])} />
    </>
  );
}

// ============================================================================
// 7. BACKWARD COMPATIBILITY EXPORTS
// ============================================================================

// For apps using old SEOOptimized component
export const generateSEOMetadata = generateUnifiedSEOMetadata;
export const StructuredData = UnifiedStructuredData;

// For apps using old SEOTemplate component  
export type SEOTemplateProps = UnifiedSEOProps;