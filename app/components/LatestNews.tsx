'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo
import { supabase } from '../lib/supabase'; // Assuming this path is correct

interface NewsItem {
  id: number;
  created_at: string;
  News: {
    title?: string;
    content?: string; // Keep content if it's part of the News object schema for detail pages
  } | null;
}

// Interface for the structure of grouped news
interface GroupedNews {
  [date: string]: NewsItem[];
}

// Helper function to format date to YYYY-MM-DD
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

export default function LatestNews() {
  const [visibleItems, setVisibleItems] = useState(8); // Controls total individual items visible
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [hasManuallyLoadedOnce, setHasManuallyLoadedOnce] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('NSD') // Make sure 'NSD' is the correct table name
        .select('id, created_at, News')
        .order('created_at', { ascending: false }); // Fetch all, sorted by date descending
  
      if (error) {
        console.error('Error fetching news:', error);
      } else {
        setNewsItems(data || []);
      }
      setLoading(false);
    };
  
    fetchNews();
  }, []);

  const loadMoreItems = useCallback(() => {
    setLoading(true); 
    setTimeout(() => {
      // Increase the number of visible *individual items*
      setVisibleItems(prev => Math.min(prev + 8, newsItems.length));
      setLoading(false);
    }, 500);
  }, [newsItems.length]);

  // Scroll listener effect
  useEffect(() => {
    const handleScroll = () => {
      if (hasManuallyLoadedOnce && 
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150) {
        if (!loading && visibleItems < newsItems.length) {
          loadMoreItems();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, visibleItems, newsItems.length, loadMoreItems, hasManuallyLoadedOnce]);

  // Function to handle the button click for "Load More"
  const handleManualLoadMoreClick = () => {
    loadMoreItems();
    if (!hasManuallyLoadedOnce) {
      setHasManuallyLoadedOnce(true);
    }
  };

  // 1. Slice the newsItems to get only the ones that should be currently visible
  const itemsToDisplay = useMemo(() => {
    return newsItems.slice(0, visibleItems);
  }, [newsItems, visibleItems]);

  // 2. Group these visible items by date
  const groupedVisibleNews = useMemo(() => {
    return itemsToDisplay.reduce((acc, item) => {
      const dateKey = formatDate(item.created_at);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {} as GroupedNews);
  }, [itemsToDisplay]);

  // 3. Get sorted date keys for rendering groups in order
  const sortedVisibleDates = useMemo(() => {
    return Object.keys(groupedVisibleNews).sort((a, b) => {
      // Sort by date descending (newest date groups first)
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [groupedVisibleNews]);


  return (
    <div className="py-8 bg-zinc-800 text-gray-200 min-h-screen">
      <div className="container mx-auto px-4 w-full max-w-3xl">
        
        {/* Spinner for initial loading when no items are fetched yet */}
        {loading && newsItems.length === 0 && (
          <div className="text-center py-20"> {/* More padding for initial load spinner */}
            <div 
              className="inline-block h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent" 
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {/* Message if no items are available after loading */}
        {!loading && newsItems.length === 0 && (
          <p className="text-gray-400 text-lg text-center py-10">No news items to display currently.</p>
        )}

        {/* Render news items grouped by date */}
        {sortedVisibleDates.length > 0 && sortedVisibleDates.map(dateKey => (
          <div key={dateKey} className="mb-10"> {/* Container for each date's section */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
              Show Latest Daily Selection ({dateKey})
            </h2>
            <ul className="space-y-2 list-none p-0 m-0">
              {groupedVisibleNews[dateKey].map((item) => (
                <li key={item.id} className="text-base sm:text-lg leading-relaxed">
                  <Link 
                    href={`/news/${item.id}`} 
                    className="text-gray-200 hover:text-orange-400 transition-colors duration-150 group block py-1.5 px-2 rounded hover:bg-zinc-700"
                  >
                    <span className="select-none mr-2 sm:mr-3" aria-hidden="true">•</span>
                    <span className="group-hover:underline">
                      {item.News?.title || '无标题'}
                      {item.created_at && (
                        // Appending the item's specific date, as per example
                        <span className="ml-1">{/* Small margin for separation */}
                          - ({formatDate(item.created_at)})
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        {/* Loading spinner for "loadMore" action (when some items are already shown) */}
        {loading && newsItems.length > 0 && visibleItems < newsItems.length && (
          <div className="text-center py-8">
            <div 
              className="inline-block h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-solid border-white border-r-transparent" 
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {!loading && visibleItems < newsItems.length && (
          <div className="text-center mt-8 mb-4">
            <button 
              onClick={handleManualLoadMoreClick}
              className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-150 text-sm sm:text-base font-medium"
            >
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
}