import { supabase } from '../lib/supabase'; // 确保路径正确
import NewsList from './NewsList'; // 導入新的客戶端組件
import Link from 'next/link'; // 导入 Link 组件

// 添加这一行来强制动态渲染，确保数据总是最新的
export const dynamic = 'force-dynamic';
export const revalidate = 0; // <--- 添加这一行来禁用缓存
// console.log('[NewsPage Server] Module loaded (this logs once per server start/reload)'); // Can be noisy

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
  // console.log('[fetchInitialNews Server] Attempting to fetch initial news (page 1)...');
  try {
    // console.log('[fetchInitialNews Server] Calling Supabase...');
    const { data, error: fetchError } = await supabase
      .from('NSD')
      .select('id, created_at, News')
      .order('created_at', { ascending: false })
      .range(0, ITEMS_PER_PAGE - 1)
      .limit(ITEMS_PER_PAGE);

    // console.log('[fetchInitialNews Server] Supabase response:', { dataCount: data?.length, fetchError: fetchError });

    if (fetchError) {
      console.error("[fetchInitialNews Server] Supabase fetch error details:", fetchError);
      throw new Error(`Supabase Error: ${fetchError.message} (Hint: ${fetchError.hint})`);
    }

    // if (data && data.length > 0) {
    //     console.log(`[fetchInitialNews Server] Fetched ${data.length} initial items. First item created_at: ${data[0].created_at}`);
    // } else {
    //     console.log('[fetchInitialNews Server] Fetched 0 initial items.');
    // }

    return { news: (data as NewsItem[] || []), error: null };

  } catch (err) {
     console.error("[fetchInitialNews Server] Caught error during fetch:", err);
     return { news: [], error: err instanceof Error ? err.message : '获取初始新闻数据失败' };
  }
}

// 這是服務器組件
export default async function NewsPage() {
  // console.log(`[NewsPage Server] Component rendering start. Timestamp: ${new Date().toISOString()}`);

  // console.log('[NewsPage Server] Calling fetchInitialNews...');
  const { news: initialNews, error } = await fetchInitialNews();
  // console.log(`[NewsPage Server] Received initial data. Count: ${initialNews.length}, Error: ${error}`);
  // if (initialNews.length > 0) {
  //      console.log(`[NewsPage Server] Passing initialNews to client. First item created_at: ${initialNews[0].created_at}`);
  // }


  if (error) {
    console.error('[NewsPage Server] Rendering error component due to fetch error:', error);
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center items-center">
        <div className="text-center text-red-500 bg-red-100 p-4 rounded border border-red-300">
          <p>加载新闻时出错:</p>
          <p className="font-mono text-sm mt-2">{error}</p>
        </div>
        {/* Fixed Home Icon Link - Also shown on error page if desired */}
        <div className="fixed bottom-6 right-6 z-50"> {/* Increased bottom/right margin slightly & added z-index */}
          <Link href="/" className="block p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-150">
            {/* Replace with your actual icon, e.g., an SVG or an Image component */}
            {/* For simplicity, using a text "Home" or a simple SVG icon here. */}
            {/* If using an img tag, make sure '/path/to/icon.png' is correct and the image is in your public folder. */}
            <img src="/home_icon.svg" alt="返回主页" className="w-8 h-8" />
            {/* Example with text: <span className="text-xl">🏠</span> */}
            {/* Example with img: <img src="/path/to/your/home-icon.png" alt="返回主页" className="w-8 h-8" /> */}
          </Link>
        </div>
      </div>
    );
  }

  // console.log('[NewsPage Server] Rendering NewsList component.');
  return (
    // The outer div needs to be relative if you want z-index to work reliably across all browsers for fixed children,
    // but for simple fixed positioning, it's usually not strictly necessary.
    // className="relative min-h-screen bg-gray-50 py-8 px-4"
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">新闻中心</h1>
        {/* 传递给客户端组件 */}
        <NewsList initialNews={initialNews} />
      </div>

      {/* Fixed Home Icon Link */}
      <div className="fixed bottom-6 right-6 z-50"> {/* Increased bottom/right margin slightly & added z-index */}
        <Link href="/" className="block p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-150">
          {/* 
            Replace with your actual icon. 
            Ensure '/your_icon_name.svg' or '/your_icon_name.png' is in your `public` directory.
          */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
          </svg>
          {/* Or use your image:
          <img src="/path/to/your/icon.png" alt="返回主页" className="w-8 h-8" /> 
          Make sure the path is correct and the image is in the `public` folder.
          For example, if your icon is `public/home_icon.png`, use `src="/home_icon.png"`
          */}
        </Link>
      </div>
    </div>
  );
}