// app/Channels/page.tsx
import NewsClientComponent from '@/app/components/NewsClientComponent';
import { supabase } from '@/lib/supabaseClient';
import { Metadata } from 'next';
import { generateCategorySEO } from '@/app/components/SEOTemplate';
import { generateBreadcrumbStructuredData, StructuredDataScript } from '@/app/components/SEOTemplate';

// Define interfaces used, ensuring consistency
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
  ],
  "Technology": [
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
};

// This function fetches data on the server, mimicking the API route's logic.
async function getInitialNews(category: string | null) {
  const page = 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const channelName = category || "Market & Finance"; // Default to a channel
  const keywords = channelKeywordsConfig[channelName] || [];

  let query = supabase
    .from('all_latest_news')
    .select('*', { count: 'exact' });

  if (keywords.length > 0) {
    query = query.in('category', keywords);
  }

  query = query
    .order('publication_time_utc', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Supabase query failed for initial news fetch:', error);
    return { initialNewsItems: [], initialTotalCount: 0 };
  }

  return { initialNewsItems: data as NewsItem[], initialTotalCount: count || 0 };
}

// Dynamic metadata for the page
export async function generateMetadata({ searchParams }: { searchParams: { category?: string } }): Promise<Metadata> {
  const category = searchParams.category;

  if (category) {
    return generateCategorySEO({
      title: `${category} News Channel - Game Visioning`,
      description: `Explore the latest ${category} news and analysis. Stay updated with comprehensive coverage from trusted sources.`,
      category,
      canonical: `/Channels?category=${encodeURIComponent(category)}`,
    });
  }

  return generateCategorySEO({
    title: "News Channels - Curated Content from Top Sources | Game Visioning",
    description: "Access curated news from leading sources including Bloomberg, Financial Times, Reuters, and more. Stay informed with comprehensive channel coverage across technology, finance, business, and politics.",
    category: "News Channels",
    canonical: '/Channels',
  });
}

// The page is now an async Server Component
export default async function NewsClientPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category || null;
  const { initialNewsItems, initialTotalCount } = await getInitialNews(category);

  const uiChannels = [
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

  const currentChannel = uiChannels.find(c => c.name === category) || uiChannels[0];

  // 生成结构化数据
  const breadcrumbLD = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Channels', url: '/Channels' },
    ...(category ? [{ name: category, url: `/Channels?category=${encodeURIComponent(category)}` }] : []),
  ]);

  const channelsLD = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://visionong.dpdns.org/Channels${category ? `?category=${encodeURIComponent(category)}` : ''}`,
    name: category ? `${category} News Channel` : 'Game Visioning News Channels',
    description: category 
      ? `Latest ${category} news and analysis from trusted sources`
      : 'Curated news channels from top financial and technology sources',
    url: `https://visionong.dpdns.org/Channels${category ? `?category=${encodeURIComponent(category)}` : ''}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: initialTotalCount,
      itemListElement: initialNewsItems.slice(0, 5).map((item, index) => ({
        '@type': 'NewsArticle',
        position: index + 1,
        name: item.title,
        url: item.url || `https://visionong.dpdns.org/ft-news/${item.id}`,
        datePublished: item.publication_time_utc,
        author: {
          '@type': 'Organization',
          name: item.source || 'Game Visioning',
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbLD['itemListElement'],
    },
  };

  return (
    <>
      <StructuredDataScript data={breadcrumbLD} />
      <StructuredDataScript data={channelsLD} />
      
      <div className="container mx-auto p-4">
        {/* 面包屑导航 */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li><span className="mx-2">/</span></li>
            <li><a href="/Channels" className="hover:text-blue-600">Channels</a></li>
            {category && (
              <>
                <li><span className="mx-2">/</span></li>
                <li className="text-gray-900 dark:text-gray-100" aria-current="page">{category}</li>
              </>
            )}
          </ol>
        </nav>

        {/* 页面头部 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {category ? `${category} News Channel` : 'News Channels'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            {category 
              ? `Stay updated with the latest ${category} news and analysis from trusted sources.`
              : 'Access curated news from leading sources including Bloomberg, Financial Times, Reuters, and more.'
            }
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {initialTotalCount} articles available
          </div>
        </header>

        {/* Pass the server-fetched data as props to the client component */}
        <NewsClientComponent 
          initialNewsItems={initialNewsItems} 
          initialTotalCount={initialTotalCount}
          initialChannelId={currentChannel.id}
        />
      </div>
    </>
  );
}
