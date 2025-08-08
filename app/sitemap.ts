// app/sitemap.ts
import { MetadataRoute } from 'next';

// 假设你有一个函数可以获取所有已发布的文章
// 这个函数可以从你的 /blog/page.tsx 中提取出来放到一个共享文件中
// async function getAllPublishedPosts() { ... return posts; }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://visionong.dpdns.org'; // 请使用你的真实域名

  // 示例：添加博客文章 URL
  // const posts = await getAllPublishedPosts();
  // const postUrls = posts.map(post => ({
  //   url: `${baseUrl}/blog/${post.slug}`, 
  //   lastModified: new Date(post.created_at),
  // }));

  return [
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
      url: `${baseUrl}/Channels`, // 你的 Channels 页面
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/price`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // ...postUrls, // 把动态生成的文章 URL 加进来
  ];
}