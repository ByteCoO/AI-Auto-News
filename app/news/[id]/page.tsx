import { supabase } from '../../lib/supabase'; // 確保路徑正確
import Link from 'next/link'; // 導入 Link 組件
import NewsDetailClient from './NewsDetailClient'; // 导入新的客户端组件
import { Metadata, ResolvingMetadata } from 'next';

interface NewsItem {
  id: number;
  created_at: string;
  News: {
    title?: string;
    content?: string;
    // 可以根據需要添加其他字段
  } | null;
}

async function fetchNewsDetail(id: string): Promise<NewsItem | null> {
  try {
    const { data, error: fetchError } = await supabase
      .from('NSD')
      .select('id, created_at, News')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Supabase fetch detail error:", fetchError);
      if (fetchError.code === 'PGRST116') { // PostgREST code for 'Searched item was not found'
         return null;
      } else {
         throw new Error(`Supabase Error: ${fetchError.message}`);
      }
    }

    if (!data) {
      return null;
    }

    return data as NewsItem;

  } catch (err) {
     console.error("Error fetching news detail:", err);
     throw err;
  }
}

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  if (!id) {
    return {
      title: '无效的新闻ID',
      description: '请求的新闻ID无效或不存在。',
    };
  }

  try {
    const newsItem = await fetchNewsDetail(id);

    if (!newsItem || !newsItem.News) {
      return {
        title: '新闻未找到',
        description: `ID为 ${id} 的新闻未找到。`,
      };
    }

    const title = newsItem.News.title || '无标题新闻';
    // 截取部分内容作为描述，避免过长
    const description = newsItem.News.content
      ? newsItem.News.content.substring(0, 160) + (newsItem.News.content.length > 160 ? '...' : '')
      : '阅读完整新闻内容。';

    return {
      title: `${title} - 新闻详情`,
      description: description,
      openGraph: {
        title: `${title} - 新闻详情`,
        description: description,
        type: 'article',
        publishedTime: newsItem.created_at,
        // images: [{ url: 'URL_TO_IMAGE' }], // 可选：添加新闻图片URL
      },
    };
  } catch (error) {
    console.error('Error generating metadata for news detail:', error);
    return {
      title: '新闻详情加载错误',
      description: '加载新闻详情元数据时发生错误。',
    };
  }
}

// 這是服務器組件
export default async function NewsDetailPage({ params }: Props) {
  const id = params?.id;

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center items-center">
        <div className="text-center text-red-500">無效的新聞 ID。</div>
        <Link href="/news" className="mt-4 inline-block text-blue-600 hover:underline">返回新聞列表</Link>
      </div>
    );
  }

  let newsItem: NewsItem | null = null;
  let error: string | null = null;

  try {
    newsItem = await fetchNewsDetail(id);
  } catch (err) {
    error = err instanceof Error ? err.message : '獲取新聞詳情失敗';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center items-center">
        <div className="text-center text-red-500 bg-red-100 p-4 rounded border border-red-300">
          <p>加載新聞詳情時出錯:</p>
          <p className="font-mono text-sm mt-2">{error}</p>
          <Link href="/news" className="mt-4 inline-block text-blue-600 hover:underline">返回新聞列表</Link>
        </div>
      </div>
    );
  }

  if (!newsItem) {
     return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center items-center">
        <div className="text-center text-gray-500">
           <p>未找到 ID 為 {id} 的新聞。</p>
           <Link href="/news" className="mt-4 inline-block text-blue-600 hover:underline">返回新聞列表</Link>
        </div>
      </div>
    );
  }

  // JSON-LD Structured Data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: newsItem.News?.title || '无标题新闻',
    datePublished: newsItem.created_at,
    dateModified: newsItem.created_at, // Assuming same as published if no modified date
    description: newsItem.News?.content ? newsItem.News.content.substring(0, 250) + (newsItem.News.content.length > 250 ? '...' : '') : '阅读完整新闻内容。',
    // image: ['URL_TO_IMAGE_1', 'URL_TO_IMAGE_2'], // 可选：添加新闻图片URL
    author: {
      '@type': 'Organization', // Or 'Person' if applicable
      name: '您的组织名称' // 替换为您的组织或作者名称
    },
    publisher: {
      '@type': 'Organization',
      name: '您的组织名称',
      // logo: { // 可选
      //   '@type': 'ImageObject',
      //   url: 'URL_TO_YOUR_LOGO'
      // }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <NewsDetailClient newsItem={newsItem} />
    </>
  );
}