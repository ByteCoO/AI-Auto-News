'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';
import { InfiniteScrollContainer } from './InfiniteScroll';

const POSTS_PER_PAGE = 20;

interface Post {
  id: string;
  title: string;
  score: number;
  num_comments?: number;
  created_utc?: number;
  author: string;
  subreddit: string;
  permalink: string;
  fetch_date: string;
  intent_type?: string;
  buy_signal?: boolean;
  pain_level?: number;
  ai_summary?: string;
}

export default function TrendsDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSub = searchParams.get('sub') || 'all';
  const isCompact = searchParams.get('view') !== 'cards';
  const currentSort = searchParams.get('sort') || 'top';
  const searchQuery = searchParams.get('q') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [subreddits, setSubreddits] = useState<string[]>(['all']);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setPage(1);
    
    // Get posts
    let query = supabase.from('reddit_posts').select('*');
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,selftext.ilike.%${searchQuery}%`);
    }
    
    if (currentSort === 'newest') {
      query = query.order('created_utc', { ascending: false, nullsFirst: false });
    } else if (currentSort === 'today') {
      const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
      query = query.gte('created_utc', twentyFourHoursAgo).order('score', { ascending: false });
    } else {
      query = query.order('score', { ascending: false });
    }
    
    if (currentSub && currentSub !== 'all') {
      query = query.eq('subreddit', currentSub);
    }

    const { data: postsData, error: postsError } = await query.limit(POSTS_PER_PAGE);
    
    if (postsError) {
      console.error('Error loading posts:', postsError);
    } else {
      setPosts(postsData || []);
      setHasMore((postsData || []).length >= POSTS_PER_PAGE);
    }

    // Get statistics
    const { count } = await supabase.from('reddit_posts').select('*', { count: 'exact', head: true });
    setTotalCount(count || 0);

    // Get Subreddits
    const { data: subData } = await supabase.from('reddit_posts').select('subreddit');
    const uniqueSubs = Array.from(new Set(subData?.map(d => d.subreddit) || []));
    setSubreddits(['all', ...uniqueSubs]);

    setLoading(false);
  }, [currentSub, currentSort, searchQuery]);

  // Load more data
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const from = (nextPage - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    let query = supabase.from('reddit_posts').select('*');
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,selftext.ilike.%${searchQuery}%`);
    }
    
    if (currentSort === 'newest') {
      query = query.order('created_utc', { ascending: false, nullsFirst: false });
    } else if (currentSort === 'today') {
      const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
      query = query.gte('created_utc', twentyFourHoursAgo).order('score', { ascending: false });
    } else {
      query = query.order('score', { ascending: false });
    }
    
    if (currentSub && currentSub !== 'all') {
      query = query.eq('subreddit', currentSub);
    }

    const { data, error } = await query.range(from, to);
    
    if (error) {
      console.error('Error loading more posts:', error);
      setLoadingMore(false);
      return;
    }

    if (data && data.length > 0) {
      setPosts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newUniquePosts = data.filter(p => !existingIds.has(p.id));
        return [...prev, ...newUniquePosts];
      });
      setPage(nextPage);
      if (data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);
  }, [currentSub, currentSort, searchQuery, page, loadingMore, hasMore]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

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

  const getPostUrl = (post: Post) => {
    return post.permalink?.startsWith('http') ? post.permalink : `https://reddit.com${post.permalink}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#090B10] pt-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-500/20 border-t-yellow-500"></div>
          <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">Loading signals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-8 pt-24 bg-white dark:bg-[#090B10] text-gray-900 dark:text-[#E2E8F0] transition-colors duration-300">
      {/* Header */}
      <header className="relative overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-yellow-500/20 rounded-3xl p-8 mb-12 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 dark:from-yellow-500/10 dark:to-amber-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 dark:from-blue-500/8 dark:to-purple-500/8 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-4 py-1.5 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20 border border-yellow-500/30 dark:border-yellow-500/40 text-yellow-700 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-lg shadow-yellow-500/10">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></span>
              Intelligence Engine Live
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-[10px] font-mono uppercase tracking-widest">
              Monitoring <span className="text-yellow-600 dark:text-yellow-400 font-bold">{totalCount}</span> Signals
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
            <span className="bg-gradient-to-r from-gray-900 via-yellow-700 to-gray-900 dark:from-white dark:via-yellow-400 dark:to-white bg-clip-text text-transparent">
              Commercial Signal Radar
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl font-light">
            Real-time tracking of high-intent user signals from premium developer and startup communities.
          </p>
        </div>
      </header>

      <div className="w-full">
        {/* Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 border-b border-gray-200 dark:border-yellow-500/20 pb-8">
          <div className="flex flex-col gap-4 w-full xl:w-auto">
            <div className="flex flex-wrap gap-2">
              {subreddits.map(sub => (
                <Link
                  key={sub}
                  href={getUrl({ sub: sub })}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    currentSub === sub
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 dark:from-yellow-400 dark:to-amber-400 text-gray-900 shadow-lg shadow-yellow-500/30 dark:shadow-yellow-500/20'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {sub === 'all' ? '🌐 ALL' : sub}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-yellow-500/20">
                <Link href={getUrl({ sort: 'top' })} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${currentSort === 'top' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 dark:from-yellow-400 dark:to-amber-400 text-gray-900 shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'}`}>🔥 Top</Link>
                <Link href={getUrl({ sort: 'today' })} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${currentSort === 'today' ? 'bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'}`}>⚡ Today Hot</Link>
                <Link href={getUrl({ sort: 'newest' })} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${currentSort === 'newest' ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'}`}>🆕 Newest</Link>
              </div>
              <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-yellow-500/20">
                <Link href={getUrl({ view: 'compact' })} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${isCompact ? 'bg-white dark:bg-gray-800 shadow-sm dark:shadow-none text-gray-900 dark:text-white border border-yellow-500/30 dark:border-yellow-500/40' : 'text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'}`}>Compact</Link>
                <Link href={getUrl({ view: 'cards' })} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${!isCompact ? 'bg-white dark:bg-gray-800 shadow-sm dark:shadow-none text-gray-900 dark:text-white border border-yellow-500/30 dark:border-yellow-500/40' : 'text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'}`}>Cards</Link>
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
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-yellow-500/20 rounded-xl px-11 py-3 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:border-yellow-500 dark:focus:border-yellow-400 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-600 dark:text-yellow-400 font-mono">?</div>
          </form>
        </div>

        {/* Posts List with Infinite Scroll */}
        <InfiniteScrollContainer onLoadMore={loadMorePosts} hasMore={hasMore} loading={loadingMore}>
          {posts.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-900/30 rounded-3xl p-24 text-center border border-dashed border-gray-300 dark:border-gray-800">
              <p className="text-2xl text-gray-400 font-light italic">No signals found.</p>
            </div>
          ) : isCompact ? (
            <div className="bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl w-full">
              <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {posts.map((post, idx) => {
                  const finalUrl = getPostUrl(post);
                  const fetchTime = post.fetch_date ? format(new Date(post.fetch_date), 'MM-dd HH:mm') : 'N/A';
                  const createdTime = post.created_utc 
                    ? format(new Date(post.created_utc * 1000), 'yyyy-MM-dd HH:mm') 
                    : (post.fetch_date ? format(new Date(post.fetch_date), 'yyyy-MM-dd HH:mm') : 'N/A');
                  
                  return (
                    <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] flex items-start gap-5 transition-colors group">
                      <span className="text-gray-400 dark:text-gray-700 font-mono text-xs mt-1.5 w-8 text-right">{idx + 1}.</span>
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                          <a href={finalUrl} target="_blank" rel="noopener noreferrer" className="text-[16px] font-medium text-gray-900 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all">
                            {post.title}
                          </a>
                          <span className="text-gray-500 dark:text-yellow-400 text-[10px] font-mono font-bold" title={`Fetched: ${fetchTime}`}>[{createdTime}]</span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400">
                          <span className="font-black text-orange-600 dark:text-orange-400">👍 {post.score}</span>
                          <span className="font-black text-blue-600 dark:text-blue-400">💬 {post.num_comments || 0}</span>
                          <span className="dark:text-gray-300">BY {post.author}</span>
                          <span className="text-yellow-600 dark:text-yellow-400 font-black uppercase tracking-widest text-[10px]">{post.subreddit}</span>
                          {post.intent_type && (
                            <div className="flex gap-2 ml-2">
                              <span className="text-purple-600 dark:text-purple-400 font-black uppercase text-[9px] bg-purple-500/5 px-1.5 py-0.5 rounded border border-purple-500/10">{post.intent_type}</span>
                              {post.buy_signal && <span className="text-green-600 dark:text-green-500 font-black text-[9px] bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">💰 BUY</span>}
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${post.pain_level !== undefined && post.pain_level >= 4 ? 'bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20' : 'bg-orange-500/10 text-orange-600 dark:text-orange-500'}`}>
                                PAIN: {post.pain_level ?? 'N/A'}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
              {posts.map((post) => {
                const finalUrl = getPostUrl(post);
                const fetchTime = post.fetch_date ? format(new Date(post.fetch_date), 'MM-dd HH:mm') : 'N/A';
                const createdTime = post.created_utc 
                  ? format(new Date(post.created_utc * 1000), 'yyyy-MM-dd HH:mm') 
                  : (post.fetch_date ? format(new Date(post.fetch_date), 'yyyy-MM-dd HH:mm') : 'N/A');
                
                return (
                  <div key={post.id} className="group bg-white dark:bg-[#11141B] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:border-yellow-500/50 dark:hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all flex flex-col">
                    <div className="p-7 flex-grow">
                      <div className="flex justify-between items-center mb-6">
                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20 text-yellow-700 dark:text-yellow-400 text-[10px] font-black rounded-full border border-yellow-500/30 dark:border-yellow-500/40 uppercase tracking-widest shadow-sm">
                          {post.subreddit}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-yellow-400 font-mono font-bold tracking-tighter" title={`Fetched: ${fetchTime}`}>{createdTime}</span>
                      </div>
                      <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors leading-snug">
                        <a href={finalUrl} target="_blank" rel="noopener noreferrer">{post.title}</a>
                      </h2>
                      <div className="flex gap-4 mb-4 text-[11px] font-bold">
                        <span className="text-orange-600 dark:text-orange-400">👍 {post.score}</span>
                        <span className="text-blue-600 dark:text-blue-400">💬 {post.num_comments || 0}</span>
                        <span className="text-gray-500 dark:text-gray-300">BY {post.author}</span>
                      </div>
                      {post.ai_summary && (
                        <div className="bg-gray-50 dark:bg-gray-900/80 rounded-2xl p-4 mb-4 border-l-4 border-purple-500">
                          <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">{post.ai_summary}</p>
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 dark:bg-black/30 px-7 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <div className="flex gap-2">
                        {post.intent_type && <span className="text-[9px] font-black px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md">{post.intent_type}</span>}
                        {post.pain_level !== undefined && <span className={`text-[9px] font-black px-2 py-1 rounded-md ${post.pain_level >= 4 ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>PAIN: {post.pain_level}</span>}
                      </div>
                      {post.buy_signal && <span className="text-[9px] font-black bg-green-500 text-black px-2 py-1 rounded-md shadow-lg shadow-green-500/20">BUY</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </InfiniteScrollContainer>
      </div>
    </div>
  );
}
