// app/archive/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { format, parseISO, getYear, getMonth } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  publishedtimestamputc: string;
  source: string;
  imageurl?: string;
}

interface GroupedNews {
  [yearMonth: string]: NewsItem[];
}

// Mock Data for UI development
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Mock News Item 1 (June)',
    url: '#',
    publishedtimestamputc: '2025-06-15T10:00:00Z',
    source: 'Mock Source',
  },
  {
    id: '2',
    title: 'Mock News Item 2 (June)',
    url: '#',
    publishedtimestamputc: '2025-06-10T12:30:00Z',
    source: 'Mock Source',
  },
  {
    id: '3',
    title: 'Mock News Item 3 (May)',
    url: '#',
    publishedtimestamputc: '2025-05-20T08:00:00Z',
    source: 'Mock Source',
  },
  {
    id: '4',
    title: 'Mock News Item 4 (May)',
    url: '#',
    publishedtimestamputc: '2025-05-10T18:45:00Z',
    source: 'Another Mock Source',
  },
  {
    id: '5',
    title: 'Mock News Item 5 (April)',
    url: '#',
    publishedtimestamputc: '2025-04-25T14:20:00Z',
    source: 'Mock Source',
  },
];

const ArchivePage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Comment out API fetch and use mock data for now
        // const response = await fetch('/api/news');
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();

        // USE MOCK DATA
        const data = mockNewsData; 

        if (!Array.isArray(data)) {
          console.error('API did not return an array:', data);
          throw new Error('Received invalid data format from API.');
        }

        // Ensure publishedtimestamputc is a string and sort by it descending
        const sortedData = data.sort((a: NewsItem, b: NewsItem) => 
          new Date(b.publishedtimestamputc).getTime() - new Date(a.publishedtimestamputc).getTime()
        );
        setNews(sortedData);
        setError(null);
      } catch (e: any) {
        setError(e.message);
        console.error('Failed to fetch or process news:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const groupedNews = useMemo(() => {
    return news.reduce((acc, item) => {
      try {
        const date = parseISO(item.publishedtimestamputc);
        const yearMonth = format(date, 'yyyy-MM'); // Group by year and month
        if (!acc[yearMonth]) {
          acc[yearMonth] = [];
        }
        acc[yearMonth].push(item);
      } catch (e) {
        console.error(`Failed to parse date for news item: ${item.id}`, e);
      }
      return acc;
    }, {} as GroupedNews);
  }, [news]);

  const sortedMonths = useMemo(() => {
    return Object.keys(groupedNews).sort((a, b) => b.localeCompare(a)); // Sort months in descending order
  }, [groupedNews]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white dark:text-gray-300">Loading news archive...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error loading news: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8 w-full">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8  w-full">
        {/* Main Content Area */}
        <main className="flex-grow lg:w-3/4  w-full" >
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-yellow-500 dark:text-yellow-400">News Archive</h1>
          {sortedMonths.length === 0 && !loading && (
            <p>No news articles found in the archive.</p>
          )}
          {sortedMonths.map((yearMonth) => {
            const [year, month] = yearMonth.split('-');
            const monthName = format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM yyyy');
            return (
              <section key={yearMonth} id={`archive-${yearMonth}`} className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
                  {monthName}
                </h2>
                <ul className="space-y-4">
                  {groupedNews[yearMonth].map((item) => (
                    <li key={item.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-yellow-600 dark:text-yellow-500 hover:underline">
                            {item.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {format(parseISO(item.publishedtimestamputc), 'MM/dd')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Source: {item.source}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </main>

        {/* Sidebar for "On this page" */}
        {sortedMonths.length > 0 && (
          <aside className="lg:w-1/4 lg:sticky lg:top-20 h-fit bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">On this page</h2>
            <ul className="space-y-2">
              {sortedMonths.map((yearMonth) => {
                const [year, monthStr] = yearMonth.split('-');
                const displayMonth = `${year}.${monthStr}`;
                return (
                  <li key={`nav-${yearMonth}`}>
                    <Link href={`#archive-${yearMonth}`} className="text-yellow-600 dark:text-yellow-400 hover:underline">
                      {displayMonth}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;

// Add metadata if needed, for example:
// export const metadata = {
//   title: 'News Archive',
//   description: 'Browse through our archived news articles, sorted by month.',
// };