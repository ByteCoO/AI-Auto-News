// app/contexts/FTNewsContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface FTNewsItem {
  id: string;
  page_url: string; 
  page_title: string;
  category?: { text: string; url: string };
  headline: string;
  subheadline?: string;
  published_timestamp?: string;
  created_at?: string;
  publishedtimestamputc?: string;
}

interface FTArticleBodyItem {
  type: string;
  content: string | { text: string; url?: string }[];
}

interface FTNewsDetail {
  id: string;
  page_url: string;
  page_title: string;
  category?: {
    text: string;
    url: string;
  };
  headline: string;
  subheadline?: string;
  main_image?: {
    altText?: string | null;
    caption?: string;
    url?: string;
  };
  authors?: {
    name: string;
    url: string;
  }[];
  published_timestamp?: string;
  publishedtimestamputc?: string;
  snapshot_capture_timestamp?: string;
  updated_at?: string;
  body?: FTArticleBodyItem[];
  created_at?: string;
}

interface FTNewsContextType {
  newsItems: FTNewsItem[];
  setNewsItems: Dispatch<SetStateAction<FTNewsItem[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  fetchInitialFTNews: () => Promise<void>;
  fetchMoreFTNews: () => Promise<void>;
  hasMore: boolean;
  setHasMore: Dispatch<SetStateAction<boolean>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  currentArticle: FTNewsDetail | null;
  setCurrentArticle: Dispatch<SetStateAction<FTNewsDetail | null>>;
  articleLoading: boolean;
  setArticleLoading: Dispatch<SetStateAction<boolean>>;
  articleError: string | null;
  setArticleError: Dispatch<SetStateAction<string | null>>;
  fetchArticleById: (id: string) => Promise<void>;
  manualLoadTriggered: boolean;
  setManualLoadTriggered: Dispatch<SetStateAction<boolean>>;
  sortOrder: 'asc' | 'desc';
  setSortOrder: Dispatch<SetStateAction<'asc' | 'desc'>>;
}

const FTNewsContext = createContext<FTNewsContextType | undefined>(undefined);

export const FTNewsProvider = ({ children }: { children: ReactNode }) => {
  const [newsItems, setNewsItems] = useState<FTNewsItem[]>([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [currentArticle, setCurrentArticle] = useState<FTNewsDetail | null>(null);
  const [articleLoading, setArticleLoading] = useState(true);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6); 
  const [hasMore, setHasMore] = useState(true);
  const [manualLoadTriggered, setManualLoadTriggered] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchInitialFTNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      const { data, error: dbError } = await supabase
        .from('FT_articles')
        .select('id, page_url, page_title, category, headline, subheadline, published_timestamp, created_at, publishedtimestamputc')
        .order('publishedtimestamputc', { ascending: sortOrder === 'asc' })
        .range(0, pageSize - 1);

      if (dbError) throw dbError;
      
      setNewsItems(data || []);
      setHasMore((data || []).length === pageSize);
      setManualLoadTriggered(false);
    } catch (err) {
      const specificMessage = err instanceof Error ? `Failed to load news: ${err.message}` : String(err);
      console.error('fetchInitialFTNews error:', specificMessage, err);
      setError(specificMessage);
      setNewsItems([]); 
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [pageSize, sortOrder, setNewsItems, setHasMore, setPage, setLoading, setError, setManualLoadTriggered]);

  const fetchMoreFTNews = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    // setError(null); // Keep previous error if loading more, or clear if preferred. Let's clear.
    setError(null); 
    try {
      const nextPageToFetch = page + 1;
      const from = (nextPageToFetch - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error: dbError } = await supabase
        .from('FT_articles')
        .select('id, page_url, page_title, category, headline, subheadline, published_timestamp, created_at, publishedtimestamputc')
        .order('publishedtimestamputc', { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (dbError) {
        throw dbError;
      }

      if (data && data.length > 0) {
        setNewsItems(prev => [...prev, ...data]);
        setPage(nextPageToFetch);
        setHasMore(data.length === pageSize);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      const specificMessage = err instanceof Error ? `Failed to load more news: ${err.message}` : String(err);
      console.error('fetchMoreFTNews error:', specificMessage, err);
      setError(specificMessage);
      // setHasMore(false); // Optionally stop trying if an error occurs during load more
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, loading, hasMore, sortOrder, setNewsItems, setPage, setHasMore, setLoading, setError]);

  useEffect(() => {
    // This effect handles re-fetching when sortOrder changes,
    // but only if newsItems have been populated (e.g., by initial props or a previous fetch)
    // or if a manual load was triggered, to avoid fetching on initial mount if data is coming via props.
    if (newsItems.length > 0 || manualLoadTriggered) {
        fetchInitialFTNews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [sortOrder]); // fetchInitialFTNews is memoized with sortOrder in its deps

  const fetchArticleById = useCallback(async (id: string) => {
    if (!id) {
      setArticleError('No ID provided to fetchArticleById');
      setCurrentArticle(null);
      setArticleLoading(false);
      return;
    }
    setArticleLoading(true);
    setArticleError(null);
    setCurrentArticle(null);
    try {
      const { data, error: dbError } = await supabase
        .from('FT_articles')
        .select('id, page_url, page_title, category, headline, subheadline, main_image, authors, published_timestamp, publishedtimestamputc, updated_at, body, created_at')
        .eq('id', id)
        .single();

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          setArticleError(`Article with ID ${id} not found.`);
          setCurrentArticle(null);
        } else {
          throw dbError;
        }
      } else {
        setCurrentArticle(data as FTNewsDetail);
      }
    } catch (err) {
      const specificMessage = err instanceof Error ? `Failed to load article: ${err.message}` : String(err);
      console.error(`Error fetching FT news detail for ID ${id} in Context:`, specificMessage, err);
      setArticleError(specificMessage);
      setCurrentArticle(null);
    } finally {
      setArticleLoading(false);
    }
  }, [setArticleLoading, setArticleError, setCurrentArticle]);
  
  return (
    <FTNewsContext.Provider value={{
      newsItems, setNewsItems, loading, setLoading, error, setError,
      fetchInitialFTNews, fetchMoreFTNews, hasMore, setHasMore, page, setPage, pageSize,
      currentArticle, setCurrentArticle, articleLoading, setArticleLoading, articleError, setArticleError, fetchArticleById,
      manualLoadTriggered, setManualLoadTriggered,
      sortOrder, setSortOrder
    }}>
      {children}
    </FTNewsContext.Provider>
  );
};

export const useFTNewsContext = () => {
  const context = useContext(FTNewsContext);
  if (context === undefined) {
    throw new Error('useFTNewsContext must be used within a FTNewsProvider');
  }
  return context;
};