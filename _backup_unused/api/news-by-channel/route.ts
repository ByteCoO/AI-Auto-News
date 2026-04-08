import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get pagination from query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get keywords from the POST request body
    const { keywords } = await request.json();

    // Keywords are optional. If provided, it must be an array.
    if (keywords && !Array.isArray(keywords)) {
      return NextResponse.json({ error: 'If provided, keywords must be an array.', data: [], count: 0 }, { status: 400 });
    }

    // Start with a base query
    let query = supabase
      .from('all_latest_news')
      .select('*', { count: 'exact' });

    // Only apply the category filter if the keywords array is present and not empty
    if (keywords && keywords.length > 0) {
      query = query.in('category', keywords);
    }

    // Apply ordering and pagination
    query = query
      .order('publication_time_utc', { ascending: false })
      .range(from, to);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query failed for news-by-channel:', error);
      return NextResponse.json({ error: `Failed to fetch data. Reason: ${error.message}`, data: [], count: 0 }, { status: 500 });
    }
    
    // Transform data to a consistent format for the frontend
    const formattedData = data.map(item => ({
      id: item.id,
      source: item.source,
      title: item.title,
      url: item.url,
      category: item.category,
      publication_time_utc: item.publication_time_utc,
      original_timestamp: item.original_timestamp,
    }));

    return NextResponse.json({ data: formattedData, count: count || 0 });

  } catch (error) {
    console.error('General API route error in news-by-channel:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage, data: [], count: 0 }, { status: 500 });
  }
}