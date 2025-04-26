import { supabase } from '../lib/supabase'; // 确保路径正确
import NewsList from './NewsList'; // 導入新的客戶端組件

// 添加这一行来强制动态渲染，确保数据总是最新的
export const dynamic = 'force-dynamic';
export const revalidate = 0; // <--- 添加这一行来禁用缓存
console.log('[NewsPage Server] Module loaded (this logs once per server start/reload)');

interface NewsItem {
  id: number;
  created_at: string;
  News: {
    title?: string;
    content?: string;
    age?: number;
    Name?: string;
    name?: string;
  } | null;
}

const ITEMS_PER_PAGE = 10;

// 更新 fetchNews 以獲取第一頁數據
async function fetchInitialNews(): Promise<{ news: NewsItem[]; error: string | null }> {
  console.log('[fetchInitialNews Server] Attempting to fetch initial news (page 1)...'); // <-- 添加日志
  try {
    console.log('[fetchInitialNews Server] Calling Supabase...'); // <-- 添加日志
    const { data, error: fetchError } = await supabase
      .from('NSD')
      .select('id, created_at, News')
      .order('created_at', { ascending: false })
      .range(0, ITEMS_PER_PAGE - 1)
      .limit(ITEMS_PER_PAGE);

    // <-- 添加日志: 打印 Supabase 返回的原始信息
    console.log('[fetchInitialNews Server] Supabase response:', { dataCount: data?.length, fetchError: fetchError });

    if (fetchError) {
      console.error("[fetchInitialNews Server] Supabase fetch error details:", fetchError); // <-- 打印详细错误
      throw new Error(`Supabase Error: ${fetchError.message} (Hint: ${fetchError.hint})`);
    }

     // <-- 添加日志: 打印获取到的第一条数据的时间戳（如果存在）
    if (data && data.length > 0) {
        console.log(`[fetchInitialNews Server] Fetched ${data.length} initial items. First item created_at: ${data[0].created_at}`);
    } else {
        console.log('[fetchInitialNews Server] Fetched 0 initial items.');
    }

    return { news: (data as NewsItem[] || []), error: null };

  } catch (err) {
     console.error("[fetchInitialNews Server] Caught error during fetch:", err); // <-- 添加日志
     return { news: [], error: err instanceof Error ? err.message : '获取初始新闻数据失败' };
  }
}

// 這是服務器組件
export default async function NewsPage() {
  // <-- 添加日志: 确认服务器组件在每次请求时运行
  console.log(`[NewsPage Server] Component rendering start. Timestamp: ${new Date().toISOString()}`);

  console.log('[NewsPage Server] Calling fetchInitialNews...'); // <-- 添加日志
  const { news: initialNews, error } = await fetchInitialNews();
  // <-- 添加日志: 确认从 fetchInitialNews 收到的结果
  console.log(`[NewsPage Server] Received initial data. Count: ${initialNews.length}, Error: ${error}`);
  // <-- 添加日志: 打印即将传递给客户端组件的第一条数据的时间戳（如果存在）
  if (initialNews.length > 0) {
       console.log(`[NewsPage Server] Passing initialNews to client. First item created_at: ${initialNews[0].created_at}`);
  }


  if (error) {
    console.error('[NewsPage Server] Rendering error component due to fetch error:', error); // <-- 添加日志
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center items-center">
        <div className="text-center text-red-500 bg-red-100 p-4 rounded border border-red-300">
          <p>加载新闻时出错:</p>
          <p className="font-mono text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  console.log('[NewsPage Server] Rendering NewsList component.'); // <-- 添加日志
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">新闻中心</h1>
        {/* 传递给客户端组件 */}
        <NewsList initialNews={initialNews} />
      </div>
    </div>
  );
} 