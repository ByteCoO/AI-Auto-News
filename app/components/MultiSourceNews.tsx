// app/components/MultiSourceNews.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowPathIcon, StarIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// Interface for individual news items displayed in the cards
export interface NewsItem {
  id: string; // Transformed from RawNewsItemFromDb.id
  timestamp: string; // Corresponds to RawNewsItemFromDb.original_timestamp
  headline: string; // Corresponds to RawNewsItemFromDb.title
  url?: string; // Corresponds to RawNewsItemFromDb.url
  details?: string; // This field is kept, but not directly in all_latest_news schema
  publicationTimeUTC?: string; // Corresponds to RawNewsItemFromDb.publication_time_utc
}

// Interface for the raw news data, resembling the all_latest_news table structure
// This is the new input data format for the component.
export interface RawNewsItemFromDb {
  id: number | string; // bigint in DB, can be string or number
  source: string; // "Bloomberg", "Reuters", "FT", etc.
  title: string;
  url?: string;
  original_timestamp?: string; // Raw timestamp string from DB
  publication_time_utc?: string; // Timestamp string with time zone from DB
  // image_alt_text?: string; // Available in DB, not used in NewsItem currently
  // category?: string; // Available in DB, not used in NewsItem currently
}

// This interface defines display-specific details for each source (logos, colors, etc.)
// It can be passed via props to customize appearance beyond defaults.
export interface SourceDisplayDetail {
  name: string; // Must match "Bloomberg", "FT", "Reuters" to be applied
  logoUrl?: string;
  logoLetter?: string;
  updateLabel?: string;
  cardBgColor?: string;
  cardCustomStyle?: CSSProperties;
  // cardTextColor is derived from cardBgColor, so not needed here
}

// Props for the MultiSourceNews component
interface MultiSourceNewsProps {
  rawNewsItems?: RawNewsItemFromDb[]; // The flat list of all news items from the database
  sourceDisplayDetails?: SourceDisplayDetail[]; // Optional array for custom display properties per source
}

// Configuration for the target sources that will always be displayed
const TARGET_SOURCES_CONFIG = [
  {
    key: 'bloomberg',name: 'Bloomberg',
    defaultLogoLetter: 'B',
    defaultColorHint: 'indigo-600',
    defaultLogoUrl: '', // Optional: e.g., '/logos/bloomberg.svg'
  },
  {
    key: 'ft',
    name: 'FT', // Financial Times
    defaultLogoLetter: 'F',
    defaultColorHint: 'rose-500',
    defaultLogoUrl: '', // Optional: e.g., '/logos/ft.png'
  },
  {
    key: 'reuters',
    name: 'Reuters',
    defaultLogoLetter: 'R',
    defaultColorHint: 'gray-700',
    defaultLogoUrl: '', // Optional: e.g., '/logos/reuters.svg'
  },
];

const MultiSourceNews: React.FC<MultiSourceNewsProps> = ({
  rawNewsItems = [],
  sourceDisplayDetails = [],
}) => {
  // Create a map of the provided display details for easy lookup by source name (case-insensitive)
  const displayDetailsMap = new Map(
    sourceDisplayDetails.map(detail => [detail.name.toLowerCase(), detail])
  );

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TARGET_SOURCES_CONFIG.map((targetConfig) => {
            // Find any custom display details for the current target source
            const customDisplay = displayDetailsMap.get(targetConfig.name.toLowerCase());

            // Filter rawNewsItems for the current target source
            const itemsForThisSource = rawNewsItems.filter(
              (item) => item.source?.toLowerCase() === targetConfig.name.toLowerCase()
            );

            // Transform filtered items into the NewsItem format for rendering
            const newsItems: NewsItem[] = itemsForThisSource.map((rawItem) => ({
              id: String(rawItem.id), // Ensure id is a string
              headline: rawItem.title,
              url: rawItem.url,
              timestamp: rawItem.original_timestamp || 'N/A', // Use original_timestamp
              publicationTimeUTC: rawItem.publication_time_utc,
              // details can be added if available from rawItem or derived
            }));

            // Prepare properties for display, using custom details, then targetConfig defaults
            const displayName = targetConfig.name;
            const logoUrl = customDisplay?.logoUrl || targetConfig.defaultLogoUrl;
            const logoLetter = customDisplay?.logoLetter || targetConfig.defaultLogoLetter;
            
            // Dynamic updateLabel based on news count, or custom if provided
            const updateLabel = customDisplay?.updateLabel || 
                                (newsItems.length > 0 ? `${newsItems.length} articles` : 'No data');
            
            const colorHintForLogo = customDisplay?.cardBgColor || targetConfig.defaultColorHint;
            const cardCustomStyle = customDisplay?.cardCustomStyle || {};

            // Logic for logo letter text color
            const logoLetterTextColorClass = 
              colorHintForLogo.includes('red') || colorHintForLogo.includes('rose') ? 'text-red-600' :
              colorHintForLogo.includes('indigo') ? 'text-indigo-600' :
              'text-gray-700';

            return (
              <div
                key={targetConfig.key}
                className={`rounded-xl shadow-lg p-5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col h-full`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {logoUrl ? (
                      <Image src={logoUrl} alt={`${displayName} logo`} width={28} height={28} className="rounded-sm object-contain" />
                    ) : logoLetter ? (
                      <div className={`w-7 h-7 flex items-center justify-center bg-white ${logoLetterTextColorClass} rounded-sm font-bold text-lg`} title={displayName}>
                        {logoLetter}
                      </div>
                    ) : (
                      <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-sm"></div> // Placeholder
                    )}
                    <span className="font-semibold text-md sm:text-lg whitespace-nowrap">{displayName}</span>
                    <span className={`text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md whitespace-nowrap ${newsItems.length === 0 && 'opacity-70'}`}>
                      {updateLabel}
                    </span>
                  </div>
                {/*   <div className="flex items-center space-x-1.5 sm:space-x-2 opacity-80">
                    <ArrowPathIcon className="h-5 w-5 cursor-pointer hover:opacity-100" />
                    <StarIcon className="h-5 w-5 cursor-pointer hover:opacity-100" />
                    <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer hover:opacity-100" />
                  </div> */}
                </div>

                {/* News Items List */}
                {newsItems.length > 0 ? (
                  <ul 
                    className="space-y-3 flex-grow scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent hover:scrollbar-thumb-slate-400 active:scrollbar-thumb-slate-500 dark:hover:scrollbar-thumb-slate-600 dark:active:scrollbar-thumb-slate-500" 
                    style={cardCustomStyle}
                  >
                    {newsItems.map((item) => (
                      <li key={item.id} className="border-l-2 border-slate-200 dark:border-slate-700 pl-3 py-1 dark:text-[#FFD700]">
                        <div className="text-xs opacity-70 mb-0.5 dark:text-white">
                          {item.publicationTimeUTC
                            ? format(new Date(item.publicationTimeUTC), 'dd MMM')
                            : item.timestamp}
                        </div>
                        {item.url ? (
                          <Link href={item.url} className="text-sm sm:text-base hover:underline">
                            {item.headline}
                          </Link>) : (
                          <span className="text-sm sm:text-base">{item.headline}</span>
                        )}
                        {item.details && <p className="text-xs opacity-60 mt-0.5">{item.details}</p>}
                      </li>
                    ))}</ul>
                ) : (
                  <div className="flex-grow flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No news items available for {displayName}.
                  </div>
                )}
              </div>
            );
          })}</div>
      </div>
    </section>
  );
};

export default MultiSourceNews;