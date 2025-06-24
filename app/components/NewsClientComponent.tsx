'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Interface for news items, aligned with your database structure
interface NewsItem {
  id: string;
  title: string;
  url?: string;
  source?: string;
  category?: string;
  publication_time_utc?: string;
  image_alt_text?: string;
  original_timestamp?: string;
}

// Interface for channel buttons
interface ChannelUI {
  id: string;
  displayName: string;
  name: string;
}

// Configuration mapping channel names to their associated keywords/categories
const channelKeywordsConfig: Record<string, string[]> = {
  "Market & Finance": [
    "Sovereign bonds", "Currencies", "Inflation & Prices", "Finance", "Markets, European Markets",
    "US interest rates", "JPMorgan Chase & Co", "Chinese economy", "Bank of England",
    "UK house prices", "Markets, Commodities", "Special purpose acquisition companies (SPACs)",
    "Bitcoin", "Federal Reserve", "Russian business & finance", "HSBC Holdings PLC",
    "FT Alphaville", "Deals", "FT Asset Management", "Asian Markets", "Unhedged Podcast",
    "ETFs & Mutual Funds", "Business, Finance", "Bonds", "Markets", "Commodities", "Euro",
    "Green bonds", "Hedge funds", "Odd Lots", "Due Diligence", "Central Banks", "Eco Week Ahead", "Macro Matters",
    "Sustainability, Sustainable Finance & Reporting", "Behind the Money podcast", "The Economics Show podcast"
  ],
  "International": [
    "Venezuela", "World, India", "Northern Ireland", "World, Middle East", "Americas", "Asia Pacific",
    "US", "United Kingdom", "Japanese politics & policy", "World, China", "World, Asia Pacific",
    "Sudan", "US-Iran tensions", "Europe Express", "World, United States", "India Business Briefing",
    "ANALYSIS", "World, Africa", "United States", "Middle East", "Belarus", "FirstFT",
    "German politics", "Spain", "Chinese politics & policy", "Iran", "World, Americas",
    "Middle East war", "US foreign policy", "Pakistan's politics", "Europe",
    "TOPIC:SPORTS-RUGBY-UNION", "TOPIC:SPORTS-MOTORCYCLE-RACING",
    "UK society"
  ],
  "Business": [
    "Inditex", "Rio Tinto PLC", "OPEC", "Liberty Media Corp", "Utilities", "Business, Retail & Consumer",
    "Rolls-Royce Holdings PLC", "IBM Corp", "Credit cards", "TotalEnergies", "Entain PLC",
    "Boston Consulting Group Inc", "Business, Energy", "Novo Nordisk AS", "British Steel Ltd",
    "Wealth management", "US Securities and Exchange Commission", "Transportation", "Residential",
    "Cobalt", "The CEO", "Aerospace & Defense", "ASX Ltd", "Thames Water", "Pop Mart", "Consumer",
    "Media", "Business, Aerospace & Defense", "Air India Ltd", "Business, Environment", "Trafigura",
    "Drugs research", "Oil & Gas industry", "Entrepreneurship", "Industries", "Oil",
    "Greene King PLC", "Aerospace & Defence", "Media & Telecom", "Meta Platforms",
    "The Trump Organization", "Abu Dhabi National Oil Co", "Kering SA", "Airlines",
    "Travel & leisure industry", "Pharmaceuticals sector", "Tech start-ups", "TikTok Inc",
    "ADAS, AV & Safety", "Autos & Transportation", "Business", "Jobs", "Governance", "World at Work",
    "Transport Fuels", "Eutelsat SA"
  ],"Technology": [
    "Crypto", "Military technology", "Technology sector", "Artificial intelligence", "Energy Transition",
    "Technology", "AI", "Cyber warfare", "Biotech", "Bitcoin", "Tech start-ups", "ADAS, AV & Safety", "Sustainability"
  ],
  "Politics & Policy": [
    "Inside Politics", "US immigration", "Government", "Politics & Policy", "UK government spending",
    "Trump tariffs", "UK defence spending", "EU energy", "Nuclear energy", "National Health Service",
    "Legal, Government", "US politics & policy", "UK welfare reform", "UK economy",
    "EU financial regulation", "EU business regulation", "Legal", "Nato", "EU defence",
    "UK immigration", "UK trade", "UK industrial strategy", "Legal services", "Correction",
    "Japanese politics & policy", "German politics", "Chinese politics & policy", "US foreign policy",
    "Pakistan's politics", "US Securities and Exchange Commission", "Human Rights", "UK politics", "Legal, Litigation"
  ],
  "Opinion/Commentary": [
    "Tim Harford", "The editorial board", "James Fontanella-Khan", "Robert Armstrong", "Chloe Dalton",
    "Pilita Clark", "Tej Parikh", "Ruchir Sharma", "Edward Luce", "Amrita Sen", "Lucy Warwick-Ching",
    "Fred Smith", "Anjana Ahuja", "The Monday Interview", "Martin Wolf", "Duncan Weldon",
    "Jemima Kelly", "Explainer", "Fatih Birol", "David Stevenson", "Robert Shrimsley",
    "Irina Hemmers", "Opinion", "Commentary", "The Big Read", "Thomas Hale", "Enrico Letta",
    "Patrick Jenkins", "Carl Benedikt Frey", "Letter", "The Weekend Essay"
  ],
  "Arts & Culture": [
    "The Art Market", "Eight theatre shows to see in London now", "Arts", "Design", "Photo essay",
    "London’s summer art scene 2025", "The Life of a Song", "Books", "Visual Arts",
    "Crossword", "Interiors", "Television", "Summer books 2025: the best titles of the year so far",
    "Collecting", "Theatre", "Kneecap", "English"
  ],
  "Sports": [
    "Sports", "Sports, Baseball", "Scoreboard", "TOPIC:SPORTS-RUGBY-UNION", "Basketball",
    "TOPIC:SPORTS-MOTORCYCLE-RACING", "NBA", "Baseball", "Cricket", "Soccer", "Sports, Soccer", "Rugby"
  ],
  "Lifestyle": [
    "At Home with the FT", "FT Globetrotter", "Travel", "Accommodation in New York City",
    "FT Schools", "How to coast it – great escapes for summer 2025", "FT Schools geography",
    "HTSI", "New York City", "Lifestyle", "Health", "Interiors"
  ],
  "Columns/People": [
    "Tim Harford", "Martin Wolf", "Pilita Clark", "Edward Luce"
  ],
  "Other/Special": [
     "null", "", "Climate graphic of the week", "Sustainability", "News", "Transcript",
     "FT subscriber event", "Special Report", "FT News Briefing podcast"
  ]
};// Define the channels for UI display in English
const uiChannels: ChannelUI[] = [
  { id: "market_finance", displayName: "Market & Finance", name: "Market & Finance" },
  { id: "international", displayName: "International", name: "International" },
  { id: "business", displayName: "Business", name: "Business" },
  { id: "technology", displayName: "Technology", name: "Technology" },
  { id: "politics_policy", displayName: "Politics & Policy", name: "Politics & Policy" },
  { id: "opinion_commentary", displayName: "Opinion", name: "Opinion/Commentary" },
  { id: "arts_culture", displayName: "Arts & Culture", name: "Arts & Culture" },
  { id: "sports", displayName: "Sports", name: "Sports" },
  { id: "lifestyle", displayName: "Lifestyle", name: "Lifestyle" },
  { id: "columns_people", displayName: "Columns & People", name: "Columns/People" },
  { id: "all", displayName: "All News", name: "All News" },
];

