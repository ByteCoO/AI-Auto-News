// app/ft-news/page.tsx
import FTNewsListComponent from './FTNewsListComponent';
import { supabase } from '../lib/supabase';
import { FTNewsProvider } from '../contexts/FTNewsContext'; // Import the provider

// Define the shape of an FT news item, ensure consistency
interface FTNewsItem {
  id: string;
  page_url: string;
  page_title: string;
  category?: { text: string; url: string };
  headline: string;
  subheadline?: string;
  published_timestamp?: string;
  created_at?: string;
  publishedtimestamputc?: string;
}

const PAGE_SIZE = 6; // Consistent with context, or make it configurable

async function getInitialFTNews(sortOrder: 'asc' | 'desc' = 'desc'): Promise<FTNewsItem[]> {
  // This logic is adapted from fetchInitialFTNews in FTNewsContext
  // but runs on the server.
  try {
    const { data, error } = await supabase
      .from('FT_articles')
      .select('id, page_url, page_title, category, headline, subheadline, published_timestamp, created_at, publishedtimestamputc')
      .order('publishedtimestamputc', { ascending: sortOrder === 'asc' })
      .range(0, PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching initial FT news on server:', error);
      throw error; // Or handle more gracefully, e.g., return empty array or error object
    }
    return (data as FTNewsItem[]) || [];
  } catch (err) {
    console.error('Server-side fetch error:', err);
    return []; // Return empty on error to prevent breaking page render
  }
}

export default async function FTNewsPage() {
  // Fetch initial news data on the server.
  // The default sort order can be 'desc' or fetched from searchParams if needed later
  const initialNewsItems = await getInitialFTNews('desc');
  const initialHasMore = initialNewsItems.length === PAGE_SIZE;
  
  return (
    <FTNewsProvider> {/* Wrap with Provider */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-10 dark:text-white">Financial Times News</h1>
        <FTNewsListComponent
          initialNewsItems={initialNewsItems}
          initialHasMore={initialHasMore}
          initialSortOrder="desc" // Pass the initial sort order
        />
      </div>
    </FTNewsProvider>
  );
}

// Optional: Add metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Financial Times News | Latest Updates',
    description: 'Browse the latest news articles from the Financial Times, updated regularly.',
  };
}