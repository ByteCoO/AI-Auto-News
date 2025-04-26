import { supabase } from '../../lib/supabase'; // 確保路徑正確
import Link from 'next/link'; // 導入 Link 組件
import NewsDetailClient from './NewsDetailClient'; // 导入新的客户端组件

interface NewsItem {
  id: number;
  created_at: string;
  News: {
    title?: string;
    content?: string;
    // 可以根據需要添加其他字段
  } | null;
}

async function fetchNewsDetail(id: string): Promise<NewsItem | null> {
  try {
    const { data, error: fetchError } = await supabase
      .from('NSD')
      .select('id, created_at, News')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Supabase fetch detail error:", fetchError);
      if (fetchError.code === 'PGRST116') { // PostgREST code for 'Searched item was not found'
         // 返回 null 表示未找到，讓組件處理
         return null;
      } else {
         // 對於其他錯誤，可以拋出以便 Next.js 捕獲或顯示錯誤頁面
         throw new Error(`Supabase Error: ${fetchError.message}`);
      }
    }

    // 如果 data 為空（理論上 single() 錯誤會先捕獲，但以防萬一）
    if (!data) {
      return null;
    }

    return data as NewsItem;

  } catch (err) {
     console.error("Error fetching news detail:", err);
     // 在服務器端，通常會讓錯誤冒泡，由 Next.js 處理
     // 或者你可以返回一個特定的錯誤狀態或 null
     throw err; // 重新拋出錯誤
  }
}

// 這是服務器組件，保持不变
export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const id = params?.id;

  if (!id) {
    // 可以在這裡返回一個提示無效 ID 的組件
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center items-center">
        <div className="text-center text-red-500">無效的新聞 ID。</div>
        <Link href="/news" className="mt-4 inline-block text-blue-600 hover:underline">返回新聞列表</Link>
      </div>
    );
  }

  let newsItem: NewsItem | null = null;
  let error: string | null = null;

  try {
    newsItem = await fetchNewsDetail(id);
  } catch (err) {
    error = err instanceof Error ? err.message : '獲取新聞詳情失敗';
  }

  // 處理錯誤狀態
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center items-center">
        <div className="text-center text-red-500 bg-red-100 p-4 rounded border border-red-300">
          <p>加載新聞詳情時出錯:</p>
          <p className="font-mono text-sm mt-2">{error}</p>
          <Link href="/news" className="mt-4 inline-block text-blue-600 hover:underline">返回新聞列表</Link>
        </div>
      </div>
    );
  }

  // 處理未找到新聞的狀態
  if (!newsItem) {
     return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center items-center">
        <div className="text-center text-gray-500">
           <p>未找到 ID 為 {id} 的新聞。</p>
           <Link href="/news" className="mt-4 inline-block text-blue-600 hover:underline">返回新聞列表</Link>
        </div>
      </div>
    );
  }

  // 成功獲取數據，渲染客户端组件并传递数据
  return <NewsDetailClient newsItem={newsItem} />;
}