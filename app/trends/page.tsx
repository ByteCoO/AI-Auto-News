import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTrendsData(subredditFilter?: string, sortBy: string = 'top', query?: string) {
  let supabaseQuery = supabase.from('reddit_posts').select('*');
  if (query) {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,selftext.ilike.%${query}%`);
  }
  if (sortBy === 'newest') {
    supabaseQuery = supabaseQuery.order('fetch_date', { ascending: false });
  } else {
    supabaseQuery = supabaseQuery.order('score', { ascending: false });
  }
  if (subredditFilter && subredditFilter !== 'all') {
    supabaseQuery = supabaseQuery.eq('subreddit', subredditFilter);
  }
  const { data, error } = await supabaseQuery.limit(100);
  if (error) return [];
  return data || [];
}

async function getStats() {
  const { count } = await supabase.from('reddit_posts').select('*', { count: 'exact', head: true });
  return count || 0;
}

async function getSubreddits() {
  const { data } = await supabase.from('reddit_posts').select('subreddit');
  const uniqueSubs = Array.from(new Set(data?.map(d => d.subreddit) || []));
  return ['all', ...uniqueSubs];
}

export default async function TrendsDashboard({ 
  searchParams 
}: { 
  searchParams: { sub?: string, view?: string, sort?: string, q?: string } 
}) {
  const currentSub = searchParams.sub || 'all';
  const isCompact = searchParams.view !== 'cards';
  const currentSort = searchParams.sort || 'top';
  const searchQuery = searchParams.q || '';
  
  const [posts, subreddits, totalCount] = await Promise.all([
    getTrendsData(currentSub, currentSort, searchQuery),
    getSubreddits(),
    getStats()
  ]);

  const getUrl = (params: Record<string, string>) => {
    const newParams = new URLSearchParams({ 
        sub: currentSub, 
        view: isCompact ? 'compact' : 'cards', 
        sort: currentSort,
        q: searchQuery,
        ...params 
    });
    return `/trends?${newParams.toString()}`;
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 pt-24 bg-white dark:bg-[#090B10] text-gray-900 dark:text-[#E2E8F0] transition-colors duration-300">
      
      {/* --- PREMIUM HEADER --- */}
      <header className="relative overflow-hidden bg-gray-100 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 mb-12 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Intelligence Engine Live
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-[10px] font-mono uppercase tracking-widest">
              Monitoring {totalCount} Signals
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 dark:from-white via-gray-700 dark:via-blue-200 to-gray-500">
            Commercial Signal Radar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl font-light">
            Real-time tracking of high-intent user signals from premium developer and startup communities.
          </p>
        </div>
      </header>

      <div className="w-full">
        {/* --- TOOLBAR --- */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 border-b border-gray-200 dark:border-gray-800 pb-8">
          <div className="flex flex-col gap-4 w-full xl:w-auto">
            <div className="flex flex-wrap gap-2">
              {subreddits.map(sub => (
                <Link
                  key={sub}
                  href={getUrl({ sub: sub })}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    currentSub === sub 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {sub === 'all' ? '🌐 ALL' : `r/${sub}`}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
                <Link href={getUrl({ sort: 'top' })} className={`px-4 py-1.5 rounded-md text-xs font-bold ${currentSort === 'top' ? 'bg-orange-600 text-white' : 'text-gray-500'}`}>🔥 Top</Link>
                <Link href={getUrl({ sort: 'newest' })} className={`px-4 py-1.5 rounded-md text-xs font-bold ${currentSort === 'newest' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>🆕 Newest</Link>
              </div>
              <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
                <Link href={getUrl({ view: 'compact' })} className={`px-4 py-1.5 rounded-md text-xs font-bold ${isCompact ? 'bg-white dark:bg-gray-800 shadow-sm dark:shadow-none text-gray-900 dark:text-white' : 'text-gray-500'}`}>Compact</Link>
                <Link href={getUrl({ view: 'cards' })} className={`px-4 py-1.5 rounded-md text-xs font-bold ${!isCompact ? 'bg-white dark:bg-gray-800 shadow-sm dark:shadow-none text-gray-900 dark:text-white' : 'text-gray-500'}`}>Cards</Link>
              </div>
            </div>
          </div>
          <form action="/trends" method="GET" className="relative group w-full xl:w-96">
             <input type="hidden" name="sub" value={currentSub} />
             <input type="hidden" name="view" value={isCompact ? 'compact' : 'cards'} />
             <input type="hidden" name="sort" value={currentSort} />
             <input 
                type="text" 
                name="q" 
                defaultValue={searchQuery}
                placeholder="Search keywords..."
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-11 py-3 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-all"
             />
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">?</div>
          </form>
        </div>

        {/* --- LIST VIEW --- */}
        {posts.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-900/30 rounded-3xl p-24 text-center border border-dashed border-gray-300 dark:border-gray-800">
            <p className="text-2xl text-gray-400 font-light italic">No signals found.</p>
          </div>
        ) : isCompact ? (
          <div className="bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl w-full">
            <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {posts.map((post, idx) => {
                const finalUrl = post.permalink?.startsWith('http') ? post.permalink : `https://reddit.com${post.permalink}`;
                const fetchTime = post.fetch_date ? format(new Date(post.fetch_date), 'MM-dd HH:mm') : 'N/A';
                return (
                  <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] flex items-start gap-5 transition-colors group">
                    <span className="text-gray-400 dark:text-gray-700 font-mono text-xs mt-1.5 w-8 text-right">{idx + 1}.</span>
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-3 mb-1.5">
                        <a href={finalUrl} target="_blank" rel="noopener noreferrer" className="text-[16px] font-medium text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                          {post.title}
                        </a>
                        <span className="text-gray-400 dark:text-gray-600 text-[10px] font-mono">[{fetchTime}]</span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-gray-500">
                        <span className="font-black text-orange-600">{post.score} PTS</span>
                        <span>BY {post.author}</span>
                        <span className="text-blue-600 dark:text-blue-500/80 font-black uppercase tracking-widest text-[10px]">r/{post.subreddit}</span>
                        {post.intent_type && (
                          <div className="flex gap-2 ml-2">
                            <span className="text-purple-600 dark:text-purple-400 font-black uppercase text-[9px] bg-purple-500/5 px-1.5 py-0.5 rounded border border-purple-500/10">{post.intent_type}</span>
                            {post.buy_signal && <span className="text-green-600 dark:text-green-500 font-black text-[9px] bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">💰 BUY</span>}
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${post.pain_level >= 4 ? 'bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20' : 'bg-orange-500/10 text-orange-600 dark:text-orange-500'}`}>
                              PAIN: {post.pain_level}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
            {posts.map((post) => {
               const finalUrl = post.permalink?.startsWith('http') ? post.permalink : `https://reddit.com${post.permalink}`;
               const fetchTime = post.fetch_date ? format(new Date(post.fetch_date), 'MM-dd HH:mm') : 'N/A';
               return (
                <div key={post.id} className="group bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/40 hover:shadow-2xl transition-all flex flex-col">
                  <div className="p-7 flex-grow">
                    <div className="flex justify-between items-center mb-6">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20 uppercase tracking-widest">
                        r/{post.subreddit}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-600 font-mono tracking-tighter">{fetchTime}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      <a href={finalUrl} target="_blank" rel="noopener noreferrer">{post.title}</a>
                    </h2>
                    {post.ai_summary && (
                      <div className="bg-gray-50 dark:bg-gray-900/80 rounded-2xl p-4 mb-4 border-l-4 border-purple-500">
                        <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">{post.ai_summary}</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 dark:bg-black/30 px-7 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex gap-2">
                       {post.intent_type && <span className="text-[9px] font-black px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md">{post.intent_type}</span>}
                       {post.pain_level && <span className={`text-[9px] font-black px-2 py-1 rounded-md ${post.pain_level >= 4 ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>PAIN: {post.pain_level}</span>}
                    </div>
                    {post.buy_signal && <span className="text-[9px] font-black bg-green-500 text-black px-2 py-1 rounded-md shadow-lg shadow-green-500/20">BUY</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
