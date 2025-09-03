import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

// This option forces the route to be dynamic, ensuring it fetches fresh data on every request.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Start with a base query
    let query = supabase
      .from('all_latest_news')
      .select('*', { count: 'exact' });

    // If a specific source is requested, add a case-insensitive filter
    if (source) {
      query = query.ilike('source', `%${source}%`);
    }

    // Apply ordering and pagination to the query
    query = query
      .order('publication_time_utc', { ascending: false })
      .range(from, to);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query failed:', error);
      // Provide a more specific error message if possible
      const userFriendlyError = `Failed to fetch data from Supabase. Reason: ${error.message}`;
      return NextResponse.json({ error: userFriendlyError, data: [], count: 0 }, { status: 500 });
    }
    
    // Transform data to a consistent camelCase format for the frontend
    const camelCaseData = data.map(item => ({
      id: item.id,
      source: item.source,
      title: item.title,
      url: item.url,
      timestamp: item.original_timestamp, // Used by MultiSourceNews for original time
      publicationTimeUTC: item.publication_time_utc, // Used by MultiSourceNews for display
      headline: item.title, // Generic headline
      // Fields for LatestNews compatibility
      published_timestamp: item.original_timestamp,
      page_title: item.title,
      publishedtimestamputc: item.publication_time_utc,
      created_at: item.created_at,
      rawPublicationTimeUTC: item.publication_time_utc,
    }));

    return NextResponse.json({ data: camelCaseData, count: count || 0 });

  } catch (error) {
    console.error('General API route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred on the server.';
    return NextResponse.json({ error: errorMessage, data: [], count: 0 }, { status: 500 });
  }
}