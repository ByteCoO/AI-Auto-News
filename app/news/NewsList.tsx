'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase'; // 确保路径正确

// --- > 确认或添加这个接口定义 < ---
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
// --- > 接口定义结束 < ---

interface NewsListProps {
  initialNews: NewsItem[]; // <--- 首次使用
}

const ITEMS_PER_PAGE = 10;

// 提取 fetchNews 邏輯
async function fetchNewsPage(page: number): Promise<{ news: NewsItem[]; error: string | null }> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  // <-- 添加日志 (客户端)
  console.log(`[fetchNewsPage Client] Attempting to fetch page ${page} (offset ${offset})...`);
  try {
     // <-- 添加日志 (客户端)
    console.log(`[fetchNewsPage Client] Calling Supabase for page ${page}...`);
    const { data, error: fetchError } = await supabase
      .from('NSD')
      .select('id, created_at, News')
      .order('created_at', { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    // <-- 添加日志 (客户端): 打印 Supabase 返回的原始信息
    console.log(`[fetchNewsPage Client] Supabase response for page ${page}:`, { dataCount: data?.length, fetchError: fetchError });


    if (fetchError) {
      console.error(`[fetchNewsPage Client] Supabase fetch error details for page ${page}:`, fetchError); // <-- 打印详细错误
      throw new Error(`Supabase Error: ${fetchError.message} (Hint: ${fetchError.hint})`);
    }

    // <-- 添加日志 (客户端): 打印获取到的新数据的第一条时间戳（如果存在）
    if (data && data.length > 0) {
        console.log(`[fetchNewsPage Client] Fetched ${data.length} items for page ${page}. First new item created_at: ${data[0].created_at}`);
    } else {
        console.log(`[fetchNewsPage Client] Fetched 0 items for page ${page}.`);
    }

    return { news: (data as NewsItem[] || []), error: null };

  } catch (err) {
     console.error(`[fetchNewsPage Client] Caught error fetching page ${page}:`, err); // <-- 添加日志 (客户端)
     return { news: [], error: err instanceof Error ? err.message : '获取新闻数据失败' };
  }
}

export default function NewsList({ initialNews }: NewsListProps) {
   // <-- 添加日志 (客户端): 组件渲染/重渲染时触发
  console.log('[NewsList Client] Component rendering / Re-rendering.');

  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialNews.length === ITEMS_PER_PAGE);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // <-- 添加日志 (客户端): 检查传入的 initialNews
  console.log('[NewsList Client] Received initialNews prop:', { count: initialNews.length, firstItemId: initialNews[0]?.id, firstItemDate: initialNews[0]?.created_at });


  useEffect(() => {
    // <-- 添加日志 (客户端): 确认 effect 是否因 initialNews 变化而运行
    console.log('[NewsList Client] useEffect[initialNews] triggered. Resetting state.', { initialNewsCount: initialNews.length });
    setNews(initialNews);
    setPage(2);
    setHasMore(initialNews.length === ITEMS_PER_PAGE);
    setError(null);
  }, [initialNews]); // 依赖于从服务器接收的 initialNews


  const loadMoreNews = useCallback(async () => {
    // <-- 添加日志 (客户端): 无限滚动加载开始
    console.log(`[NewsList Client] loadMoreNews called. Current state: loading=${loading}, hasMore=${hasMore}, attempting page=${page}`);
    if (loading || !hasMore) {
      console.log('[NewsList Client] loadMoreNews skipped (loading or no more items).');
      return;
    }

    setLoading(true);
    setError(null);
    console.log(`[NewsList Client] loadMoreNews: Calling fetchNewsPage(${page})...`); // <-- 添加日志
    const { news: newNews, error: fetchError } = await fetchNewsPage(page);
    // <-- 添加日志 (客户端): 无限滚动加载结果
    console.log(`[NewsList Client] loadMoreNews: Received response for page ${page}. New items count: ${newNews.length}, Error: ${fetchError}`);


    if (fetchError) {
      setError(fetchError);
    } else if (newNews.length > 0) {
      setNews((prevNews) => {
          console.log(`[NewsList Client] loadMoreNews: Appending ${newNews.length} new items to state.`); // <-- 添加日志
          return [...prevNews, ...newNews];
        });
      setPage((prevPage) => prevPage + 1);
      setHasMore(newNews.length === ITEMS_PER_PAGE);
    } else {
      console.log('[NewsList Client] loadMoreNews: No more items found, setting hasMore to false.'); // <-- 添加日志
      setHasMore(false);
    }
    setLoading(false);
  }, [page, loading, hasMore]); // 确保依赖项完整


  useEffect(() => {
    console.log('[NewsList Client] useEffect[IntersectionObserver] setting up.', { hasMore, loading });
    if (!hasMore || loading) { // Don't setup if no more items or already loading
        console.log('[NewsList Client] IntersectionObserver setup skipped.', { hasMore, loading });
        return;
    };

    const targetElement = observerRef.current;
    if (!targetElement) {
        console.log('[NewsList Client] IntersectionObserver setup skipped: target element not found.');
        return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Log detailed entry info regardless of isIntersecting
        console.log('[NewsList Client] IntersectionObserver callback triggered.', {
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            target: entry.target,
            boundingClientRect: entry.boundingClientRect,
            intersectionRect: entry.intersectionRect,
            rootBounds: entry.rootBounds
        });
        if (entry.isIntersecting) {
          console.log('[NewsList Client] IntersectionObserver: Target is intersecting, calling loadMoreNews...');
          loadMoreNews();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px'
      }
    );

    console.log('[NewsList Client] IntersectionObserver observing target:', targetElement);
    observer.observe(targetElement);

    // Cleanup function: Use the observer instance directly
    return () => {
      console.log('[NewsList Client] IntersectionObserver cleaning up for target:', targetElement);
      observer.unobserve(targetElement);
    };
    // Ensure dependencies cover all conditions affecting the observer setup/trigger
  }, [loadMoreNews, hasMore, loading]);

  return (
        <div className="space-y-6">
        {news.length > 0 ? (
            news.map((item, idx) => (
            <Link href={`/news/${item.id}`} key={`${item.id}_${item.created_at}_${idx}`} className="block bg-white rounded-lg shadow-md p-6 transition hover:shadow-lg cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {item.News?.title || '无标题'}
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2">
                {item.News?.content || '暂无内容'}
                </p>
                <div className="text-sm text-gray-500">
                发布时间: {new Date(item.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </Link>
            ))
        ) : (
            // 初始加载时，如果 initialNews 为空，这里可能会短暂显示
            // 如果是加载更多后为空，hasMore 会是 false
            <div className="text-center text-gray-500 py-10">{!hasMore && !loading ? '暂无新闻' : ''}</div>
        )}

        {/* 加載指示器和觸發加載的元素 */}
        <div ref={observerRef} className="h-10 flex justify-center items-center">
            {loading && <p className="text-gray-500">加载中...</p>}
            {/* 只有在没有加载、没有更多数据、且当前已有新闻时才显示“没有更多” */}
            {!loading && !hasMore && news.length > 0 && <p className="text-gray-500">没有更多新闻了</p>}
            {error && <p className="text-red-500">加载失败: {error}</p>}
            {/* 如果初始加载就为空，且没有在加载，也应该提示 */}
             {!loading && !hasMore && news.length === 0 && initialNews.length === 0 && <p className="text-gray-500">暂无新闻</p>}
        </div>
        </div>
    );
}