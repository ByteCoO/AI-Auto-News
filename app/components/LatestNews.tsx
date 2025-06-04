'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface NewsItem {
  id: string;
  published_timestamp: string; // Relative time like "44 minutes ago", from API
  headline?: string;
  page_title?: string;
  publishedtimestamputc?: string; // Absolute UTC timestamp string, from API
  created_at?: string; // Using publishedtimestamputc as a proxy
}

interface GroupedNews {
  [date: string]: NewsItem[];
}

const formatDate = (dateString: string): string => {
  // console.log('formatDate received:', dateString); // Debug formatDate input
  if (!dateString) return 'YYYY-MM-DD';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // console.log('formatDate: Invalid date for string:', dateString);
      return 'Invalid Date';
    }
    const year = date.getFullYear(); // Changed to getFullYear
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Changed to getMonth
    const day = date.getDate().toString().padStart(2, '0'); // Changed to getDate
    const formatted = `${year}-${month}-${day}`;
    // console.log(`formatDate: ${dateString} -> ${formatted}`); // Debug formatDate output
    return formatted;
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
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
      // console.log(`API response for page ${page}:`, { data, count });


      const transformedData = (data || []).map((apiItem: any, index: number) => {
        // console.log(`API Item ${index} (page ${page}):`, JSON.stringify(apiItem));
        return {
          id: apiItem.id || `fallback-id-${page}-${index}-${Math.random()}`, // Ensure ID is always present
          published_timestamp: apiItem.published_timestamp,
          headline: apiItem.headline,
          page_title: apiItem.page_title,
          publishedtimestamputc: apiItem.publishedtimestamputc,
          created_at: apiItem.created_at, // Proxy

        };
      });
      // console.log(`Transformed Data (page ${page}):`, JSON.stringify(transformedData.slice(0,2))); // Log first few

      // Sort by the absolute UTC timestamp, descending
      const sortedData = (transformedData || []).sort((a: NewsItem, b: NewsItem) => {
        const timeA = a.publishedtimestamputc ? new Date(a.publishedtimestamputc).getTime() : 0;
        const timeB = b.publishedtimestamputc ? new Date(b.publishedtimestamputc).getTime() : 0;
        
        if (isNaN(timeB) && isNaN(timeA)) return 0;
        if (isNaN(timeB)) return -1; // B is invalid, A is not, A comes "before" (larger time) B for descending
        if (isNaN(timeA)) return 1;  // A is invalid, B is not, B comes "before" A
        
        return timeB - timeA;
      });
      // console.log(`Sorted Data to be set (page ${page}):`, JSON.stringify(sortedData.slice(0,2)));

      setNewsItems(prevItems => page === 1 ? sortedData : [...prevItems, ...sortedData]);
      if (count !== undefined) {
        setTotalItems(count);
      }
      setCurrentPage(page);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching news:', err);
      if (retries < MAX_RETRIES) {
        setTimeout(() => {
          fetchNewsFromApi(page, retries + 1);
        }, RETRY_DELAY * (retries + 1));
        setRetryCount(retries + 1); // Increment retry count here
        return;
      }
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setRetryCount(retries); // Set final retry count
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

  const loadMoreItems = useCallback(() => {
    if (!loading && newsItems.length < totalItems) {
      fetchNewsFromApi(currentPage + 1);
      if (!manualLoadDone) setManualLoadDone(true);
    }
  }, [loading, newsItems.length, totalItems, currentPage, fetchNewsFromApi, manualLoadDone]);

  useEffect(() => {
    if (!manualLoadDone || !initialLoadComplete) return;
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
        if (!loading && newsItems.length < totalItems) {
          loadMoreItems();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, newsItems.length, totalItems, loadMoreItems, initialLoadComplete, manualLoadDone]);

  const groupedVisibleNews = useMemo(() => {
    // console.log('Grouping newsItems:', newsItems.slice(0,5));
    const grouped = newsItems.reduce((acc, item) => {
      const dateKeySource = item.publishedtimestamputc || item.published_timestamp;
      // console.log(`Item ID ${item.id} for grouping uses timestamp: ${dateKeySource}, headline: ${item.headline}`);
      const dateKey = formatDate(dateKeySource);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {} as GroupedNews);

    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) =>
        new Date(b.created_at || b.publishedtimestamputc || b.published_timestamp || 0).getTime() -
        new Date(a.created_at || a.publishedtimestamputc || a.published_timestamp || 0).getTime()
      );
    });
    // console.log('Grouped news:', grouped);
    return grouped;
  }, [newsItems]);

  const sortedVisibleDates = useMemo(() => {
    return Object.keys(groupedVisibleNews).sort((a, b) => {
      const dateA = new Date(a); // a and b are 'YYYY-MM-DD' strings
      const dateB = new Date(b);
      // Check for Invalid Date if keys could be 'Invalid Date'
      if (isNaN(dateB.getTime()) && isNaN(dateA.getTime())) return 0;
      if (isNaN(dateB.getTime())) return 1; // Invalid dates go to the end
      if (isNaN(dateA.getTime())) return -1;
      return dateB.getTime() - dateA.getTime(); // Sort descending
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
          ><span className="sr-only">Loading...</span></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 dark:bg-zinc-800 bg-gray-100 dark:text-gray-200 text-gray-900 min-h-screen">
        <div className="container mx-Avenirauto px-4 w-full max-w-3xl text-center py-10">
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
        {/* {console.log("Rendering dates:", sortedVisibleDates)} */}
        {sortedVisibleDates.length > 0 && sortedVisibleDates.map(dateKey => {
          // Skip rendering if the dateKey is 'Invalid Date' or similar error strings
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
                  // console.log(`Rendering item ${item.id} for date ${dateKey}: headline='${item.headline}', page_title='${item.page_title}'`);
                  return (
                    <li key={item.id} className="text-base sm:text-lg leading-relaxed">
                      <Link
                        href={`/ft-news/${item.id}`}
                        className="dark:text-gray-200 text-gray-800 dark:hover:text-orange-400 hover:text-orange-600 transition-colors duration-150 group block py-1.5 px-2 rounded dark:hover:bg-zinc-700 hover:bg-gray-200"
                      >
                        <span className="select-none mr-2 sm:mr-3" aria-hidden="true">•</span>
                        <span className="group-hover:underline">
                          {item.headline || item.page_title || 'Untitled News'}
                          {item.publishedtimestamputc && (
                            <span className="text-xs text-gray-500 ml-2">
                            {(() => {
                              const date = new Date(item.publishedtimestamputc);

                              // 月份缩写数组
                              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                              const monthAbbr = monthNames[date.getMonth()]; // getMonth() 返回 0-11

                              const day = date.getDate(); // 日期，不需要前导0

                              let hours = date.getHours(); // 0-23
                              const minutes = String(date.getMinutes()).padStart(2, '0'); // 分钟，需要前导0

                              const ampm = hours >= 12 ? 'PM' : 'AM';

                              hours = hours % 12;
                              hours = hours ? hours : 12; // 0点（午夜或中午）应显示为12


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

        {loading && newsItems.length > 0 && (
          <div className="text-center py-8">
            <div
              className="inline-block h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-solid dark:border-white border-gray-900 dark:border-r-transparent border-r-transparent"
              role="status"
            ><span className="sr-only">Loading...</span></div>
          </div>
        )}

        {!loading && canLoadMore && !manualLoadDone && (
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