// app/contexts/FTNewsContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Adjusted path for Supabase client

// Define the shape of an FT news item, similar to what's in ft-news/page.tsx
interface FTNewsItem {
  id: string;
  page_url: string; // Corresponds to pageURL
  page_title: string; // Corresponds to pageTitle
  category?: {
    text: string;
    url: string;
  };
  headline: string;
  subheadline?: string;
  published_timestamp?: string; // Corresponds to publishedTimestamp
  created_at?: string; // Assuming this field exists for ordering
  publishedtimestamputc?: string; // UTC timestamp for ordering
}

// Define the shape for a single detailed FT news article
interface FTArticleBodyItem {
  type: string;
  content: string | { text: string; url?: string }[];
}

interface FTNewsDetail {
  id: string;
  page_url: string; // Corresponds to pageURL
  page_title: string; // Corresponds to pageTitle
  category?: {
    text: string;
    url: string;
  };
  headline: string;
  subheadline?: string;
  main_image?: { // Corresponds to mainImage
    altText?: string | null;
    caption?: string;
    url?: string; // Assuming a URL might be part of main_image JSONB
  };
  authors?: {
    name: string;
    url: string;
  }[];
  published_timestamp?: string; // Corresponds to publishedTimestamp
  updated_at?: string; // Corresponds to updatedTimestamp (from db: updated_at)
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
  page: number;
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

  const fetchInitialFTNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      const { data, error: dbError } = await supabase
        .from('FT_articles')
        .select('id, page_url, page_title, category, headline, subheadline, published_timestamp, created_at, publishedtimestamputc')
        .order('publishedtimestamputc', { ascending: false })
        .range(0, pageSize - 1);
      if (dbError) throw dbError;
      setNewsItems((data as FTNewsItem[]) || []);
      setHasMore((data as FTNewsItem[]).length === pageSize);
    } catch (err) {
      let specificMessage = 'An unknown error occurred while fetching news.';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as any).message === 'string') {
        specificMessage = `Failed to load news: ${(err as any).message}`;
      } else if (err instanceof Error) {
        specificMessage = `Failed to load news: ${err.message}`;
      } else if (typeof err === 'string') {
        specificMessage = `Failed to load news: ${err}`;
      }
      setError(specificMessage);
    }
    setLoading(false);
  }, [pageSize]);

  const fetchMoreFTNews = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const from = (nextPage - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error: dbError } = await supabase
        .from('FT_articles')
        .select('id, page_url, page_title, category, headline, subheadline, published_timestamp, created_at, publishedtimestamputc')
        .order('publishedtimestamputc', { ascending: false })
        .range(from, to);
      if (dbError) throw dbError;
      if (data && data.length > 0) {
        setNewsItems(prev => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === pageSize);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      let specificMessage = 'An unknown error occurred while loading more news.';
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as any).message === 'string') {
        specificMessage = `Failed to load more news: ${(err as any).message}`;
      } else if (err instanceof Error) {
        specificMessage = `Failed to load more news: ${err.message}`;
      } else if (typeof err === 'string') {
        specificMessage = `Failed to load more news: ${err}`;
      }
      setError(specificMessage);
    }
    setLoading(false);
  }, [page, pageSize, loading, hasMore]);

  const fetchArticleById = useCallback(async (id: string) => {
    if (!id) {
      setArticleError('No ID provided to fetchArticleById');
      setCurrentArticle(null);
      setArticleLoading(false);
      return;
    }
    setArticleLoading(true);
    setArticleError(null);
    setCurrentArticle(null); // Clear previous article
    try {
      const { data, error: dbError } = await supabase
        .from('FT_articles') // Ensure this is your actual table name
        .select('id, page_url, page_title, category, headline, subheadline, main_image, authors, published_timestamp, updated_at, body, created_at') // Select all relevant unnested fields
        .eq('id', id)
        .single();

      if (dbError) {
        if (dbError.code === 'PGRST116') { // PostgREST code for 'Searched item was not found'
          setArticleError(`Article with ID ${id} not found.`);
          setCurrentArticle(null);
        } else {
          throw dbError;
        }
      } else {
        setCurrentArticle(data as FTNewsDetail);
      }
    } catch (err) {
      console.error(`Error fetching FT news detail for ID ${id} in Context:`, err);
      setArticleError(err instanceof Error ? err.message : `Failed to load article with ID ${id}`);
      setCurrentArticle(null);
    }
    setArticleLoading(false);
  }, []);

  // Fetch initial news when the provider mounts
  useEffect(() => {
    fetchInitialFTNews();
  }, [fetchInitialFTNews]);

  return (
    <FTNewsContext.Provider value={{
      newsItems, setNewsItems, loading, setLoading, error, setError,
      fetchInitialFTNews, fetchMoreFTNews, hasMore, page, pageSize,
      currentArticle, setCurrentArticle, articleLoading, setArticleLoading, articleError, setArticleError, fetchArticleById,
      manualLoadTriggered, setManualLoadTriggered
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