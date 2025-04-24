import { supabase } from '../lib/supabase'; // 确保路径正确
import NewsList from './NewsList'; // 導入新的客戶端組件

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
  // 移除未使用的 context 和 content
  // context: string | null;
  // content: string | null;
}

const ITEMS_PER_PAGE = 10; // 與 NewsList.tsx 保持一致

// 更新 fetchNews 以獲取第一頁數據
async function fetchInitialNews(): Promise<{ news: NewsItem[]; error: string | null }> {
  try {
    const { data, error: fetchError } = await supabase
      .from('NSD')
      .select('id, created_at, News')
      .order('created_at', { ascending: false })
      .range(0, ITEMS_PER_PAGE - 1); // 只獲取第一頁

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      throw new Error(`Supabase Error: ${fetchError.message} (Hint: ${fetchError.hint})`);
    }

    return { news: (data as NewsItem[] || []), error: null };

  } catch (err) {
     console.error("Error fetching initial news:", err);
     return { news: [], error: err instanceof Error ? err.message : '获取初始新闻数据失败' };
  }
}

// 這是服務器組件，不需要 'use client'
export default async function NewsPage() {
  // 在服務器端直接獲取初始數據
  const { news: initialNews, error } = await fetchInitialNews();

  // 處理錯誤狀態
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center items-center">
        <div className="text-center text-red-500 bg-red-100 p-4 rounded border border-red-300">
          <p>加载新闻时出错:</p>
          <p className="font-mono text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // 使用 NewsList 組件渲染列表，並傳入初始數據
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">新闻中心</h1>
        <NewsList initialNews={initialNews} />
      </div>
    </div>
  );
}