import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  const baseUrl = 'https://visionong.dpdns.org';
  
  try {
    // 获取最近的新闻文章
    const { data: newsItems } = await supabase
      .from('all_latest_news')
      .select('id, title, publication_time_utc, source, url')
      .order('publication_time_utc', { ascending: false })
      .limit(1000); // Google News sitemap 限制

    const newsUrls = newsItems?.map(item => {
      const pubDate = new Date(item.publication_time_utc).toISOString();
      return `
    <url>
      <loc>${item.url.startsWith('http') ? item.url : `${baseUrl}/ft-news/${item.id}`}</loc>
      <news:news>
        <news:publication>
          <news:name>Game Visioning</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${pubDate}</news:publication_date>
        <news:title><![CDATA[${item.title}]]></news:title>
        <news:keywords>AI, gaming, technology, ${item.source}</news:keywords>
      </news:news>
      <lastmod>${pubDate}</lastmod>
      <changefreq>never</changefreq>
    </url>`;
    }).join('') || '';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsUrls}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating news sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}