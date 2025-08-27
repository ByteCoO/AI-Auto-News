// D:\2025\Code\auto-NW\my-app\app\ft-news\page.tsx
// (No significant changes needed here as it primarily sets up the context and structure)
// Shadcn-ui components are typically used within more specific UI components like FTNewsListComponent.

import FTNewsListComponent from './FTNewsListComponent';
import { supabase } from '../lib/supabase'; // Assuming this path is correct
import { FTNewsProvider } from '../contexts/FTNewsContext'; // Assuming this path is correct

// Define the shape of an FT news item, ensure consistency
export interface FTNewsItem { // Exporting for potential use in FTNewsListComponent
  id: string;
  page_url: string;
  page_title: string;
  category?: { text: string; url: string };
  headline: string;
  subheadline?: string;
  published_timestamp?: string; // Consider formatting this for display
  created_at?: string;
  publishedtimestamputc?: string; // Used for sorting
}

const PAGE_SIZE = 6;

async function getInitialFTNews(sortOrder: 'asc' | 'desc' = 'desc'): Promise<FTNewsItem[]> {
  try {
    const { data, error } = await supabase
      .from('FT_articles')
      .select('id, page_url, page_title, category, headline, subheadline, published_timestamp, created_at, publishedtimestamputc')
      .order('publishedtimestamputc', { ascending: sortOrder === 'asc' })
      .range(0, PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching initial FT news on server:', error);
      // For a production app, you might want to throw the error to be caught by Next.js error handling
      // or return an object indicating an error state to be handled by the UI.
      return []; // Returning empty array for now to prevent breaking page render
    }
    return (data as FTNewsItem[]) || [];
  } catch (err) {
    console.error('Server-side fetch error:', err);
    return [];
  }
}

export default async function FTNewsPage() {
  const initialNewsItems = await getInitialFTNews('desc');
  const initialHasMore = initialNewsItems.length === PAGE_SIZE;

  return (
    // FTNewsProvider wraps the component that will likely consume its context
    <FTNewsProvider>
      {/* You might pass initial data to your provider if it's designed to initialize its state this way:
      // initialData={{ items: initialNewsItems, hasMore: initialHasMore, sortOrder: "desc" }} */}
      
      <div className="container mx-auto min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        {/* Title styling using Tailwind.
            'tracking-tight' is a common class for headings.
            Text color will default to 'text-foreground' if your shadcn-ui theme is applied.
        */}
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground sm:mb-12 sm:text-4xl">
          Financial Times News
        </h1>

        {/* FTNewsListComponent will be responsible for displaying the news.
            This is where most of the shadcn-ui components for presentation will be used. */}
        <FTNewsListComponent
          initialNewsItems={initialNewsItems}
          initialHasMore={initialHasMore}
          initialSortOrder="desc"
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

