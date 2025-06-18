import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

// This option forces the route to be dynamic, ensuring it fetches fresh data on every request.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) { // Add NextRequest
  try {
    const searchParams = request.nextUrl.searchParams;
    const sourceType = searchParams.get('sourceType');

    if (sourceType === 'multi') {
      const sourcesToFetch = [
        { name: 'Bloomberg', identifiers: ['Bloomberg', 'bloomberg'] },
        { name: 'FT', identifiers: ['FT'] },
        { name: 'Reuters', identifiers: ['Reuters'] }
      ];
      const itemsPerSource = 10; // 每个来源获取10条新闻
      let allNewsData: any[] = [];
      let cumulativeCount = 0;

      for (const sourceInfo of sourcesToFetch) {
        const queryResponse = await supabase
          .from('all_latest_news')
          .select('*', { count: 'exact' })
          .in('source', sourceInfo.identifiers)
          .order('publication_time_utc', { ascending: false })
          .limit(itemsPerSource);
        
        const sourceData = queryResponse.data;
        const sourceError = queryResponse.error;
        const sourceDbCount = queryResponse.count;

        if (sourceError) {
          console.error(`Supabase error fetching ${sourceInfo.name}:`, sourceError.message);
          // 如果一个来源失败，继续获取其他来源
        } else if (sourceData) {
          allNewsData = allNewsData.concat(sourceData);
          cumulativeCount += sourceDbCount || 0; 
        }
      }

      // 按发布日期对所有收集到的新闻进行降序排序
      allNewsData.sort((a, b) => {
        const dateA = a.publication_time_utc ? new Date(a.publication_time_utc).getTime() : 0;
        const dateB = b.publication_time_utc ? new Date(b.publication_time_utc).getTime() : 0;
        if (isNaN(dateA) && isNaN(dateB)) return 0; // 两者都无效，视为相等
        if (isNaN(dateA)) return 1; // 无效的 A 排在有效的 B 之后
        if (isNaN(dateB)) return -1; // 无效的 B 排在有效的 A 之后
        return dateB - dateA;
      });
      
      const camelCaseData = allNewsData.map(item => ({
        id: item.id,
        source: item.source,
        title: item.title,
        url: item.url,
        published_timestamp: item.original_timestamp,
        headline: item.title,
        page_title: item.title,
        publishedtimestamputc: item.publication_time_utc,
        created_at: item.created_at,
        rawPublicationTimeUTC: item.publication_time_utc,
      }));
      return NextResponse.json({ data: camelCaseData, count: cumulativeCount });

    } else {
      // “latest”或其他类型的逻辑 (默认分页) - 这部分保持不变
      let page = parseInt(searchParams.get('page') || '1', 10);
      let limit = parseInt(searchParams.get('limit') || '10', 10);
      let from = (page - 1) * limit;
      let to = from + limit - 1;

      let query = supabase
        .from('all_latest_news')
        .select('*', { count: 'exact' })
        .order('publication_time_utc', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message, data: [], count: 0 }, { status: 500 });
      }

      const camelCaseData = data.map(item => ({
        id: item.id,
        source: item.source,
        title: item.title,
        url: item.url,
        published_timestamp: item.original_timestamp,
        headline: item.title,
        page_title: item.title,
        publishedtimestamputc: item.publication_time_utc,
        created_at: item.created_at,
        rawPublicationTimeUTC: item.publication_time_utc,
      }));
      return NextResponse.json({ data: camelCaseData, count: count || 0 });
    }
  } catch (error) {
    console.error('API route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage, data: [], count: 0 }, { status: 500 });
  }
}