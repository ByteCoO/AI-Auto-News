// app/ft-news/FTNewsListComponent.tsx
'use client';

import Link from 'next/link';
import { useFTNewsContext } from '../contexts/FTNewsContext'; // Adjusted path
import { useEffect, useRef, useCallback, useState } from 'react';

// Define the shape of an FT news item, consistent with context
interface FTNewsItem {
  id: string;
  page_url: string; 
  page_title: string;
  category?: {
    text: string;
    url: string;
  };
  headline: string;
  subheadline?: string;
  published_timestamp?: string;
  publishedtimestamputc?: string;
  created_at?: string;
}

export default function FTNewsListComponent() {
  const { newsItems, loading, error, fetchInitialFTNews, fetchMoreFTNews, hasMore, manualLoadTriggered, setManualLoadTriggered } = useFTNewsContext();
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [searchValue, setSearchValue] = useState('');

  // 首次点击按钮后才允许滚动加载
  const handleManualLoadMore = useCallback(async () => {
    setManualLoadTriggered(true);
    await fetchMoreFTNews();
  }, [fetchMoreFTNews, setManualLoadTriggered]);

  useEffect(() => {
    if (!manualLoadTriggered) return;
    if (!hasMore || loading) return;
    if (!loadMoreRef.current) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        fetchMoreFTNews();
      }
    });
    observer.current.observe(loadMoreRef.current);
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [manualLoadTriggered, hasMore, loading, fetchMoreFTNews]);

  if (loading && newsItems.length === 0) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-900 flex flex-col justify-center items-center p-4">
        <p className="text-red-500 text-xl">Error loading news: {error}</p>
        <Link href="/" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Go Home
        </Link>
      </div>
    );
  }

  if (newsItems.length === 0) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-900 flex flex-col justify-center items-center p-4">
        <p className="dark:text-gray-400 text-gray-600 text-xl">No FT news articles found.</p>
        <Link href="/" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 搜索框 */}
      <div className="flex justify-center mb-4">
        <input
          type="search"
          className="border rounded px-4 py-2 w-full max-w-md dark:bg-gray-700 dark:text-white"
          placeholder="搜索标题..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
      </div>
      {newsItems
        .filter(item => item.page_title && item.page_title.toLowerCase().includes(searchValue.toLowerCase()))
        .slice() // 复制数组避免副作用
        .sort((a, b) => {
          // 按publishedtimestamputc倒序排列，若无则排后
          const dateA = a.publishedtimestamputc ? new Date(a.publishedtimestamputc).getTime() : 0;
          const dateB = b.publishedtimestamputc ? new Date(b.publishedtimestamputc).getTime() : 0;
          return dateB - dateA;
        })
        .map((item: FTNewsItem, index) => (
        <div key={`${item.id}-${index}`} className="dark:bg-gray-800 bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          {item.category && (
            <p className="text-sm text-orange-400 mb-1">
              {item.category.text}
            </p>
          )}
          <Link href={`/ft-news/${item.id}`} legacyBehavior>
            <a className="text-2xl font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors duration-200 block mb-2">
              {item.headline}
            </a>
          </Link>
          {item.subheadline && (
            <p className="dark:text-gray-400 text-gray-600 mb-3 text-md">{item.subheadline}</p>
          )}
          <div className="text-xs dark:text-gray-500 text-gray-600">
            <span className='mx-4'>发布时间: {item.created_at ? new Date(item.created_at).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) : 'N/A'}</span>
            {item.publishedtimestamputc && (
              <span className='mx-4'>UTC时间: {new Date(item.publishedtimestamputc).toLocaleString('en-GB', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
            )}
            <span className="mx-2">|</span>
            <a href={item.page_url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 underline">
              Read on FT.com
            </a>
          </div>
        </div>
      ))}
      {/* 加载更多按钮与滚动加载锚点 */}
      {!manualLoadTriggered && hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleManualLoadMore}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow-lg text-lg font-semibold transition-colors duration-150"
            disabled={loading}
          >
            {loading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
      {manualLoadTriggered && hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-8">
          <span className="dark:text-gray-400 text-gray-600">{loading ? '加载中...' : '下拉加载更多'}</span>
        </div>
      )}
      {!hasMore && (
        <div className="text-center dark:text-gray-500 text-gray-600 py-10">没有更多新闻了</div>
      )}
    </div>
  );
}