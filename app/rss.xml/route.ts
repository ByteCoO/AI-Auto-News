import { supabase } from '@/lib/supabaseClient';

const baseUrl = 'https://visionong.dpdns.org';

export async function GET() {
  // Fetch latest posts for the feed
  const { data: posts } = await supabase
    .from('reddit_posts')
    .select('id, title, subreddit, score, created_utc, fetch_date, permalink')
    .order('created_utc', { ascending: false })
    .limit(20);

  const items = (posts || []).map(post => {
    const pubDate = post.created_utc
      ? new Date(post.created_utc * 1000).toUTCString()
      : new Date(post.fetch_date).toUTCString();
    const link = post.permalink?.startsWith('http')
      ? post.permalink
      : `https://reddit.com${post.permalink}`;

    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="false">${baseUrl}/trends#${post.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.subreddit} | Score: ${post.score}]]></description>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Game Visioning - AI Trends Radar</title>
    <link>${baseUrl}</link>
    <description>Real-time tracking of high-intent user signals from premium developer and startup communities.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
