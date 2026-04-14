import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'top';
  const category = searchParams.get('category') || 'all';
  const queryStr = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '0');
  const limit = parseInt(searchParams.get('limit') || '10');

  const from = page * limit;
  const to = from + limit - 1;

  let query = supabase.from('business_insights').select('*', { count: 'exact' });

  if (category !== 'all') query = query.eq('category', category);
  if (queryStr) query = query.or(`problem_statement.ilike.%${queryStr}%,solution_idea.ilike.%${queryStr}%`);
  
  if (sort === 'new') {
    query = query.order('created_beijing', { ascending: false });
  } else {
    query = query.order('score', { ascending: false });
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    count,
    hasMore: count ? (to < count - 1) : false
  });
}
