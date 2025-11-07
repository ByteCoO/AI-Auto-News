// app/ft-news/[id]/page.tsx
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { generateNewsPageMetadata } from '@/app/templates/NewsPageTemplate';
import { generateBreadcrumbStructuredData, StructuredDataScript } from '@/app/components/SEOTemplate';
import { truncateDescription } from '@/app/utils/seoUtils';

// Interfaces (assuming these are accurate from your existing code)
interface FTArticleBodyItem {
  type: string;
  content: string | { text: string; url?: string }[];
}

interface FTNewsDetail {
  id: string;
  page_url: string; // Used for canonical URL and JSON-LD
  page_title: string; // Can be used if different from headline for title tag
  category?: {
    text: string;
    url: string;
  };
  headline: string;
  subheadline?: string;
  main_image?: {
    altText?: string | null;
    caption?: string;
    url?: string;
  };
  authors?: {
    name: string;
    url?: string; // Added optional URL for author schema
  }[];
  publishedtimestamputc?: string;
  updated_at?: string;
  body?: FTArticleBodyItem[];
}

// Server-side data fetching function (re-using and ensuring it's robust)
async function fetchFTNewsDetailServerSide(id: string): Promise<FTNewsDetail | null> {
  try {
    const { data, error } = await supabase
      .from('FT_articles')
      .select('id, page_url, page_title, category, headline, subheadline, main_image, authors, publishedtimestamputc, updated_at, body')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Standard Supabase "not found"
      console.error('Supabase error fetching FT news detail in fetchFTNewsDetailServerSide:', error);
      throw new Error(`Database error: ${error.message}`); // Propagate error for server-side handling
    }
    return data as FTNewsDetail;
  } catch (err) {
    console.error('Error in fetchFTNewsDetailServerSide function:', err);
    throw err; // Re-throw to be caught by Next.js error handling
  }
}

type Props = {
  params: { id: string };
};

// 1. Implement generateMetadata for dynamic SEO tags
// 1. Implement generateMetadata for dynamic SEO tags
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const article = await fetchFTNewsDetailServerSide(id);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const description = truncateDescription(
    article.subheadline || 
    (article.body && typeof article.body[0]?.content === 'string' 
      ? article.body[0].content 
      : `Latest Financial Times analysis: ${article.headline}`),
    160
  );
  
  return generateNewsPageMetadata({
    title: article.headline,
    description,
    author: article.authors?.[0]?.name || 'Financial Times',
    publishedTime: article.publishedtimestamputc || new Date().toISOString(),
    modifiedTime: article.updated_at || article.publishedtimestamputc || new Date().toISOString(),
    category: article.category?.text || 'Financial News',
    tags: [
      'financial times',
      'financial news',
      'market analysis',
      article.category?.text?.toLowerCase() || 'news',
      'business'
    ],
    slug: id,
    ogImage: article.main_image?.url || '/og-image.jpg',
  });
}

// Keep the old function as fallback
async function generateMetadataFallback(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const article = await fetchFTNewsDetailServerSide(id);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const description = article.subheadline || (article.body && typeof article.body[0]?.content === 'string' ? article.body[0].content.substring(0, 160).trim() + '...' : `Read the article: ${article.headline}`);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: article.headline, // The layout will add "| Game Visioning"
    description: description,
    alternates: {
      canonical: article.page_url,
    },
    openGraph: {
      title: article.headline,
      description: description,
      url: article.page_url,
      siteName: 'Game Visioning',
      images: article.main_image?.url ? 
        [
          {
            url: article.main_image.url,
            alt: article.main_image.altText || article.headline,
          },
          ...previousImages
        ] : 
        [...previousImages],
      locale: 'en_US', 
      type: 'article',
      publishedTime: article.publishedtimestamputc,
      modifiedTime: article.updated_at || article.publishedtimestamputc,
      authors: article.authors?.map(author => author.name),
    },
  };
}

