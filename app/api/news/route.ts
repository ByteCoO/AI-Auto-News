import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '8', 10);
  const offset = (page - 1) * limit;

  const cookieStore = cookies();

  // 1. 读取你自定义的环境变量
  const supabaseUrl = process.env.SAAS_NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.SAAS_NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 2. 检查变量是否存在，以防配置错误
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing from environment variables.');
    return NextResponse.json(
      { error: 'Server configuration error: Supabase credentials missing.' },
      { status: 500 }
    );
  }

  // 3. 将读取到的值传递给 createRouteHandlerClient
  const supabase = createRouteHandlerClient(
    { cookies: () => cookieStore }, // 第一个参数是 cookies
    {                                // 第二个参数是 Supabase client 选项
      supabaseUrl: supabaseUrl,
      supabaseKey: supabaseAnonKey,
    }
  );

  try {
    const { data, error, count } = await supabase
      .from('articles_summary')
      .select('id, published_timestamp, headline, page_title, publishedtimestamputc', { count: 'exact' })
      .order('publishedtimestamputc', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching news in API:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, count });
  } catch (e) {
    console.error('Unexpected error in API route:', e);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}