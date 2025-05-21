// app/ft-news/FTNewsListComponent.tsx
'use client';

import Link from 'next/link';
import { useFTNewsContext } from '../contexts/FTNewsContext'; // Adjusted path

// Define the shape of an FT news item, consistent with context
interface FTNewsItem {
  id: string;
  page_url: string; 
  page_title: string;
  category?: {
    text: string;
    url: string;
  };
  headline: string;
  subheadline?: string;
  published_timestamp?: string; 
  created_at?: string;
}

export default function FTNewsListComponent() {
  const { newsItems, loading, error } = useFTNewsContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
        <p className="text-red-500 text-xl">Error loading news: {error}</p>
        <Link href="/" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Go Home
        </Link>
      </div>
    );
  }

  if (newsItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
        <p className="text-gray-400 text-xl">No FT news articles found.</p>
        <Link href="/" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {newsItems.map((item: FTNewsItem) => (
        <div key={item.id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          {item.category && (
            <p className="text-sm text-orange-400 mb-1">
              {item.category.text}
            </p>
          )}
          <Link href={`/ft-news/${item.id}`} legacyBehavior>
            <a className="text-2xl font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200 block mb-2">
              {item.headline}
            </a>
          </Link>
          {item.subheadline && (
            <p className="text-gray-400 mb-3 text-md">{item.subheadline}</p>
          )}
          <div className="text-xs text-gray-500">
            <span>Published: {item.published_timestamp || 'N/A'}</span>
            <span className="mx-2">|</span>
            <a href={item.page_url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 underline">
              Read on FT.com
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}