const NewsClientComponent: React.FC = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>(uiChannels[0].id);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);const fetchNewsForChannel = useCallback(async (page: number, channelId: string) => {
    const currentChannel = uiChannels.find(c => c.id === channelId);
    if (!currentChannel) return;

    setIsLoading(true);
    
    let keywords: string[] = [];
    // If the channel is not "All News", get its specific keywords.
    // Otherwise, keywords remains an empty array, which the API now handles correctly.
    if (currentChannel.name !== "All News") {
      keywords = channelKeywordsConfig[currentChannel.name] || [];
    }
    
    try {
      const response = await fetch(`/api/news-by-channel?page=${page}&limit=10`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords }),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const { data, count } = await response.json();

      setNewsItems(prevItems => (page === 1 ? data : [...prevItems, ...data]));
      
      // Determine if there are more items to load based on the page and the total count from the API.
      // Assuming a limit of 10 items per page, which is hardcoded in the API.
      setHasMore((page * 10) < count);

    } catch (error) {
      console.error("Failed to fetch news:", error);
      // Optionally set an error state to show in the UI
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array is correct as this function is now stable.

  // Effect to fetch news when the channel changes
  useEffect(() => {
    setCurrentPage(1);
    setNewsItems([]);
    setHasMore(true);
    fetchNewsForChannel(1, selectedChannelId);
  }, [selectedChannelId, fetchNewsForChannel]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchNewsForChannel(nextPage, selectedChannelId);
  };return (
    <div className="py-8 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
        News Channels
      </h2>

      {/* Channel Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {uiChannels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setSelectedChannelId(channel.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-opacity-50
                        ${selectedChannelId === channel.id
                          ? 'bg-blue-600 text-white shadow-md focus:ring-blue-400'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400'
                        }`}
          >
            {channel.displayName}
          </button>
        ))}
      </div>

      {/* News Items Display */}
      <div className="max-w-4xl mx-auto">
        {newsItems.length > 0 ? (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-x-3 mb-1">
                  {item.source && <span>Source: <span className="font-medium text-gray-700 dark:text-gray-300">{item.source}</span></span>}
                  {item.category && <span>Category: <span className="font-medium text-gray-700 dark:text-gray-300">{item.category}</span></span>}
                </div>
                {item.publication_time_utc && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Published: {new Date(item.publication_time_utc).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-10">
              <p className="text-gray-600 dark:text-gray-400">No news items to display for this channel.</p>
            </div>
          )
        )}

        {isLoading && (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400">Loading news...</p>
          </div>
        )}

        {hasMore && !isLoading && newsItems.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsClientComponent;