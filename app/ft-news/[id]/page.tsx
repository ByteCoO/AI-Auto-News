// app/ft-news/[id]/page.tsx
'use client';

import { useEffect } from 'react';
import { useFTNewsContext } from '../../contexts/FTNewsContext';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';

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
  updated_at?: string;
  body?: FTArticleBodyItem[];
}

async function fetchFTNewsDetailServerSide(id: string): Promise<FTNewsDetail | null> {
  console.log(`Fetching FT news detail from Supabase for ID: ${id}`);
  try {
    const { data, error } = await supabase
      .from('FT_articles')
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
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data as FTNewsDetail;

  } catch (err) {
    console.error('Error in fetchFTNewsDetail function:', err);
    throw err;
  }
}

type Props = {
  params: { id: string };
};

export default function FTNewsDetailPage({ params }: Props) {
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
      <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-900 flex flex-col justify-center items-center p-4">
        <p className="text-red-500 text-xl">Invalid News ID provided.</p>
        <Link href="/ft-news" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Back to FT News List
        </Link>
      </div>
    );
  }

  if (articleLoading) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-900 flex flex-col justify-center items-center p-4">
        <p className="text-xl">Loading article...</p>
      </div>
    );
  }

  if (articleError) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-900 flex flex-col justify-center items-center p-4">
        <p className="text-red-500 text-xl">Error: {articleError}</p>
        <Link href="/ft-news" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Back to FT News List
        </Link>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-900 flex flex-col justify-center items-center p-4">
        <p className="text-yellow-400 text-xl">FT News article with ID <span className='font-mono'>{id}</span> not found.</p>
        <Link href="/ft-news" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Back to FT News List
        </Link>
      </div>
    );
  }

  const { headline, subheadline, category, authors, published_timestamp, updated_at, main_image, body, page_title, page_url } = newsItem;

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-white dark:text-gray-200 text-gray-900 py-10 px-4">
      <div className="container mx-auto max-w-3xl dark:bg-gray-800 bg-gray-100 p-6 sm:p-8 rounded-lg shadow-xl">
        <Link href="/ft-news" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline mb-6 inline-block">
          &larr; Back to FT News List
        </Link>

        {category && (
          <p className="text-sm text-orange-400 mb-2">
            {category.text}
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold dark:text-white text-gray-900 mb-3">{headline}</h1>
        {subheadline && (
          <p className="text-lg dark:text-gray-400 text-gray-600 mb-6">{subheadline}</p>
        )}

        <div className="flex flex-wrap items-center text-xs dark:text-gray-500 text-gray-600 mb-6">
          {authors && authors.length > 0 && (
            <span className="mr-3">By {authors.map(author => author.name).join(', ')}</span>
          )}
          {published_timestamp && (
            <span className="mr-3">Published: {new Date(published_timestamp).toLocaleString()}</span>
          )}
          {updated_at && (
            <span className="mr-3">Updated: {new Date(updated_at).toLocaleString()}</span>
          )}
         
          {newsItem.created_at && (
            <span>Added: {new Date(newsItem.created_at).toLocaleString()}</span> 
          )}
        </div>

        {main_image && main_image.caption && (
          <figure className="my-6">
            {main_image.url && <img src={main_image.url} alt={main_image.altText || headline} className="w-full h-auto rounded-md mb-2" />}
            <figcaption className="text-xs dark:text-gray-500 text-gray-600 italic text-center">
              {main_image.caption}
            </figcaption>
          </figure>
        )}

        <article className="prose dark:prose-invert prose-sm sm:prose-base max-w-none dark:text-gray-300 text-gray-800 leading-relaxed space-y-4">
          {body && body.map((item, index) => {
            if (item.type === 'paragraph') {
              if (typeof item.content === 'string') {
                return <p key={index}>{item.content}</p>;
              } else if (Array.isArray(item.content)) {
                return (
                  <p key={index}>
                    {item.content.map((seg, segIndex) => 
                      seg.url ? (
                        <a key={segIndex} href={seg.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
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