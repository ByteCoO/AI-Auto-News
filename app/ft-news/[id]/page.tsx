// app/ft-news/[id]/page.tsx
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

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
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const article = await fetchFTNewsDetailServerSide(id);

  if (!article) {
    // Return metadata for a "not found" state or allow notFound() in page to handle it
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for could not be found.',
    };
  }

  const description = article.subheadline || (article.body && typeof article.body[0]?.content === 'string' ? article.body[0].content.substring(0, 160).trim() + '...' : `Read the article: ${article.headline}`);

  return {
    title: `${article.headline} | FT News`, // Or use article.page_title if more appropriate
    description: description,
    canonical: article.page_url, // Assuming page_url is the canonical URL for this article
    openGraph: {
      title: article.headline,
      description: description,
      url: article.page_url,
      siteName: 'Your Site Name', // Replace with your actual site name
      images: article.main_image?.url ? [
        {
          url: article.main_image.url,
          alt: article.main_image.altText || article.headline,
        },
      ] : [],
      locale: 'en_US', // Adjust if your content is in a different language
      type: 'article',
      publishedTime: article.publishedtimestamputc,
      modifiedTime: article.updated_at || article.publishedtimestamputc,
      authors: article.authors?.map(author => author.name),
    },
    // You can add Twitter specific tags as well
    // twitter: {
    //   card: 'summary_large_image',
    //   title: article.headline,
    //   description: description,
    //   images: article.main_image?.url ? [article.main_image.url] : [],
    // },
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': page_url || `https://yourdomain.com/ft-news/${id}`, // Fallback, replace yourdomain.com
    },
    headline: headline,
    description: subheadline || (body && typeof body[0]?.content === 'string' ? body[0].content.substring(0, 250).trim() + '...' : undefined),
    image: main_image?.url ? [main_image.url] : undefined,
    datePublished: publishedtimestamputc,
    dateModified: updated_at || publishedtimestamputc,
    author: authors?.map(author => ({
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }), // Include URL if available
    })),
    publisher: {
      '@type': 'Organization',
      name: 'Your Site Name', // Replace
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdomain.com/logo.png', // Replace with your logo URL
      },
    },
  };

  return (
    <>
      {/* Add JSON-LD Script to the head effectively (Next.js handles script placement) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-gray-200 text-gray-900 py-10 px-4">
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