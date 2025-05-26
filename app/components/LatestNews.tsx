'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface NewsItem {
  id: string;
  published_timestamp: string;
  headline?: string;
  page_title?: string;
  publishedtimestamputc?: string;
  created_at?: string; // Add created_at property
}

interface GroupedNews {
  [date: string]: NewsItem[];
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'YYYY-MM-DD';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Error Date';
  }
};

const ITEMS_PER_PAGE = 8;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function LatestNews() {
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  // 新增：控制首次点击后再启用滚动加载
  const [manualLoadDone, setManualLoadDone] = useState(false);

  const fetchNewsFromApi = useCallback(async (page: number, retries = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/news?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      const { data, count } = await response.json();
      
      // 确保数据按时间戳降序排序
      const sortedData = (data || []).sort((a: NewsItem, b: NewsItem) => 
        new Date(b.published_timestamp).getTime() - new Date(a.published_timestamp).getTime()
      );

      setNewsItems(prevItems => page === 1 ? sortedData : [...prevItems, ...sortedData]);
      if (count !== undefined) {
        setTotalItems(count);
      }
      setCurrentPage(page);
      setRetryCount(0); // 重置重试计数
    } catch (err) {
      console.error('Error fetching news:', err);
      if (retries < MAX_RETRIES) {
        setTimeout(() => {
          fetchNewsFromApi(page, retries + 1);
        }, RETRY_DELAY * (retries + 1));
        return;
      }
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setRetryCount(retries);
    } finally {
      setLoading(false);
      if (!initialLoadComplete) {
        setInitialLoadComplete(true);
      }
    }
  }, [initialLoadComplete]);

  useEffect(() => {
    fetchNewsFromApi(1);
  }, [fetchNewsFromApi]);

  // 修改loadMoreItems，首次点击时设置manualLoadDone
  const loadMoreItems = useCallback(() => {
    if (!loading && newsItems.length < totalItems) {
      fetchNewsFromApi(currentPage + 1);
      if (!manualLoadDone) setManualLoadDone(true);
    }
  }, [loading, newsItems.length, totalItems, currentPage, fetchNewsFromApi, manualLoadDone]);

  // 启用无限滚动（仅在manualLoadDone为true时生效）
  useEffect(() => {
    if (!manualLoadDone) return;
    const handleScroll = () => {
      if (initialLoadComplete &&
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
        if (!loading && newsItems.length < totalItems) {
          loadMoreItems();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, newsItems.length, totalItems, loadMoreItems, initialLoadComplete, manualLoadDone]);

  const groupedVisibleNews = useMemo(() => {
    const grouped = newsItems.reduce((acc, item) => {
      // 使用 created_at 进行日期分组
      const dateKey = formatDate(item.publishedtimestamputc || item.published_timestamp); 
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {} as GroupedNews);

    // 对每个日期组内的新闻按 created_at (或备选的 published_timestamp) 排序
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) => 
        new Date(b.created_at || b.published_timestamp).getTime() - 
        new Date(a.created_at || a.published_timestamp).getTime()
      );
    });

    return grouped;
  }, [newsItems]);

  const sortedVisibleDates = useMemo(() => {
    // 按日期键（基于 created_at）降序排序
    return Object.keys(groupedVisibleNews).sort((a, b) => {
      // 为了正确比较，我们需要从 groupedVisibleNews 中获取实际的日期对象进行比较
      // 假设 groupedVisibleNews[a] 和 groupedVisibleNews[b] 至少有一个元素
      const dateA = new Date(groupedVisibleNews[a][0].publishedtimestamputc || groupedVisibleNews[a][0].published_timestamp);
      const dateB = new Date(groupedVisibleNews[b][0].publishedtimestamputc || groupedVisibleNews[b][0].published_timestamp);
      return dateB.getTime() - dateA.getTime();
    });
  }, [groupedVisibleNews]);

  const canLoadMore = newsItems.length < totalItems;

  if (loading && newsItems.length === 0) {
    return (
      <div className="py-8 dark:bg-zinc-800 bg-gray-100 dark:text-gray-200 text-gray-900 min-h-screen">
        <div className="container mx-auto px-4 w-full max-w-3xl text-center py-20">
          <div
            className="inline-block h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-solid dark:border-white border-gray-900 dark:border-r-transparent border-r-transparent"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 dark:bg-zinc-800 bg-gray-100 dark:text-gray-200 text-gray-900 min-h-screen">
        <div className="container mx-auto px-4 w-full max-w-3xl text-center py-10">
          <p className="text-red-500">
            Error loading news: {error}
            {retryCount > 0 && ` (Retry attempt ${retryCount}/${MAX_RETRIES})`}
          </p>
        </div>
      </div>
    );
  }

  if (!loading && newsItems.length === 0 && initialLoadComplete) {
    return (
      <div className="py-8 dark:bg-zinc-800 bg-gray-100 dark:text-gray-200 text-gray-900 min-h-screen">
        <div className="container mx-auto px-4 w-full max-w-3xl text-center py-10">
           <p className="dark:text-gray-400 text-gray-600 text-lg">No news items to display currently.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 dark:bg-zinc-800 bg-gray-100 dark:text-gray-200 text-gray-900 min-h-screen">
      <div className="container mx-auto px-4 w-full max-w-3xl">
        {sortedVisibleDates.length > 0 && sortedVisibleDates.map(dateKey => (
          <div key={dateKey} className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white text-gray-900">
              {/* 使用 created_at (或备选的 published_timestamp) 显示日期 */}
              Show Latest Daily Selection ({formatDate(groupedVisibleNews[dateKey][0].publishedtimestamputc || groupedVisibleNews[dateKey][0].published_timestamp)})
            </h2>
            
            <ul className="space-y-2 list-none p-0 m-0">
              {groupedVisibleNews[dateKey].map((item) => (
                <li key={item.id} className="text-base sm:text-lg leading-relaxed">
                  <Link
                    href={`/ft-news/${item.id}`}
                    className="dark:text-gray-200 text-gray-800 dark:hover:text-orange-400 hover:text-orange-600 transition-colors duration-150 group block py-1.5 px-2 rounded dark:hover:bg-zinc-700 hover:bg-gray-200"
                  >
                    <span className="select-none mr-2 sm:mr-3" aria-hidden="true">•</span>
                    <span className="group-hover:underline">
                      {item.headline || item.page_title || '无标题'}
                      {/* 日期已在标题显示，可选择性移除这里的日期显示 */}
                      {/* {item.published_timestamp && (
                        <span className="ml-1">
                          - ({formatDate(item.published_timestamp)})
                        </span>
                      )} */}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {loading && newsItems.length > 0 && ( // 显示加载中，即使用户已看到部分数据
          <div className="text-center py-8">
            <div
              className="inline-block h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-solid dark:border-white border-gray-900 dark:border-r-transparent border-r-transparent"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {/* 只在未手动加载过时显示按钮 */}
        {!loading && canLoadMore && !manualLoadDone && (
          <div className="text-center mt-8 mb-4">
            <button
              onClick={loadMoreItems}
              className="px-6 py-2.5 sm:px-8 sm:py-3 dark:bg-gray-700 bg-gray-200 dark:text-white text-gray-900 rounded-md dark:hover:bg-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-150 text-sm sm:text-base font-medium"
            >
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
}