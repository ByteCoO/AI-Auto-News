'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase'; // 确保路径正确

// 與 page.tsx 保持一致的接口
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
  // 移除 page.tsx 中未使用的 context 和 content
}

interface NewsListProps {
  initialNews: NewsItem[];
}

const ITEMS_PER_PAGE = 10; // 每次加載的數量

// 提取 fetchNews 邏輯，使其可重用並接受分頁參數
async function fetchNewsPage(page: number): Promise<{ news: NewsItem[]; error: string | null }> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  try {
    const { data, error: fetchError } = await supabase
      .from('NSD')
      .select('id, created_at, News')
      .order('created_at', { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1); // 使用 range 進行分頁

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      throw new Error(`Supabase Error: ${fetchError.message} (Hint: ${fetchError.hint})`);
    }

    return { news: (data as NewsItem[] || []), error: null };

  } catch (err) {
     console.error("Error fetching news page:", err);
     return { news: [], error: err instanceof Error ? err.message : '获取新闻数据失败' };
  }
}

export default function NewsList({ initialNews }: NewsListProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [page, setPage] = useState(2); // 從第二頁開始加載
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialNews.length === ITEMS_PER_PAGE); // 初始時判斷是否可能還有更多
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMoreNews = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);
    const { news: newNews, error: fetchError } = await fetchNewsPage(page);

    if (fetchError) {
      setError(fetchError);
    } else if (newNews.length > 0) {
      setNews((prevNews) => [...prevNews, ...newNews]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(newNews.length === ITEMS_PER_PAGE); // 如果返回的數量等於每頁數量，則可能還有更多
    } else {
      setHasMore(false); // 沒有更多數據了
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (!hasMore) return; // 如果沒有更多數據，則不設置觀察器

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreNews();
        }
      },
      { threshold: 1.0 } // 當元素完全可見時觸發
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [loadMoreNews, hasMore]);

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
        <div className="text-center text-gray-500 py-10">暂无新闻</div>
      )}

      {/* 加載指示器和觸發加載的元素 */}
      <div ref={observerRef} className="h-10 flex justify-center items-center">
        {loading && <p className="text-gray-500">加载中...</p>}
        {!loading && !hasMore && news.length > 0 && <p className="text-gray-500">没有更多新闻了</p>}
        {error && <p className="text-red-500">加载失败: {error}</p>}
      </div>
    </div>
  );
}