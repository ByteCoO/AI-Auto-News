
'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface NewsItem {
  id: string;
  published_timestamp: string;
  headline?: string;
  page_title?: string;
  publishedtimestamputc?: string;
  created_at?: string;
  url?: string;
}

interface GroupedNews {
  [date: string]: NewsItem[];
}

// Props for the component, including initial data
interface LatestNewsProps {
  initialNewsItems?: NewsItem[];
  initialTotalItems?: number;
  initialPage?: number;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'YYYY-MM-DD';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return 'Error Date';
  }
};

const ITEMS_PER_PAGE = 8;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function LatestNews({
  initialNewsItems = [], // Default to empty array if not provided
  initialTotalItems = 0,
  initialPage = 1,
}: LatestNewsProps) {
  // Initialize states with props or defaults
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [loading, setLoading] = useState(false); // Changed: Don't start loading initially
  const [initialLoadComplete, setInitialLoadComplete] = useState(initialNewsItems.length > 0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [initialLoadTriggered, setInitialLoadTriggered] = useState(initialNewsItems.length > 0);


  const fetchNewsFromApi = useCallback(async (pageToFetch: number, retries = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/news?page=${pageToFetch}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      const { data, count } = await response.json();

      const transformedData = (data || []).map((apiItem: any, index: number) => ({
        id: apiItem.id || `fallback-id-${pageToFetch}-${index}-${Math.random()}`,
        published_timestamp: apiItem.published_timestamp,
        headline: apiItem.headline,
        page_title: apiItem.page_title,
        publishedtimestamputc: apiItem.publishedtimestamputc,
        created_at: apiItem.created_at,
        url: apiItem.url,
      }));

      const sortedData = (transformedData || []).sort((a: NewsItem, b: NewsItem) => {
        const timeA = a.publishedtimestamputc ? new Date(a.publishedtimestamputc).getTime() : 0;
        const timeB = b.publishedtimestamputc ? new Date(b.publishedtimestamputc).getTime() : 0;
        if (isNaN(timeB) && isNaN(timeA)) return 0;
        if (isNaN(timeB)) return -1;
        if (isNaN(timeA)) return 1;
        return timeB - timeA;
      });

      // Append if pageToFetch is not the initial page loaded by server, otherwise replace if it's the very first client fetch
      setNewsItems(prevItems => (pageToFetch === 1 && prevItems.length === 0) ? sortedData : [...prevItems, ...sortedData]);
      if (count !== undefined) {
        setTotalItems(count);
      }
      setCurrentPage(pageToFetch);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching news:', err);
      if (retries < MAX_RETRIES) {
        setTimeout(() => {
          fetchNewsFromApi(pageToFetch, retries + 1);
        }, RETRY_DELAY * (retries + 1));
        setRetryCount(retries + 1);
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
  }, [initialLoadComplete]); // Removed initialPage from deps as it's used for initial state

  const handleInitialLoad = () => {
    setInitialLoadTriggered(true);
    fetchNewsFromApi(1);
  };

  const loadMoreItems = useCallback(() => {
    if (!loading && newsItems.length < totalItems) {
      fetchNewsFromApi(currentPage + 1);
    }
  }, [loading, newsItems.length, totalItems, currentPage, fetchNewsFromApi]);

  const groupedVisibleNews = useMemo(() => {
    const grouped = newsItems.reduce((acc, item) => {
      const dateKeySource = item.publishedtimestamputc || item.published_timestamp;
      const dateKey = formatDate(dateKeySource);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {} as GroupedNews);

    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) =>
        new Date(b.created_at || b.publishedtimestamputc || b.published_timestamp || 0).getTime() -
        new Date(a.created_at || a.publishedtimestamputc || a.published_timestamp || 0).getTime()
      );
    });
    return grouped;
  }, [newsItems]);

  const sortedVisibleDates = useMemo(() => {
    return Object.keys(groupedVisibleNews).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      if (isNaN(dateB.getTime()) && isNaN(dateA.getTime())) return 0;
      if (isNaN(dateB.getTime())) return 1;
      if (isNaN(dateA.getTime())) return -1;
      return dateB.getTime() - dateA.getTime();
    });
  }, [groupedVisibleNews]);

  const canLoadMore = newsItems.length < totalItems;

  if (!initialLoadTriggered) {
    return (
      <div className="py-8 dark:bg-zinc-800 bg-gray-100 dark:text-gray-200 text-gray-900 min-h-screen">
        <div className="container mx-auto px-4 w-full max-w-3xl text-center py-10">
           <h2 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white text-gray-900">
                Show Latest Daily Selection
            </h2>
            <button
              onClick={handleInitialLoad}
              className="px-6 py-2.5 sm:px-8 sm:py-3 dark:bg-gray-700 bg-gray-200 dark:text-white text-gray-900 rounded-md dark:hover:bg-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-150 text-sm sm:text-base font-medium"
            >
              Load More
            </button>
        </div>
      </div>
    );
  }

  // Initial loading spinner for client-side only first load
  if (loading && newsItems.length === 0) {
    return (
      <div className="py-8 dark:bg-zinc-800 bg-gray-100 dark:text-gray-200 text-gray-900 min-h-screen">
        <div className="container mx-auto px-4 w-full max-w-3xl text-center py-20">
          <div
            className="inline-block h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-solid dark:border-white border-gray-900 dark:border-r-transparent border-r-transparent"
            role="status"
          ><span className="sr-only">Loading...</span></div>
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
        {sortedVisibleDates.length > 0 && sortedVisibleDates.map(dateKey => {
          if (dateKey === 'Invalid Date' || dateKey === 'Error Date' || dateKey === 'YYYY-MM-DD') {
            return null;
          }
          return (
            <div key={dateKey} className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white text-gray-900">
                Show Latest Daily Selection ({dateKey})
              </h2>
              <ul className="space-y-2 list-none p-0 m-0">
                {groupedVisibleNews[dateKey].map((item) => {
                  return (
                    <li key={item.id} className="text-base sm:text-lg leading-relaxed">
                      <Link
                        href={item.url ? `https://www.ft.com${item.url}` : `/ft-news/${item.id}`}
                        className="dark:text-gray-200 text-gray-800 dark:hover:text-orange-400 hover:text-orange-600 transition-colors duration-150 group block py-1.5 px-2 rounded dark:hover:bg-zinc-700 hover:bg-gray-200"
                      >
                        <span className="select-none mr-2 sm:mr-3" aria-hidden="true">•</span>
                        <span className="group-hover:underline">
                          {item.headline || item.page_title || 'Untitled News'}
                          {item.publishedtimestamputc && (
                            <span className="text-xs text-gray-500 ml-2">
                            {(() => {
                              const date = new Date(item.publishedtimestamputc);
                              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                              const monthAbbr = monthNames[date.getMonth()];
                              const day = date.getDate();
                              let hours = date.getHours();
                              const minutes = String(date.getMinutes()).padStart(2, '0');
                              const ampm = hours >= 12 ? 'PM' : 'AM';
                              hours = hours % 12;
                              hours = hours ? hours : 12;
                              return `— ${monthAbbr} ${day}, ${hours}:${minutes} ${ampm}`;
                            })()}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {loading && newsItems.length > 0 && ( // Show spinner when loading more items, but not on initial client-side load if items exist
          <div className="text-center py-8">
            <div
              className="inline-block h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-solid dark:border-white border-gray-900 dark:border-r-transparent border-r-transparent"
              role="status"
            ><span className="sr-only">Loading...</span></div>
          </div>
        )}

        {!loading && canLoadMore && (
          <div className="text-center mt-8 mb-4">
            <button
              onClick={loadMoreItems}
              className="px-6 py-2.5 sm:px-8 sm:py-3 dark:bg-gray-700 bg-gray-200 dark:text-white text-gray-900 rounded-md dark:hover:bg-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-150 text-sm sm:text-base font-medium"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
