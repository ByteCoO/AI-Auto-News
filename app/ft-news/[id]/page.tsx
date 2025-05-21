// app/ft-news/[id]/page.tsx
'use client';

import { useEffect } from 'react';
import { useFTNewsContext } from '../../contexts/FTNewsContext'; // Adjusted path
import { supabase } from '../../lib/supabase_Saas'; // Still needed for generateMetadata
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';

interface FTArticleBodyItem {
  type: string;
  content: string | { text: string; url?: string }[]; // Content can be string or array of objects for links
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
  updated_at?: string; // Corresponds to updatedTimestamp
  body?: FTArticleBodyItem[];
  // created_at is also available but not directly used in this interface yet
}

// This function is now primarily for generateMetadata, data fetching for the page is handled by context
async function fetchFTNewsDetailServerSide(id: string): Promise<FTNewsDetail | null> {
  console.log(`Fetching FT news detail from Supabase for ID: ${id}`);
  try {
    const { data, error } = await supabase
      .from('FT_articles') // IMPORTANT: Replace 'FT_articles' with your actual Supabase table name
      .select(`
        id,
        page_url,
        page_title,
        category,
        headline,
        subheadline,
        main_image,
        authors,
        published_timestamp,
        updated_at,
        body
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error fetching FT news detail:', error);
      if (error.code === 'PGRST116') return null; // PostgREST code for 'Searched item was not found'
      throw error; // For other errors, re-throw to be caught by the page component
    }
    
    // Ensure the fetched data structure matches FTNewsDetail, especially the 'article' field.
    // If 'article' is stored as JSONB, Supabase should return it as a JS object.
    return data as FTNewsDetail;

  } catch (err) {
    // Catch errors from the try block (e.g., network issues or re-thrown Supabase errors)
    console.error('Error in fetchFTNewsDetail function:', err);
    // It's often better to let the page component handle the error state for UI rendering
    // rather than returning null for all error types here, unless it's specifically a 'not found' case.
    throw err; // Re-throw the error to be handled by the calling page component
  }
}

type Props = {
  params: { id: string };
};

// Removed generateMetadata function to resolve the error
export default function FTNewsDetailPage({ params }: Props) { // Removed async
  const id = params?.id;

  const { 
    currentArticle: newsItem, 
    articleLoading, 
    articleError, 
    fetchArticleById 
  } = useFTNewsContext();

  useEffect(() => {
    if (id) {
      fetchArticleById(id);
    }
  }, [id, fetchArticleById]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
        <p className="text-red-500 text-xl">Invalid News ID provided.</p>
        <Link href="/ft-news" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Back to FT News List
        </Link>
      </div>
    );
  }

  if (articleLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
        <p className="text-xl">Loading article...</p>
      </div>
    );
  }

  if (articleError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
        <p className="text-red-500 text-xl">Error: {articleError}</p>
        <Link href="/ft-news" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Back to FT News List
        </Link>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
        <p className="text-yellow-400 text-xl">FT News article with ID <span className='font-mono'>{id}</span> not found.</p>
        <Link href="/ft-news" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Back to FT News List
        </Link>
      </div>
    );
  }

  const { headline, subheadline, category, authors, published_timestamp, updated_at, main_image, body, page_title, page_url } = newsItem;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-10 px-4">
      <div className="container mx-auto max-w-3xl bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <Link href="/ft-news" className="text-blue-400 hover:text-blue-300 hover:underline mb-6 inline-block">
          &larr; Back to FT News List
        </Link>

        {category && (
          <p className="text-sm text-orange-400 mb-2">
            {category.text}
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{headline}</h1>
        {subheadline && (
          <p className="text-lg text-gray-400 mb-6">{subheadline}</p>
        )}

        <div className="flex flex-wrap items-center text-xs text-gray-500 mb-6">
          {authors && authors.length > 0 && (
            <span className="mr-3">By {authors.map(author => author.name).join(', ')}</span>
          )}
          {published_timestamp && (
            <span className="mr-3">Published: {new Date(published_timestamp).toLocaleString()}</span>
          )}
          {updated_at && (
            <span>Updated: {new Date(updated_at).toLocaleString()}</span>
          )}
        </div>

        {main_image && main_image.caption && (
          <figure className="my-6">
            {main_image.url && <img src={main_image.url} alt={main_image.altText || headline} className="w-full h-auto rounded-md mb-2" />}
            <figcaption className="text-xs text-gray-500 italic text-center">
              {main_image.caption}
            </figcaption>
          </figure>
        )}

        <article className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300 leading-relaxed space-y-4">
          {body && body.map((item, index) => {
            if (item.type === 'paragraph') {
              if (typeof item.content === 'string') {
                return <p key={index}>{item.content}</p>;
              } else if (Array.isArray(item.content)) {
                // Handle array of objects (e.g., for links within paragraphs)
                return (
                  <p key={index}>
                    {item.content.map((seg, segIndex) => 
                      seg.url ? (
                        <a key={segIndex} href={seg.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {seg.text}
                        </a>
                      ) : (
                        <span key={segIndex}>{seg.text}</span>
                      )
                    )}
                  </p>
                );
              }
            }
            return null;
          })}
        </article>
      </div>
    </div>
  );
}