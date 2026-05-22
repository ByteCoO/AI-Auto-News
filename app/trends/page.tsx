import { supabase } from '@/lib/supabaseClient';
import TrendsClient from './TrendsClient';

export const dynamic = 'force-dynamic';

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

async function getInitialPosts(sort: string = 'today', sub: string = 'all', query: string = ''): Promise<Post[]> {
  let dbQuery = supabase.from('reddit_posts').select('*');

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,selftext.ilike.%${query}%`);
  }

  if (sub && sub !== 'all') {
    // 兼容数据库中带有 'r/' 前缀以及不带前缀的 subreddit 名称
    const subWithPrefix = sub.startsWith('r/') ? sub : `r/${sub}`;
    const subWithoutPrefix = sub.startsWith('r/') ? sub.substring(2) : sub;
    dbQuery = dbQuery.or(`subreddit.eq.${subWithPrefix},subreddit.eq.${subWithoutPrefix}`);
  }

  if (sort === 'newest') {
    dbQuery = dbQuery.order('created_utc', { ascending: false, nullsFirst: false });
  } else if (sort === 'today') {
    // 严格过滤：仅获取24小时内新创建的帖子。若 created_utc 为 null，则使用 fetch_date 兜底，防止旧的置顶高分帖霸榜
    const nowSec = Math.floor(Date.now() / 1000);
    const cutoff = nowSec - 24 * 60 * 60;
    const cutoffIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    dbQuery = dbQuery
      .or(`created_utc.gte.${cutoff},and(created_utc.is.null,fetch_date.gte.${cutoffIso})`)
      .order('score', { ascending: false });
  } else {
    dbQuery = dbQuery.order('score', { ascending: false });
  }

  const { data } = await dbQuery.limit(POSTS_PER_PAGE);
  return (data as Post[]) || [];
}

async function getSubreddits(): Promise<string[]> {
  const { data } = await supabase.from('reddit_posts').select('subreddit');
  const uniqueSubs = Array.from(new Set(data?.map(d => d.subreddit) || []));
  return ['all', ...uniqueSubs];
}

async function getTotalCount(): Promise<number> {
  const { count } = await supabase.from('reddit_posts').select('*', { count: 'exact', head: true });
  return count || 0;
}

export default async function TrendsPage({
  searchParams,
}: {
  searchParams: { sub?: string; sort?: string; q?: string; view?: string };
}) {
  const currentSub = searchParams.sub || 'all';
  const currentSort = searchParams.sort || 'today';
  const searchQuery = searchParams.q || '';
  const isCompact = searchParams.view !== 'cards';

  const [posts, subreddits, totalCount] = await Promise.all([
    getInitialPosts(currentSort, currentSub, searchQuery),
    getSubreddits(),
    getTotalCount(),
  ]);

  return (
    <TrendsClient
      initialPosts={posts}
      initialSubreddits={subreddits}
      initialTotalCount={totalCount}
      currentSub={currentSub}
      currentSort={currentSort}
      searchQuery={searchQuery}
      isCompact={isCompact}
    />
  );
}
