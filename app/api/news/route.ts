// D:\2025\Code\auto-NW\my-app\app\api\news\route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // 确保这是最新推荐的库，如果是新项目，可能是 @supabase/ssr
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

// 建议将环境变量的名称定义为常量，以避免在多处使用字符串时发生拼写错误
const SUPABASE_URL_ENV_VAR = 'NEXT_PUBLIC_SUPABASE_URL';
const SUPABASE_ANON_KEY_ENV_VAR = 'NEXT_PUBLIC_SUPABASE_ANON_KEY';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  // 确保 page 和 limit 是有效的数字，且大于0
  const validPage = Math.max(1, isNaN(page) ? 1 : page);
  const validLimit = Math.max(1, isNaN(limit) ? 1 : limit);
  const offset = (validPage - 1) * validLimit;

  const cookieStore = cookies();

  // 1. 读取环境变量
  const supabaseUrl = process.env[SUPABASE_URL_ENV_VAR];
  const supabaseAnonKey = process.env[SUPABASE_ANON_KEY_ENV_VAR];

  // 2. 更严格地检查变量是否存在，并记录具体哪个变量缺失
  if (!supabaseUrl) {
    console.error(`Server configuration error: Environment variable ${SUPABASE_URL_ENV_VAR} is missing.`);
    return NextResponse.json(
      { error: `Server configuration error: ${SUPABASE_URL_ENV_VAR} is missing.` },
      { status: 500 }
    );
  }
  if (!supabaseAnonKey) {
    console.error(`Server configuration error: Environment variable ${SUPABASE_ANON_KEY_ENV_VAR} is missing.`);
    return NextResponse.json(
      { error: `Server configuration error: ${SUPABASE_ANON_KEY_ENV_VAR} is missing.` },
      { status: 500 }
    );
  }

  try {
    // 3. 初始化 Supabase 客户端
    // 注意: createRouteHandlerClient 通常用于与用户会话相关的操作。
    // 如果这个 API 路由不需要用户认证上下文，并且总是以 anon 权限运行，
    // 也可以考虑直接使用 @supabase/supabase-js 的 createClient，但这取决于你的具体需求。
    // createRouteHandlerClient 的好处是它能处理 cookies 和用户会话。
    const supabase = createRouteHandlerClient(
      { cookies: () => cookieStore }, // 第一个参数是 cookies
      {                                // 第二个参数是 Supabase client 选项
        supabaseUrl: supabaseUrl,      // 使用已验证的 supabaseUrl
        supabaseKey: supabaseAnonKey,  // 使用已验证的 supabaseAnonKey
      }
    );

    const { data, error, count } = await supabase
      .from('articles_summary')
      .select('id, published_timestamp, headline, page_title, publishedtimestamputc', { count: 'exact' })
      .order('publishedtimestamputc', { ascending: false })
      .range(offset, offset + validLimit - 1); // 使用 validLimit

    if (error) {
      console.error('Error fetching news from Supabase in API route:', error);
      // 可以根据 error.code 或 error.message 提供更具体的错误信息给客户端
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ data, count });

  } catch (e: any) { // 捕获更具体的错误类型或 any
    console.error('Unexpected error in API news route:', e);
    // 避免将完整的 e.message 暴露给客户端，除非你确定它是安全的
    return NextResponse.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
  }
}