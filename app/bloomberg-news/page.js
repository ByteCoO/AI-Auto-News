"use client";

import { useEffect, useState, useRef, useCallback } from 'react';

// --- Dark Mode Toggle (no change) ---
const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) { document.documentElement.classList.add('dark'); setIsDarkMode(true); }
  }, []);
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); } 
      else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
      return next;
    });
  };
  return (<button onClick={toggleTheme} className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md">{isDarkMode ? (<svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>) : (<svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>)}</button>);
};

import { format, parseISO } from 'date-fns';
import { BLOOMBERG_BASE_URL } from '../config';

// --- Reusable News Section (Refactored) ---
const NewsSection = ({ title, sourceApiUrl, isPaginated = true }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const observer = useRef();

  const fetchNews = useCallback(async (pageNum, isRefresh = false) => {
    if (isLoading || (!hasMore && !isRefresh)) return;

    setIsLoading(true);
    if (isRefresh) setIsRefreshing(true);
    setError(null);

    try {
      const res = await fetch(`${sourceApiUrl}?page=${pageNum}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(`API Error: ${res.status} - ${errorData.message || res.statusText}`);
      }
      const newData = await res.json();

      if (Array.isArray(newData)) {
        setItems(prev => (isRefresh ? newData : [...prev, ...newData]));
        setPage(pageNum);
        setHasMore(newData.length >= 10);
      } else {
        throw new Error('Received data is not in the expected format.');
      }
    } catch (e) {
      console.error(`Failed to fetch news for ${title}:`, e);
      setError(e.message);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      if (isRefresh) setIsRefreshing(false);
    }
  }, [isLoading, hasMore, sourceApiUrl, title]);

  useEffect(() => {
    if (items.length === 0 && hasMore) {
      fetchNews(1);
    }
  }, [fetchNews, items.length, hasMore]);
  
  useEffect(() => {
    if (!isPaginated) return; // Don't auto-refresh non-paginated sections
    const intervalId = setInterval(() => {
      console.log(`Auto-refreshing ${title} news...`);
      setHasMore(true); // Reset hasMore to allow refresh
      fetchNews(1, true);
    }, 300000); // 5 minutes
    return () => clearInterval(intervalId);
  }, [fetchNews, title, isPaginated]);

  const lastItemRef = useCallback(node => {
    if (isLoading || !isPaginated) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchNews(page + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, page, fetchNews, isPaginated]);
  
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM d, HH:mm");
    } catch {
      return 'Invalid date';
    }
  };
  
  const getStoryUrl = (story) => {
    if (!story.url) return '#';
    return story.url.startsWith('http') ? story.url : `${BLOOMBERG_BASE_URL}${story.url}`;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 flex flex-col h-[700px]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold text-xl py-2 px-3.5 rounded-md mr-4">{title.charAt(0)}</span>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
        </div>
        {isRefreshing && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-blue-500"></div>}
      </div>
      <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600">
        {error ? (
          <div className="text-center text-red-500"><p>Error: {error}</p></div>
        ) : items.length === 0 && isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500">No stories available.</p>
        ) : (
          <ul className="list-none p-0 m-0">
            {items.map((story, index) => (
              <li key={`${story.id || story.headline}-${index}`} ref={index === items.length - 1 ? lastItemRef : null} className={`py-4 ${index !== 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}`}>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                  <svg className="w-4 h-4 fill-current mr-2" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M13 7h-2v6h6v-2h-4z"></path></svg>
                  {formatDate(story.publishedAt || story.lastModified)}
                </div>
                <a href={getStoryUrl(story)} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">{story.headline}</a>
              </li>
            ))}
          </ul>
        )}
        {isLoading && items.length > 0 && <p className="text-center text-gray-500 py-4">Loading more...</p>}
        {!hasMore && items.length > 0 && isPaginated && <p className="text-center text-gray-500 py-4">No more stories found.</p>}
      </div>
    </div>
  );
};

import { NEWS_SOURCES } from '../config';

// --- Main Page Component (Enhanced) ---
const BloombergPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-gray-900 dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]"></div>
      <DarkModeToggle />
      <div className="p-4 sm:p-6 lg:p-8">
        
        {/* --- Enhanced Page Header --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-400 dark:to-teal-300">
            The Bloomberg Wire
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your real-time feed of market-moving news and analysis.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-screen-2xl mx-auto">
          {NEWS_SOURCES.map(source => (
            <NewsSection 
              key={source.title}
              title={source.title}
              sourceApiUrl={source.apiUrl}
              isPaginated={source.isPaginated}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BloombergPage;