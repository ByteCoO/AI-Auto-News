import { Metadata } from 'next';
import Script from 'next/script';

interface SEOOptimizedProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: object;
}

export function generateSEOMetadata({
  title = 'Game Visioning: Your Hub for AI, Gaming, and Tech News',
  description = 'Explore the latest in AI, gaming, and technology. Game Visioning delivers daily news, in-depth analysis, and a vibrant community for tech enthusiasts.',
  canonical = '/',
  ogImage = '/og-image.jpg',
  noIndex = false,
}: SEOOptimizedProps): Metadata {
  const baseUrl = 'https://visionong.dpdns.org';
  
  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
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
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
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

export function StructuredData() {
  const baseUrl = 'https://visionong.dpdns.org';
  
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
    ],
  };

  const websiteJsonLd = {
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

  const organizationJsonLd = {
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

  return (
    <>
      <SEOJsonLd data={websiteJsonLd} />
      <SEOJsonLd data={organizationJsonLd} />
      <SEOJsonLd data={breadcrumbJsonLd} />
    </>
  );
}