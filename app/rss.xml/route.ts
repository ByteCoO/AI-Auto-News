import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  const baseUrl = 'https://visionong.dpdns.org';
  
  try {
    // 获取最新的文章
    const { data: articles } = await supabase
      .from('all_latest_news')
      .select('id, title, publication_time_utc, source, url')
      .order('publication_time_utc', { ascending: false })
      .limit(50);

    const rssItems = articles?.map(article => {
      const pubDate = new Date(article.publication_time_utc).toUTCString();
      const link = article.url.startsWith('http') ? article.url : `${baseUrl}/ft-news/${article.id}`;
      
      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[Latest news from ${article.source}]]></description>
      <pubDate>${pubDate}</pubDate>
      <source>${article.source}</source>
      <category>Technology</category>
    </item>`;
    }).join('') || '';

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Game Visioning - Latest News</title>
    <description>Your hub for AI, gaming, and technology news</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Game Visioning</title>
      <link>${baseUrl}</link>
    </image>
${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}