# SEO模板使用指南

## 📋 概述

这套SEO模板系统为Game Visioning网站提供了完整的SEO优化解决方案，包括元数据管理、结构化数据、性能优化等功能。

## 🚀 快速开始

### 1. 新闻文章页面

```tsx
// app/news/[slug]/page.tsx
import { generateNewsPageMetadata, NewsPageTemplate } from '@/app/templates/NewsPageTemplate';

export const metadata = generateNewsPageMetadata({
  title: "AI革命：深度学习的未来趋势",
  description: "探索人工智能领域的最新发展，分析深度学习技术如何改变我们的世界。",
  author: "张三",
  publishedTime: "2024-01-15T10:00:00.000Z",
  modifiedTime: "2024-01-16T14:30:00.000Z",
  category: "AI Technology",
  tags: ["人工智能", "深度学习", "技术趋势"],
  slug: "ai-revolution-future-trends",
  source: "Bloomberg",
});

export default function NewsPage() {
  return (
    <NewsPageTemplate
      title="AI革命：深度学习的未来趋势"
      description="探索人工智能领域的最新发展..."
      content="<p>文章内容...</p>"
      author="张三"
      publishedTime="2024-01-15T10:00:00.000Z"
      category="AI Technology"
      tags={["人工智能", "深度学习", "技术趋势"]}
      slug="ai-revolution-future-trends"
      source="Bloomberg"
    />
  );
}
```

### 2. 博客文章页面

```tsx
// app/blog/[slug]/page.tsx
import { generateBlogPageMetadata, BlogPageTemplate } from '@/app/templates/BlogPageTemplate';

export const metadata = generateBlogPageMetadata({
  id: "1",
  title: "游戏开发中的AI应用：从NPC到程序生成",
  description: "深入探讨人工智能在现代游戏开发中的应用...",
  author: "李四",
  publishedTime: "2024-01-15T10:00:00.000Z",
  category: "Game Development",
  tags: ["AI", "游戏开发", "NPC", "程序生成"],
  slug: "ai-in-game-development",
});

export default function BlogPage() {
  return (
    <BlogPageTemplate
      id="1"
      title="游戏开发中的AI应用"
      // ... 其他props
    />
  );
}
```

### 3. 分类页面

```tsx
// app/category/[category]/page.tsx
import { generateCategoryPageMetadata, CategoryPageTemplate } from '@/app/templates/CategoryPageTemplate';

export const metadata = generateCategoryPageMetadata({
  category: "AI Technology",
  description: "探索人工智能领域的最新文章和分析...",
  currentPage: 1,
});

export default function CategoryPage() {
  return (
    <CategoryPageTemplate
      category="AI Technology"
      description="探索人工智能领域的最新文章..."
      posts={posts}
      currentPage={1}
      totalPages={5}
      totalPosts={47}
    />
  );
}
```

### 4. 列表页面

```tsx
// app/news/page.tsx
import { generateListPageMetadata, ListPageTemplate } from '@/app/templates/ListPageTemplate';

export const metadata = generateListPageMetadata({
  title: "Latest Tech News",
  description: "Stay updated with the latest technology news...",
  currentPage: 1,
  canonical: "/news",
});

export default function NewsListPage() {
  return (
    <ListPageTemplate
      title="Latest Tech News"
      description="Stay updated with the latest technology news..."
      items={newsItems}
      listType="news"
      currentPage={1}
      totalPages={10}
      totalItems={200}
      canonical="/news"
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'News', url: '/news' },
      ]}
    />
  );
}
```

## 🔧 高级功能

### 1. 自定义SEO Hook

```tsx
'use client';
import { useSEO, usePagePerformance } from '@/app/hooks/useSEO';

export default function CustomPage() {
  // 动态SEO更新
  useSEO({
    title: "Dynamic Page Title",
    description: "Dynamic description based on user data",
    canonical: "/custom-page",
  });

  // 性能监控
  usePagePerformance();

  return <div>Your content</div>;
}
```

### 2. SEO工具函数

```tsx
import { 
  generateSlug, 
  truncateDescription, 
  calculateReadingTime,
  generateSocialShareUrls 
} from '@/app/utils/seoUtils';

// 生成URL slug
const slug = generateSlug("AI革命：深度学习的未来趋势");
// 结果: "ai-revolution-future-trends"

// 截取描述
const description = truncateDescription(longText, 160);

// 计算阅读时间
const readTime = calculateReadingTime(articleContent);

// 生成社交分享链接
const shareUrls = generateSocialShareUrls(title, url);
```

### 3. 结构化数据生成

```tsx
import { 
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  StructuredDataScript 
} from '@/app/components/SEOTemplate';

export default function ArticlePage() {
  const articleLD = generateArticleStructuredData({
    title: "Article Title",
    description: "Article description",
    author: "Author Name",
    publishedTime: "2024-01-15T10:00:00.000Z",
    canonical: "/article-slug",
  });

  return (
    <>
      <StructuredDataScript data={articleLD} />
      {/* 页面内容 */}
    </>
  );
}
```

## 📊 SEO最佳实践

### 1. 元数据优化
- **标题**: 50-60字符，包含主要关键词
- **描述**: 150-160字符，吸引用户点击
- **关键词**: 5-10个相关关键词，避免堆砌

### 2. 结构化数据
- 为所有内容类型添加适当的Schema.org标记
- 使用Google的结构化数据测试工具验证
- 定期检查富文本搜索结果

### 3. 技术SEO
- 确保所有页面都有唯一的canonical URL
- 实现面包屑导航
- 优化图片alt标签和文件名
- 确保移动端友好性

### 4. 性能优化
- 监控Core Web Vitals指标
- 实现图片懒加载
- 优化CSS和JavaScript加载
- 使用CDN加速静态资源

## 🔍 监控和维护

### 1. Google Search Console
- 定期检查索引覆盖报告
- 监控搜索性能数据
- 修复爬取错误

### 2. 性能监控
- 使用Web Vitals监控页面性能
- 设置性能预算和警报
- 定期进行性能审计

### 3. 内容优化
- 分析搜索查询数据
- 优化低性能页面
- 更新过时内容

## 🚨 常见问题

### Q: 如何处理重复内容？
A: 使用canonical标签指向权威版本，合并相似页面，或使用noindex标签。

### Q: 如何优化大型列表页面？
A: 实现分页，使用infinity scroll时添加分页URL，确保每页都有唯一的元数据。

### Q: 如何处理动态内容的SEO？
A: 使用服务端渲染(SSR)或静态生成(SSG)，确保爬虫能够获取到完整内容。

## 📚 相关资源

- [Google SEO指南](https://developers.google.com/search/docs)
- [Schema.org文档](https://schema.org/)
- [Web Vitals指标](https://web.dev/vitals/)
- [Next.js SEO最佳实践](https://nextjs.org/learn/seo/introduction-to-seo)