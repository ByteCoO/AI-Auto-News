// app/sitemap.ts
import { MetadataRoute } from 'next';

// 设置 sitemap 的重新验证周期为8分钟 (ISR)
export const revalidate = 480;
import { supabase } from './lib/supabase'; // 导入 Supabase 客户端

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://visionong.dpdns.org'; // 请使用你的真实域名

  // 1. 获取所有已发布的博客文章
  const { data: posts } = await supabase
    .from('posts')
    .select('id, created_at')
    .eq('status', 'published');

  const postUrls = posts?.map(post => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.7,
  })) || [];

  // 2. 获取所有 FT 新闻文章
  const { data: ftArticles } = await supabase
    .from('FT_articles')
    .select('id, publishedtimestamputc');

  const ftArticleUrls = ftArticles?.map(article => ({
    url: `${baseUrl}/ft-news/${article.id}`,
    lastModified: new Date(article.publishedtimestamputc || Date.now()),
    changeFrequency: 'daily' as 'daily',
    priority: 0.7,
  })) || [];

  // 3. 定义静态页面
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Channels`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/price`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 4. 合并所有 URL
  return [
    ...staticUrls,
    ...postUrls,
    ...ftArticleUrls,
  ];
}
