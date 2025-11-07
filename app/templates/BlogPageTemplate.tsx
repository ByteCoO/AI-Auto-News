import { Metadata } from 'next';
import { 
  generateBlogPostSEO, 
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  StructuredDataScript 
} from '../components/SEOTemplate';

// 博客页面模板接口
interface BlogPageTemplateProps {
  id: string;
  title: string;
  description: string;
  content: string;
  author?: string;
  publishedTime: string;
  modifiedTime?: string;
  category: string;
  tags: string[];
  slug: string;
  ogImage?: string;
  readingTime?: number;
  excerpt?: string;
}

// 生成博客页面元数据
export function generateBlogPageMetadata({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  category,
  tags,
  slug,
  ogImage,
}: BlogPageTemplateProps): Metadata {
  return generateBlogPostSEO({
    title,
    description,
    author,
    publishedTime,
    modifiedTime,
    category,
    tags,
    canonical: `/blog/${slug}`,
    ogImage,
  });
}

// 博客页面组件
export default function BlogPageTemplate({
  id,
  title,
  description,
  content,
  author = 'Game Visioning Team',
  publishedTime,
  modifiedTime,
  category,
  tags,
  slug,
  ogImage,
  readingTime,
  excerpt,
}: BlogPageTemplateProps) {
  // 生成结构化数据
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://visionong.dpdns.org/blog/${slug}`,
    headline: title,
    description: description || excerpt,
    image: ogImage ? `https://visionong.dpdns.org${ogImage}` : 'https://visionong.dpdns.org/og-image.jpg',
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Game Visioning',
      logo: {
        '@type': 'ImageObject',
        url: 'https://visionong.dpdns.org/logo.png',
      },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://visionong.dpdns.org/blog/${slug}`,
    },
    blogPosting: {
      '@type': 'Blog',
      '@id': 'https://visionong.dpdns.org/blog',
    },
    articleSection: category,
    keywords: tags.join(', '),
    inLanguage: 'en-US',
    ...(readingTime && {
      timeRequired: `PT${readingTime}M`,
    }),
  };

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: category, url: `/blog/category/${category.toLowerCase()}` },
    { name: title, url: `/blog/${slug}` },
  ]);

  return (
    <>
      <StructuredDataScript data={articleStructuredData} />
      <StructuredDataScript data={breadcrumbStructuredData} />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li><span className="mx-2">/</span></li>
            <li><a href="/blog" className="hover:text-blue-600">Blog</a></li>
            <li><span className="mx-2">/</span></li>
            <li><a href={`/blog/category/${category.toLowerCase()}`} className="hover:text-blue-600">{category}</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 dark:text-gray-100" aria-current="page">{title}</li>
          </ol>
        </nav>

        {/* 文章头部 */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium rounded-full">
              {category}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <span className="font-medium">By {author}</span>
            </div>
            <div className="flex items-center">
              <time dateTime={publishedTime}>
                {new Date(publishedTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            {readingTime && (
              <div className="flex items-center">
                <span>{readingTime} min read</span>
              </div>
            )}
            {modifiedTime && modifiedTime !== publishedTime && (
              <div className="flex items-center">
                <span>Updated: </span>
                <time dateTime={modifiedTime}>
                  {new Date(modifiedTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            )}
          </div>
        </header>

        {/* 目录 (可选) */}
        <aside className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
          <div id="table-of-contents">
            {/* 这里可以根据content自动生成目录 */}
          </div>
        </aside>

        {/* 文章内容 */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* 社交分享和标签 */}
        <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          {/* 社交分享 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Share this post</h3>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(`https://visionong.dpdns.org/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://visionong.dpdns.org/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://visionong.dpdns.org/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* 标签 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
              {tags.map((tag, index) => (
                <a
                  key={index}
                  href={`/blog/tag/${tag.toLowerCase()}`}
                  className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  #{tag}
                </a>
              ))}
            </div>
          )}
        </footer>
      </article>
    </>
  );
}

// 使用示例：
// export const metadata = generateBlogPageMetadata({
//   id: "1",
//   title: "游戏开发中的AI应用：从NPC到程序生成",
//   description: "深入探讨人工智能在现代游戏开发中的应用，包括智能NPC设计和程序化内容生成。",
//   author: "李四",
//   publishedTime: "2024-01-15T10:00:00.000Z",
//   category: "Game Development",
//   tags: ["AI", "游戏开发", "NPC", "程序生成"],
//   slug: "ai-in-game-development",
// });