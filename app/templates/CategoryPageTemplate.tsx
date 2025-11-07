import { Metadata } from 'next';
import { 
  generateCategorySEO, 
  generateBreadcrumbStructuredData,
  StructuredDataScript 
} from '../components/SEOTemplate';

// 分类页面模板接口
interface CategoryPageTemplateProps {
  category: string;
  description: string;
  posts: Array<{
    id: string;
    title: string;
    excerpt: string;
    author: string;
    publishedTime: string;
    slug: string;
    tags: string[];
    readingTime?: number;
  }>;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

// 生成分类页面元数据
export function generateCategoryPageMetadata({
  category,
  description,
  currentPage = 1,
}: {
  category: string;
  description: string;
  currentPage?: number;
}): Metadata {
  const title = currentPage > 1 
    ? `${category} - Page ${currentPage}` 
    : category;
    
  return generateCategorySEO({
    title,
    description,
    category,
    canonical: currentPage > 1 ? `/category/${category.toLowerCase()}/page/${currentPage}` : `/category/${category.toLowerCase()}`,
  });
}

// 分类页面组件
export default function CategoryPageTemplate({
  category,
  description,
  posts,
  currentPage,
  totalPages,
  totalPosts,
}: CategoryPageTemplateProps) {
  // 生成结构化数据
  const categoryStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://visionong.dpdns.org/category/${category.toLowerCase()}`,
    name: `${category} Articles`,
    description,
    url: `https://visionong.dpdns.org/category/${category.toLowerCase()}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalPosts,
      itemListElement: posts.map((post, index) => ({
        '@type': 'Article',
        position: index + 1,
        name: post.title,
        description: post.excerpt,
        url: `https://visionong.dpdns.org/blog/${post.slug}`,
        author: {
          '@type': 'Person',
          name: post.author,
        },
        datePublished: post.publishedTime,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://visionong.dpdns.org',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Categories',
          item: 'https://visionong.dpdns.org/categories',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category,
          item: `https://visionong.dpdns.org/category/${category.toLowerCase()}`,
        },
      ],
    },
  };

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name: category, url: `/category/${category.toLowerCase()}` },
  ]);

  return (
    <>
      <StructuredDataScript data={categoryStructuredData} />
      <StructuredDataScript data={breadcrumbStructuredData} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li><span className="mx-2">/</span></li>
            <li><a href="/categories" className="hover:text-blue-600">Categories</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 dark:text-gray-100" aria-current="page">{category}</li>
          </ol>
        </nav>

        {/* 页面头部 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {category}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            {description}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalPosts} articles in this category
            {currentPage > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </div>
        </header>

        {/* 文章列表 */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                    {category}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
                  <a href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {post.title}
                  </a>
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span>By {post.author}</span>
                    <span>•</span>
                    <time dateTime={post.publishedTime}>
                      {new Date(post.publishedTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  {post.readingTime && (
                    <span>{post.readingTime} min read</span>
                  )}
                </div>
                
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                    )}
                  </div>
                )}
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
                  href={currentPage === 2 
                    ? `/category/${category.toLowerCase()}` 
                    : `/category/${category.toLowerCase()}/page/${currentPage - 1}`
                  }
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
                      href={pageNum === 1 
                        ? `/category/${category.toLowerCase()}` 
                        : `/category/${category.toLowerCase()}/page/${pageNum}`
                      }
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
                  href={`/category/${category.toLowerCase()}/page/${currentPage + 1}`}
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
// export const metadata = generateCategoryPageMetadata({
//   category: "AI Technology",
//   description: "Explore the latest articles about artificial intelligence, machine learning, and emerging AI technologies.",
//   currentPage: 1,
// });