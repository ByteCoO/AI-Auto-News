"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback, type CSSProperties } from 'react';
import { format } from 'date-fns';

// --- Interfaces (no changes) ---
export interface NewsItem {
  id: string;
  timestamp: string;
  headline: string;
  url?: string;
  details?: string;
  publicationTimeUTC?: string;
  source?: string;
}
export interface RawNewsItemFromDb {
  id: number | string;
  source: string;
  title: string;
  url?: string;
  original_timestamp?: string;
  publication_time_utc?: string;
}
export interface SourceDisplayDetail {
  name: string;
  logoUrl?: string;
  logoLetter?: string;
  updateLabel?: string;
  cardBgColor?: string;
  cardCustomStyle?: CSSProperties;
}

// --- State and Config (no changes) ---
interface NewsSourceState {
  items: NewsItem[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
}

const TARGET_SOURCES_CONFIG = [
  { key: 'bloomberg', name: 'Bloomberg', defaultLogoLetter: 'B' },
  { key: 'ft', name: 'FT', defaultLogoLetter: 'F' },
  { key: 'reuters', name: 'Reuters', defaultLogoLetter: 'R' },
];

// --- Main Component ---
const MultiSourceNews: React.FC<{ initialNewsData: Record<string, NewsSourceState>, sourceDisplayDetails?: SourceDisplayDetail[] }> = ({ initialNewsData, sourceDisplayDetails = [] }) => {
  const [newsSources, setNewsSources] = useState<Record<string, NewsSourceState>>(initialNewsData);
  // The fetchNews function is now simplified and doesn't need to be a useCallback with complex dependencies
  const fetchNews = async (sourceName: string, page: number = 1) => {
    setNewsSources(prev => ({
      ...prev,
      [sourceName]: {
        ...(prev[sourceName] || { items: [], page: 0, hasMore: true }),
        isLoading: true,
      },
    }));

    try {
      const response = await fetch(`/api/news?source=${sourceName}&page=${page}&limit=10`);
      if (!response.ok) throw new Error(`Failed to fetch news for ${sourceName}`);
      
      const { data, count } = await response.json();

      const newItems: NewsItem[] = data.map((rawItem: any) => ({
        id: String(rawItem.id),
        headline: rawItem.title,
        url: rawItem.url,
        timestamp: rawItem.timestamp || 'N/A',
        publicationTimeUTC: rawItem.publicationTimeUTC,
      }));

      setNewsSources(prev => {
        const existingItems = prev[sourceName]?.items || [];
        const allItems = page === 1 ? newItems : [...existingItems, ...newItems];
        return {
          ...prev,
          [sourceName]: {
            items: allItems,
            page: page,
            hasMore: allItems.length < count,
            isLoading: false,
          },
        };
      });
    } catch (error) {
      console.error(error);
      setNewsSources(prev => ({
        ...prev,
        [sourceName]: { ...(prev[sourceName] || { items: [], page: 1, hasMore: false }), isLoading: false },
      }));
    }
  };

  const handleLoadMore = (sourceName: string) => {
    const sourceState = newsSources[sourceName];
    if (sourceState && !sourceState.isLoading && sourceState.hasMore) {
      fetchNews(sourceName, sourceState.page + 1);
    }
  };

  const displayDetailsMap = new Map(sourceDisplayDetails.map(detail => [detail.name.toLowerCase(), detail]));

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TARGET_SOURCES_CONFIG.map((targetConfig) => {
            const sourceState = newsSources[targetConfig.name] || { items: [], page: 1, hasMore: false, isLoading: true };
            const customDisplay = displayDetailsMap.get(targetConfig.name.toLowerCase());
            
            const displayName = targetConfig.name;
            const logoUrl = customDisplay?.logoUrl;
            const logoLetter = customDisplay?.logoLetter || targetConfig.defaultLogoLetter;
            
            return (
              <div
                key={targetConfig.key}
                className={`rounded-xl shadow-lg p-5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col h-full`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {logoUrl ? (
                      <Image src={logoUrl} alt={`${displayName} logo`} width={28} height={28} className="rounded-sm object-contain" />
                    ) : (
                      <div className={`w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-indigo-600 rounded-sm font-bold text-lg`} title={displayName}>
                        {logoLetter}
                      </div>
                    )}
                    <span className="font-semibold text-lg">{displayName}</span>
                  </div>
                </div>

                {/* News Items List - with fixed height and scroll */}
                <div className="h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 dark:hover:scrollbar-thumb-slate-500">
                  {sourceState.isLoading && sourceState.items.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-slate-500">Loading...</div>
                  ) : sourceState.items.length > 0 ? (
                    <ul className="space-y-3">
                      {sourceState.items.map((item) => (
                        <li key={item.id} className="border-l-2 border-slate-200 dark:border-slate-700 pl-3 py-1 dark:text-amber-300">
                          <div className="flex items-center text-xs opacity-70 mb-0.5 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {item.publicationTimeUTC ? format(new Date(item.publicationTimeUTC), 'dd MMMM yyyy') : item.timestamp}
                          </div>
                          {item.url ? (
                            <Link href={item.url} className="text-sm sm:text-base hover:underline">{item.headline}</Link>
                          ) : (
                            <span className="text-sm sm:text-base">{item.headline}</span>
                          )}
                        </li>
                      ))}
                      {/* Infinite scroll trigger removed */}
                    </ul>
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      No news items available.
                    </div>
                  )}
                </div>
                
                {/* Footer for status display */}
                <div className="h-6 mt-3 text-center text-sm text-slate-500">
                  {sourceState.isLoading && sourceState.items.length > 0 && (
                    <p>Loading more...</p>
                  )}
                  {!sourceState.hasMore && sourceState.items.length > 0 && (
                    <p>No more news</p>
                  )}
                  {sourceState.hasMore && !sourceState.isLoading && (
                    <button
                      onClick={() => handleLoadMore(targetConfig.name)}
                      className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50 text-sm font-semibold"
                    >
                      Load more
                    </button>
                  )}
                </div>

               </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MultiSourceNews;