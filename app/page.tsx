// app/page.tsx
import MultiSourceNews, { RawNewsItemFromDb, SourceDisplayDetail, NewsItem as ComponentNewsItem } from './components/MultiSourceNews';
import LatestNews from './components/LatestNews';
import SEOHome from './components/Seo_Home';


import { Metadata } from 'next';

// Interface for news items, consistent with LatestNews.tsx and /api/news response
interface NewsItem {
  id: string;
  published_timestamp: string; // From original API if available
  headline?: string;
  page_title?: string;
  publishedtimestamputc?: string; // Main field for publication date (ISO string ideally from API)
  created_at?: string;            // Another potential date field
  title?: string;                 // Can be same as headline, used by MultiSourceNews processing
  url?: string;                   // URL for MultiSourceNews items or ft-news link
  source?: string;                // Source identifier string
  rawPublicationTimeUTC?: string; // Store original UTC timestamp for JSON-LD
  // publicationTimeUTC field is the formatted string from formatPublicationTime, kept for MultiSourceNews display
  publicationTimeUTC?: string;
}

interface LatestNewsData {
  newsItems: NewsItem[];
  totalItems: number;
}

function formatPublicationTime(utcTimestamp: string): string {
  if (!utcTimestamp) return 'N/A';
  try {
    const date = new Date(utcTimestamp);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const month = monthNames[date.getUTCMonth()];
    return `${hours}:${minutes} ${day} ${month}`;
  } catch (e) {
    console.error("Error formatting date:", utcTimestamp, e);
    return 'Error Date';
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const siteName = "Game Visiong";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: 'Game Visioning: Unbiased News & In-Depth Analysis',
  description: 'Get real-time, unbiased news from multiple trusted sources. We cover technology, finance, business, and politics with expert insights and in-depth analysis. Your source for a complete worldview.',
  alternates: {
    canonical: `${baseUrl}/`,
  },
  openGraph: {
    title: 'Game Visioning: Unbiased News & In-Depth Analysis',
    description: 'Get real-time, unbiased news from multiple trusted sources. We cover technology, finance, business, and politics with expert insights and in-depth analysis.',
    url: `${baseUrl}/`,
    siteName: siteName,
    images: [{ url: `${baseUrl}/default-og-image.png`, width: 1200, height: 630, alt: `${siteName} Homepage` }],
    locale: 'en_US',
    type: 'website',
  },
};

// Fetch initial data for the LatestNews component (first page)
const LATEST_NEWS_ITEMS_PER_PAGE = 8; // Consistent with LatestNews.tsx
async function getInitialLatestNewsData(): Promise<LatestNewsData> {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/news?page=1&limit=${LATEST_NEWS_ITEMS_PER_PAGE}&sourceType=latest`; // Added sourceType to differentiate if needed
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch initial latest news: ${res.status} ${res.statusText}. Response: ${errorText}`);
      return { newsItems: [], totalItems: 0 };
    }
    const { data, count } = await res.json();

    const transformedData = (data || []).map((apiItem: any): NewsItem => ({
      id: apiItem.id ? apiItem.id.toString() : `fallback-${Math.random()}`,
      published_timestamp: apiItem.published_timestamp,
      headline: apiItem.headline,
      page_title: apiItem.page_title,
      publishedtimestamputc: apiItem.publishedtimestamputc,
      rawPublicationTimeUTC: apiItem.publishedtimestamputc, // Store for JSON-LD
      created_at: apiItem.created_at,
      title: apiItem.title || apiItem.headline, // Ensure title is present
      url: apiItem.url || `${baseUrl}/ft-news/${apiItem.id}`, // Fallback or specific URL
      source: apiItem.source,
    }));
    return { newsItems: transformedData, totalItems: count || 0 };
  } catch (error) {
    console.error("Error fetching or processing initial latest news:", error);
    return { newsItems: [], totalItems: 0 };
  }
}

import { supabase } from '@/lib/supabaseClient'; // Import supabase client directly

// Define a minimal config for data fetching in page.tsx
const PAGE_TARGET_SOURCES_CONFIG = [
  { key: 'bloomberg', name: 'Bloomberg' },
  { key: 'ft', name: 'FT' },
  { key: 'reuters', name: 'Reuters' },
];

// This function now fetches data DIRECTLY from Supabase on the server-side.
async function getInitialMultiSourceData(): Promise<Record<string, { items: ComponentNewsItem[], page: number, hasMore: boolean, isLoading: boolean }>> {
  const initialNewsData: Record<string, any> = {};
  const itemsPerPage = 10;

  for (const config of PAGE_TARGET_SOURCES_CONFIG) {
    try {
      // Direct database query instead of fetch()
      const { data, error, count } = await supabase
        .from('all_latest_news')
        .select('*', { count: 'exact' })
        .ilike('source', `%${config.name}%`)
        .order('publication_time_utc', { ascending: false })
        .range(0, itemsPerPage - 1);

      if (error) {
        throw new Error(`Supabase query failed for ${config.name}: ${error.message}`);
      }

      // Transform data for the component
      const items: ComponentNewsItem[] = (data || []).map((item: any) => ({
        id: String(item.id),
        headline: item.title,
        url: item.url,
        timestamp: item.original_timestamp || 'N/A',
        publicationTimeUTC: item.publication_time_utc,
        source: item.source, // Add the 'source' field that was missing
      }));
      
      initialNewsData[config.name] = {
        items: items,
        page: 1,
        hasMore: items.length < (count || 0),
        isLoading: false,
      };

    } catch (error) {
      console.error(`Error fetching initial data for ${config.name} directly from Supabase:`, error);
      // Provide a default empty state on error to prevent crashing the page
      initialNewsData[config.name] = { items: [], page: 1, hasMore: false, isLoading: false };
    }
  }
  return initialNewsData;
}