// 2. Modify the page component to be an async Server Component
export default async function FTNewsDetailPage({ params }: Props) {
  const id = params.id;
  const article = await fetchFTNewsDetailServerSide(id);

  if (!article) {
    notFound(); // Renders the not-found.tsx page
  }

  const {
    headline,
    subheadline,
    category,
    authors,
    publishedtimestamputc,
    main_image,
    body,
    page_url, // For JSON-LD
    updated_at // For JSON-LD
  } = article;

  // 3. Structured Data (JSON-LD)
  const siteName = 'Game Visioning';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://visionong.dpdns.org';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': page_url || `${baseUrl}/ft-news/${id}`,
    },
    headline: headline,
    description: subheadline || (body && typeof body[0]?.content === 'string' ? body[0].content.substring(0, 250).trim() + '...' : undefined),
    image: main_image?.url ? [main_image.url] : undefined,
    datePublished: publishedtimestamputc,
    dateModified: updated_at || publishedtimestamputc,
    author: authors?.map(author => ({
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    })),
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };

  // 生成结构化数据
  const breadcrumbLD = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Financial News', url: '/ft-news' },
    { name: article.category?.text || 'News', url: article.category?.url || '/ft-news' },
    { name: article.headline, url: `/ft-news/${id}` },
  ]);

  const enhancedJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `https://visionong.dpdns.org/ft-news/${id}`,
    headline: article.headline,
    description: article.subheadline || `Latest Financial Times analysis: ${article.headline}`,
    image: article.main_image?.url ? {
      '@type': 'ImageObject',
      url: article.main_image.url,
      caption: article.main_image.caption,
      alt: article.main_image.altText || article.headline,
    } : undefined,
    author: article.authors?.map(author => ({
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    })) || [{
      '@type': 'Organization',
      name: 'Financial Times',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Game Visioning',
      logo: {
        '@type': 'ImageObject',
        url: 'https://visionong.dpdns.org/logo.png',
      },
    },
    datePublished: article.publishedtimestamputc,
    dateModified: article.updated_at || article.publishedtimestamputc,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://visionong.dpdns.org/ft-news/${id}`,
    },
    articleSection: article.category?.text || 'Financial News',
    inLanguage: 'en-US',
    isBasedOn: article.page_url,
    url: article.page_url,
  };

  return (
    <>
      <StructuredDataScript data={enhancedJsonLd} />
      <StructuredDataScript data={breadcrumbLD} />
      
      <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-gray-200 text-gray-900 py-10 px-4">
        {/* 面包屑导航 */}
        <div className="container mx-auto max-w-3xl mb-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="/" className="hover:text-blue-600">Home</a></li>
              <li><span className="mx-2">/</span></li>
              <li><a href="/ft-news" className="hover:text-blue-600">Financial News</a></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 dark:text-gray-100" aria-current="page">
                {article.headline}
              </li>
            </ol>
          </nav>
        </div>
        <div className="container mx-auto max-w-3xl dark:bg-gray-800 bg-gray-100 p-6 sm:p-8 rounded-lg shadow-xl">
          <Link href="/ft-news" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline mb-6 inline-block">
            ← Back to FT News List
          </Link>

          {category && (
            <p className="text-sm text-orange-400 mb-2">
              {category.text}
            </p>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold dark:text-white text-gray-900 mb-3">{headline}</h1>
          {subheadline && (
            <p className="text-lg dark:text-gray-400 text-gray-600 mb-6">{subheadline}</p>
          )}

          <div className="flex flex-wrap items-center text-xs dark:text-gray-500 text-gray-600 mb-6">
            {authors && authors.length > 0 && (
              <span className="mr-3">By {authors.map(author => author.name).join(', ')}</span>
            )}
            {publishedtimestamputc && (
              <span className="mr-3">Published: {new Date(publishedtimestamputc).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>

          {main_image && main_image.url && (
            <figure className="my-6">
              <img src={main_image.url} alt={main_image.altText || headline} className="w-full h-auto rounded-md mb-2" />
              {main_image.caption && (
                <figcaption className="text-xs dark:text-gray-500 text-gray-600 italic text-center">
                  {main_image.caption}
                </figcaption>
              )}
            </figure>
          )}

          <article className="prose dark:prose-invert prose-sm sm:prose-base max-w-none dark:text-gray-300 text-gray-800 leading-relaxed space-y-4">
            {body && body.map((item, index) => {
              if (item.type === 'paragraph') {
                if (typeof item.content === 'string') {
                  return <p key={index} dangerouslySetInnerHTML={{ __html: item.content }} />; // Assuming content is safe HTML or plain text
                } else if (Array.isArray(item.content)) {
                  return (
                    <p key={index}>
                      {item.content.map((seg, segIndex) =>
                        seg.url ? (
                          <a key={segIndex} href={seg.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                            {seg.text}
                          </a>
                        ) : (
                          <span key={segIndex}>{seg.text}</span>
                        )
                      )}
                    </p>
                  );
                }
              }
              // Add handling for other body item types if they exist
              return null;
            })}
          </article>
        </div>
      </div>
    </>
  );
}