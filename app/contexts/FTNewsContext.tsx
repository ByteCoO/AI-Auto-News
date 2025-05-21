// app/contexts/FTNewsContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase_Saas'; // Adjusted path for Supabase client

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
  fetchInitialFTNews: () => Promise<void>; // Function to fetch initial news
  currentArticle: FTNewsDetail | null;
  setCurrentArticle: Dispatch<SetStateAction<FTNewsDetail | null>>;
  articleLoading: boolean;
  setArticleLoading: Dispatch<SetStateAction<boolean>>;
  articleError: string | null;
  setArticleError: Dispatch<SetStateAction<string | null>>;
  fetchArticleById: (id: string) => Promise<void>;
}

const FTNewsContext = createContext<FTNewsContextType | undefined>(undefined);

export const FTNewsProvider = ({ children }: { children: ReactNode }) => {
  const [newsItems, setNewsItems] = useState<FTNewsItem[]>([]);
  const [loading, setLoading] = useState(true); // For news list
  const [error, setError] = useState<string | null>(null); // For news list

  const [currentArticle, setCurrentArticle] = useState<FTNewsDetail | null>(null);
  const [articleLoading, setArticleLoading] = useState(true); // For single article
  const [articleError, setArticleError] = useState<string | null>(null); // For single article

  const fetchInitialFTNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('FT_articles') // Ensure this is your actual table name
        .select('id, page_url, page_title, category, headline, subheadline, published_timestamp, created_at') // Select unnested fields
        .order('created_at', { ascending: false }); // Order by creation timestamp
        // .limit(10); // Example: limit initial load if needed

      if (dbError) throw dbError;

      setNewsItems((data as FTNewsItem[]) || []);
    } catch (err) {
      console.error('Error fetching FT news in Context:', err);
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
  }, []);

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
      newsItems, setNewsItems, loading, setLoading, error, setError, fetchInitialFTNews,
      currentArticle, setCurrentArticle, articleLoading, setArticleLoading, articleError, setArticleError, fetchArticleById
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