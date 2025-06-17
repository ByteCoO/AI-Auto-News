import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

// This option forces the route to be dynamic, ensuring it fetches fresh data on every request.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) { // Add NextRequest
  try {
    const searchParams = request.nextUrl.searchParams;
    const sourceType = searchParams.get('sourceType');

    let page, limit, from, to;

    if (sourceType === 'multi') {
      // For 'multi', fetch a larger set of recent articles across all sources
      // Let MultiSourceNews component handle the filtering by specific source
      page = 1; 
      limit = 100; // Fetch more items for 'multi' display, e.g., latest 100 across all sources
                   // Adjust this number based on how many total items you want to process client-side
      from = 0;
      to = limit - 1;
    } else {
      // For 'latest' or other types (like default when no sourceType is provided), use provided page/limit or defaults
      page = parseInt(searchParams.get('page') || '1', 10);
      limit = parseInt(searchParams.get('limit') || '10', 10); // Default limit 10 for 'latest'
      from = (page - 1) * limit;
      to = from + limit - 1;
    }

    let query = supabase
      .from('all_latest_news')
      .select('*', { count: 'exact' }) // Fetch count
      .order('publication_time_utc', { ascending: false }); // Order by publication time

    if (sourceType === 'multi') {
      query = query.in('source', ['Bloomberg', 'FT', 'Reuters']);
    }

    query = query.range(from, to); // Apply pagination

    // Placeholder for future sourceType differentiation if needed for 'all_latest_news' has been addressed by the logic above.
    // If sourceType is 'multi', we fetch a larger dataset.
    // If sourceType is 'latest' (or other/default), we use standard pagination.

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message, data: [], count: 0 }, { status: 500 });
    }

    const camelCaseData = data.map(item => ({
      id: item.id,
      source: item.source,
      title: item.title,
      url: item.url,
      // Ensure field names match what page.tsx expects for dates
      published_timestamp: item.original_timestamp, // Assuming original_timestamp is what page.tsx's published_timestamp expects
      headline: item.title, // Assuming title can serve as headline
      page_title: item.title, // Assuming title can serve as page_title
      publishedtimestamputc: item.publication_time_utc, // This is crucial for formatPublicationTime
      created_at: item.created_at, // Keep original if needed by page.tsx
      // Add any other fields page.tsx might require, like rawPublicationTimeUTC
      rawPublicationTimeUTC: item.publication_time_utc, // For JSON-LD
    }));

    // Return data and count
    return NextResponse.json({ data: camelCaseData, count: count || 0 });

  } catch (error) {
    console.error('API route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage, data: [], count: 0 }, { status: 500 });
  }
}