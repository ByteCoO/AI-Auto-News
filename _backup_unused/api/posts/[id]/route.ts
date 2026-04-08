import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}