export default async function Home() {
  // Define sourceDisplayDetails
  const multiSourceDisplayDetails: SourceDisplayDetail[] = [
    {
      name: 'Bloomberg',
      logoLetter: 'B',
      updateLabel: 'Updated Recently',
      cardBgColor: 'bg-gray-800 dark:bg-gray-700',
      cardCustomStyle: { height: '400px', overflowY: 'auto' }
    },
    {
      name: 'FT',
      logoLetter: 'F', 
      updateLabel: 'Articles', 
      cardCustomStyle: { height: '400px', overflowY: 'auto' }
    },
    {
      name: 'Reuters',
      logoLetter: 'R', 
      updateLabel: 'Updates', 
      cardCustomStyle: { height: '400px', overflowY: 'auto' }
    }
  ];

  // Fetch initial data directly, and for latest news
  const [initialMultiSourceData, latestNewsInitialData] = await Promise.all([
    getInitialMultiSourceData(),
    getInitialLatestNewsData()
  ]);

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: `${baseUrl}/`,
    name: siteName,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: `${baseUrl}/`,
    name: siteName,
    logo: `${baseUrl}/logo.png`,
  };
  
  const allNewsArticlesLd: object[] = [];

  // JSON-LD for LatestNews
  {/* 
  if (latestNewsInitialData && latestNewsInitialData.newsItems) {
    latestNewsInitialData.newsItems.forEach(item => {
      if (item.id && (item.headline || item.page_title) && item.rawPublicationTimeUTC) {
        allNewsArticlesLd.push({
          '@type': 'NewsArticle',
          mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/ft-news/${item.id}` },
          headline: item.headline || item.page_title,
          datePublished: new Date(item.rawPublicationTimeUTC).toISOString(),
          dateModified: new Date(item.rawPublicationTimeUTC).toISOString(), // Or use a separate modified date if available
          author: { '@type': 'Organization', name: siteName },
          publisher: {
            '@type': 'Organization', name: siteName,
            logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
          },
          // Example image (replace with actual logic if images are associated)
          // image: { '@type': 'ImageObject', url: `${baseUrl}/images/news/${item.id}.jpg`, width: 1200, height: 630 },
        });
      }
    });
  }
*/}
  // Flatten the initial data from all sources into a single array for JSON-LD
  const allInitialMultiSourceItems = Object.values(initialMultiSourceData).flatMap(source => source.items);

  // JSON-LD for MultiSourceNews
  allInitialMultiSourceItems.forEach(item => {
    // Ensure item.url and item.publication_time_utc are valid before creating LD
    if (item.headline && item.url && item.publicationTimeUTC) {
      try {
        const datePublished = new Date(item.publicationTimeUTC).toISOString();
        allNewsArticlesLd.push({
          '@type': 'NewsArticle',
          mainEntityOfPage: { '@type': 'WebPage', '@id': item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}` },
          headline: item.headline,
          datePublished: datePublished,
          dateModified: datePublished, // Assuming same as published, or use a different field if available
          author: { '@type': 'Organization', name: item.source || siteName },
          publisher: {
            '@type': 'Organization', name: siteName,
            logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
          },
        });
      } catch (e) {
        console.error("Error creating JSON-LD for multi-source item:", item, e);
      }
    }
  });

  const jsonLdNewsGraph = allNewsArticlesLd.length > 0 ? {
    '@context': 'https://schema.org',
    '@graph': allNewsArticlesLd
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      {jsonLdNewsGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdNewsGraph) }}
        />
      )}
      <main className="min-h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div>
        <SEOHome/>
          {/* Channels Section */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href="/Channels?category=Market%20%26%20Finance" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Market & Finance</h3>
                <p className="text-gray-600 dark:text-gray-400">Latest market news and financial analysis.</p>
              </a>
              <a href="/Channels?category=Business" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Business</h3>
                <p className="text-gray-600 dark:text-gray-400">In-depth business coverage and market trends.</p>
              </a>
              <a href="/Channels?category=Politics%20%26%20Policy" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Politics & Policy</h3>
                <p className="text-gray-600 dark:text-gray-400">Insights on government and global policy.</p>
              </a>
              <a href="/Channels?category=Technology" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Technology</h3>
                <p className="text-gray-600 dark:text-gray-400">The latest news and analysis in tech.</p>
              </a>
            </div>
          </section>

         
          
          <h1 className="text-3xl font-bold text-center mb-6 mt-8">Multi-Source News Feed</h1>
          
          <MultiSourceNews 
            initialNewsData={initialMultiSourceData} 
            sourceDisplayDetails={multiSourceDisplayDetails} 
          />

        
          
          

         <LatestNews 
            initialNewsItems={latestNewsInitialData.newsItems} 
            initialTotalItems={latestNewsInitialData.totalItems}
            initialPage={1} 
          />
        </div>
      </main>
    </>
  );
}