import { Metadata } from 'next';
import { 
  generateNewsArticleSEO, 
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  StructuredDataScript 
} from '../components/SEOTemplate';

// 新闻页面模板接口
interface NewsPageTemplateProps {
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
  source?: string;
}

// 生成新闻页面元数据
export function generateNewsPageMetadata({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  category,
  tags,
  slug,
  ogImage,
}: NewsPageTemplateProps): Metadata {
  return generateNewsArticleSEO({
    title,
    description,
    author,
    publishedTime,
    modifiedTime,
    category,
    tags,
    canonical: `/news/${slug}`,
    ogImage,
  });
}

// 新闻页面组件
export default function NewsPageTemplate({
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
  source,
}: NewsPageTemplateProps) {
  // 生成结构化数据
  const articleStructuredData = generateArticleStructuredData({
    title,
    description,
    author,
    publishedTime,
    modifiedTime,
    canonical: `/news/${slug}`,
    ogImage,
    category,
  });

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'News', url: '/news' },
    { name: category, url: `/news/category/${category.toLowerCase()}` },
    { name: title, url: `/news/${slug}` },
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
            <li><a href="/news" className="hover:text-blue-600">News</a></li>
            <li><span className="mx-2">/</span></li>
            <li><a href={`/news/category/${category.toLowerCase()}`} className="hover:text-blue-600">{category}</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 dark:text-gray-100" aria-current="page">{title}</li>
          </ol>
        </nav>

        {/* 文章头部 */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
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
            {source && (
              <div className="flex items-center">
                <span>Source: {source}</span>
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

        {/* 文章内容 */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* 标签 */}
        {tags.length > 0 && (
          <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
              {tags.map((tag, index) => (
                <a
                  key={index}
                  href={`/news/tag/${tag.toLowerCase()}`}
                  className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  #{tag}
                </a>
              ))}
            </div>
          </footer>
        )}
      </article>
    </>
  );
}

// 使用示例：
// export const metadata = generateNewsPageMetadata({
//   title: "AI革命：深度学习的未来趋势",
//   description: "探索人工智能领域的最新发展，分析深度学习技术如何改变我们的世界。",
//   author: "张三",
//   publishedTime: "2024-01-15T10:00:00.000Z",
//   category: "AI",
//   tags: ["人工智能", "深度学习", "技术趋势"],
//   slug: "ai-revolution-future-trends",
// });