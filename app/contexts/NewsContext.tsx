'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { NewsItem } from '../types/news';

type NewsContextType = {
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

const NewsContext = createContext<NewsContextType | null>(null);

export function useNewsContext() {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNewsContext must be used within a NewsProvider');
  }
  return context;
}

export function NewsProvider({
  children,
  initialNews,
}: {
  children: ReactNode;
  initialNews: NewsItem[];
}) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialNews.length === 10);
  const [error, setError] = useState<string | null>(null);

  return (
    <NewsContext.Provider
      value={{
        news,
        setNews,
        loading,
        setLoading,
        hasMore,
        setHasMore,
        error,
        setError,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}