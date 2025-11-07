import { Metadata } from 'next';
import { 
  generateSEOMetadata, 
  generateBreadcrumbStructuredData,
  StructuredDataScript 
} from '../components/SEOTemplate';

// 列表页面模板接口
interface ListPageTemplateProps {
  title: string;
  description: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    publishedTime?: string;
    author?: string;
    category?: string;
    image?: string;
    tags?: string[];
  }>;
  listType: 'news' | 'blog' | 'channel' | 'general';
  currentPage: number;
  totalPages: number;
  totalItems: number;
  canonical: string;
  breadcrumbs: Array<{ name: string; url: string }>;
}

// 生成列表页面元数据
export function generateListPageMetadata({
  title,
  description,
  currentPage = 1,
  canonical,
}: {
  title: string;
  description: string;
  currentPage?: number;
  canonical: string;
}): Metadata {
  const pageTitle = currentPage > 1 ? `${title} - Page ${currentPage}` : title;
  const pageCanonical = currentPage > 1 ? `${canonical}/page/${currentPage}` : canonical;
  
  return generateSEOMetadata({
    title: pageTitle,
    description,
    canonical: pageCanonical,
    keywords: ['news', 'articles', 'technology', 'gaming', 'AI'],
  });
}

// 列表页面组件
export default function ListPageTemplate({
  title,
  description,
  items,
  listType,
  currentPage,
  totalPages,
  totalItems,
  canonical,
  breadcrumbs,
}: ListPageTemplateProps) {
  // 生成结构化数据
  const listStructuredData = {
    '@context': 'https://schema.org',
    '@type': listType === 'news' ? 'NewsMediaOrganization' : 'CollectionPage',
    '@id': `https://visionong.dpdns.org${canonical}`,
    name: title,
    description,
    url: `https://visionong.dpdns.org${canonical}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalItems,
      itemListElement: items.map((item, index) => ({
        '@type': listType === 'news' ? 'NewsArticle' : 'Article',
        position: (currentPage - 1) * items.length + index + 1,
        name: item.title,
        description: item.description,
        url: item.url.startsWith('http') ? item.url : `https://visionong.dpdns.org${item.url}`,
        ...(item.publishedTime && { datePublished: item.publishedTime }),
        ...(item.author && {
          author: {
            '@type': 'Person',
            name: item.author,
          },
        }),
        ...(item.image && {
          image: {
            '@type': 'ImageObject',
            url: item.image.startsWith('http') ? item.image : `https://visionong.dpdns.org${item.image}`,
          },
        }),
      })),
    },
  };

  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbs);

  return (
    <>
      <StructuredDataScript data={listStructuredData} />
      <StructuredDataScript data={breadcrumbStructuredData} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 dark:text-gray-100" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <a href={crumb.url} className="hover:text-blue-600">
                    {crumb.name}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* 页面头部 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            {description}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalItems} items
            {currentPage > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </div>
        </header>

        {/* 过滤器和排序 (可选) */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
              All
            </button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
              Latest
            </button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
              Popular
            </button>
          </div>
          <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800">
            <option>Sort by Date</option>
            <option>Sort by Title</option>
            <option>Sort by Author</option>
          </select>
        </div>

        {/* 内容列表 */}
        <div className="space-y-6">
          {items.map((item, index) => (
            <article 
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="md:flex">
                {item.image && (
                  <div className="md:w-48 md:flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 md:h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      {item.category && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                          {item.category}
                        </span>
                      )}
                      {item.publishedTime && (
                        <time dateTime={item.publishedTime}>
                          {new Date(item.publishedTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      )}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
                    <a 
                      href={item.url}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                      {...(item.url.startsWith('http') && {
                        target: '_blank',
                        rel: 'noopener noreferrer'
                      })}
                    >
                      {item.title}
                    </a>
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {item.author && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        By {item.author}
                      </span>
                    )}
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 分页导航 */}
        {totalPages > 1 && (
          <nav className="mt-8" aria-label="Pagination">
            <div className="flex justify-center items-center space-x-2">
              {currentPage > 1 && (
                <a
                  href={currentPage === 2 ? canonical : `${canonical}/page/${currentPage - 1}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </a>
              )}
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <a
                      key={pageNum}
                      href={pageNum === 1 ? canonical : `${canonical}/page/${pageNum}`}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      aria-current={pageNum === currentPage ? 'page' : undefined}
                    >
                      {pageNum}
                    </a>
                  );
                })}
              </div>
              
              {currentPage < totalPages && (
                <a
                  href={`${canonical}/page/${currentPage + 1}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </a>
              )}
            </div>
          </nav>
        )}
      </div>
    </>
  );
}

// 使用示例：
// export const metadata = generateListPageMetadata({
//   title: "Latest Tech News",
//   description: "Stay updated with the latest technology news, AI developments, and gaming industry insights.",
//   currentPage: 1,
//   canonical: "/news",
// });