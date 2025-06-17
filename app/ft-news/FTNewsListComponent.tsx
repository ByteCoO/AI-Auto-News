// app/ft-news/FTNewsListComponent.tsx
'use client';

import Link from 'next/link';
import { useFTNewsContext } from '../contexts/FTNewsContext'; // Adjusted path
import { useEffect, useRef, useCallback, useState } from 'react';

interface FTNewsItem {
  id: string;
  page_url: string;
  page_title: string;
  category?: { text: string; url: string };
  headline: string;
  subheadline?: string;
  published_timestamp?: string;
  publishedtimestamputc?: string;
  created_at?: string;
}

interface FTNewsListComponentProps {
  initialNewsItems: FTNewsItem[];
  initialHasMore: boolean;
  initialSortOrder: 'asc' | 'desc';
}

export default function FTNewsListComponent({
  initialNewsItems,
  initialHasMore,
  initialSortOrder,
}: FTNewsListComponentProps) {
  const {
    newsItems: contextNewsItems,
    setNewsItems: setContextNewsItems,
    loading,
    error,
    fetchMoreFTNews,
    hasMore: contextHasMore,
    setHasMore: setContextHasMore,
    manualLoadTriggered,
    setManualLoadTriggered,
    sortOrder: contextSortOrder,
    setSortOrder: setContextSortOrder,
    fetchInitialFTNews: contextFetchInitialFTNews,
    setPage: setContextPage,
    setLoading: setContextLoading,
  } = useFTNewsContext();

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setContextNewsItems(initialNewsItems);
    setContextHasMore(initialHasMore);setContextSortOrder(initialSortOrder);
    setContextPage(1); 
    setContextLoading(false); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNewsItems, initialHasMore, initialSortOrder]);

  const handleManualLoadMore = useCallback(async () => {
    setManualLoadTriggered(true);
    await fetchMoreFTNews();
  }, [fetchMoreFTNews, setManualLoadTriggered]);

  useEffect(() => {
    if (!manualLoadTriggered) return;
    if (!contextHasMore || loading) return;
    if (!loadMoreRef.current) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && contextHasMore) {
        fetchMoreFTNews();
      }
    });
    observer.current.observe(loadMoreRef.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [manualLoadTriggered, contextHasMore, loading, fetchMoreFTNews]);

  const handleSortChange = async (newSortOrder: 'asc' | 'desc') => {
    setContextSortOrder(newSortOrder);
    setManualLoadTriggered(false); 
  };

  const displayedNewsItems = contextNewsItems
    .filter(item => item.page_title && item.page_title.toLowerCase().includes(searchValue.toLowerCase()));

  if (loading && displayedNewsItems.length === 0 && !initialNewsItems.length) {
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
  }if (displayedNewsItems.length === 0 && !loading && !searchValue) {
     return (
      <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-900 flex flex-col justify-center items-center p-4">
        <p className="dark:text-gray-400 text-gray-600 text-xl">No FT news articles found.</p>
        {!manualLoadTriggered && contextHasMore && (
          <button
            onClick={handleManualLoadMore}
            className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow-lg text-lg font-semibold transition-colors duration-150"
          >
            Try Load More
          </button>
        )}
        <Link href="/" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Go Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-4 mb-4">
        <input
          type="search"
          className="border rounded px-4 py-2 w-full max-w-md dark:bg-gray-700 dark:text-white"
          placeholder="Search by title..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <button
          onClick={() => handleSortChange(contextSortOrder === 'asc' ? 'desc' : 'asc')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Sort: {contextSortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
        </button>
      </div>
      {displayedNewsItems.map((item: FTNewsItem, index) => (
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
          </Link>{item.subheadline && (
            <p className="dark:text-gray-400 text-gray-600 mb-3 text-md">{item.subheadline}</p>
          )}
          <div className="text-xs dark:text-gray-500 text-gray-600">
            <span className='mx-4'>Published: {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) : 'N/A'}</span>
            {item.publishedtimestamputc && (
              <span className='mx-4'>UTC Time: {new Date(item.publishedtimestamputc).toLocaleString('en-GB', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
            )}
            <span className="mx-2">|</span>
            <a href={item.page_url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 underline">
              Read on FT.com
            </a>
          </div>
        </div>
      ))}
      {!manualLoadTriggered && contextHasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleManualLoadMore}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow-lg text-lg font-semibold transition-colors duration-150"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      {manualLoadTriggered && contextHasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-8">
          <span className="dark:text-gray-400 text-gray-600">{loading ? 'Loading...' : 'Scroll to load more'}</span>
        </div>
      )}
      {!contextHasMore && contextNewsItems.length > 0 && (
        <div className="text-center dark:text-gray-500 text-gray-600 py-10">No more news</div>
      )}
    </div>
  );
}