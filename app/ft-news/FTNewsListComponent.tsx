// app/ft-news/FTNewsListComponent.tsx
"use client"; // This component will likely need client-side interactivity

import React, { useState, useEffect, useContext } from 'react';
import { FTNewsItem } from './page'; // Import the interface from page.tsx
// import { FTNewsContext } from '../contexts/FTNewsContext'; // If you use context for fetching more or state management

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // If you add sorting UI

// Helper to format date (optional)
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Date not available';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return 'Invalid date';
  }
};

interface FTNewsListComponentProps {
  initialNewsItems: FTNewsItem[];
  initialHasMore: boolean;
  initialSortOrder: 'asc' | 'desc';
}

export default function FTNewsListComponent({
  initialNewsItems,
  initialHasMore,
  initialSortOrder,
}: FTNewsListComponentProps) {
  const [newsItems, setNewsItems] = useState<FTNewsItem[]>(initialNewsItems);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // For pagination logic
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  // const { fetchMoreNews, changeSortOrder } = useContext(FTNewsContext); // Example if using context

  // Placeholder for fetching more news items
  const loadMoreNews = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    // This is a placeholder. Replace with your actual data fetching logic,
    // possibly using a function from your FTNewsContext or a direct API call.
    // For example:
    // const nextPage = currentPage + 1;
    // const { data: moreItems, error, hasMore: newHasMore } = await fetchNewsFromSupabase(nextPage, PAGE_SIZE, sortOrder);
    // if (error) { console.error("Failed to load more news"); setIsLoading(false); return; }
    // setNewsItems(prevItems => [...prevItems, ...moreItems]);
    // setHasMore(newHasMore);
    // setCurrentPage(nextPage);

    // Simulate API call
    setTimeout(() => {
      // Replace with actual new items
      const newMockItems: FTNewsItem[] = []; // Fetch or generate new items
      if (newMockItems.length > 0) {
        setNewsItems(prev => [...prev, ...newMockItems]);
      }
      setHasMore(false); // Assume no more after this mock load
      setIsLoading(false);
    }, 1500);
  };// Placeholder for sort change handler
  const handleSortChange = (newSortOrder: 'asc' | 'desc') => {
    setSortOrder(newSortOrder);
    // Reset items and fetch new sorted list
    // setNewsItems([]);
    // setCurrentPage(1);
    // setIsLoading(true);
    // fetch initial sorted data...
    // This logic would be more complex, likely involving re-fetching from the server or context.
    console.log("Sort order changed to:", newSortOrder);
  };


  if (!newsItems.length && !isLoading && !initialNewsItems.length) {
    return <p className="text-center text-muted-foreground">No news articles found.</p>;
  }

  return (
    <div>
      {/* Optional: Sorting Dropdown
      <div className="mb-6 flex justify-end">
        <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => handleSortChange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
      */}

      {/* Responsive Grid for News Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item) => (
          <div key={item.id} className="flex flex-col">
            <div>
              {item.category && (
                <div>
                  <a
                    href={item.category.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-primary"
                  >
                    {item.category.text}
                  </a>
                </div>
              )}
              <div className="text-lg leading-tight">
                 <a
                    href={item.page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                   {item.headline || item.page_title}
                  </a>
              </div>
            </div>
            <div className="flex-grow">
              {item.subheadline && (
                <p className="text-sm text-muted-foreground">{item.subheadline}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {formatDate(item.published_timestamp || item.publishedtimestamputc || item.created_at)}
              </p>
            </div>
          </div>
        ))}

        {/* Skeleton loaders when loading more items */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => ( // Show 3 skeleton cards
            <div key={`skeleton-${index}`} className="flex flex-col">
              <div>
                <div className="h-4 w-1/4" />
                <div className="h-6 w-3/4 mt-2" />
              </div>
              <div>
                <div className="h-4 w-full mb-2" />
                <div className="h-4 w-5/6" />
              </div>
              <div>
                <div className="h-4 w-1/3" />
              </div>
            </div>
          ))}
      </div>

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <button onClick={loadMoreNews} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg">
            Load More News
          </button>
        </div>
      )}
      {isLoading && hasMore && (
         <div className="mt-8 text-center">
          <button disabled className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </button>
        </div>
      )}
    </div>
  );
}