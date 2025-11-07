// SEO实用工具函数

// 生成slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除首尾连字符
}

// 截取描述文本
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > maxLength * 0.8 
    ? truncated.slice(0, lastSpace) + '...'
    : truncated + '...';
}

// 生成阅读时间估算
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// 提取文本中的关键词
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));

  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

// 生成面包屑导航
export function generateBreadcrumbs(pathname: string): Array<{ name: string; url: string }> {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', url: '/' }];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // 美化段名称
    let name = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    // 特殊路径处理
    switch (segment.toLowerCase()) {
      case 'ft-news':
        name = 'Financial Times News';
        break;
      case 'bloomberg-news':
        name = 'Bloomberg News';
        break;
      case 'bloglist':
        name = 'Blog List';
        break;
    }

    breadcrumbs.push({ name, url: currentPath });
  });

  return breadcrumbs;
}

// 验证和清理URL
export function sanitizeUrl(url: string): string {
  try {
    // 如果是相对URL，添加基础域名
    if (url.startsWith('/')) {
      return `https://visionong.dpdns.org${url}`;
    }
    
    // 验证URL格式
    new URL(url);
    return url;
  } catch {
    return 'https://visionong.dpdns.org';
  }
}

// 生成社交分享URL
export function generateSocialShareUrls(title: string, url: string) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(sanitizeUrl(url));
  
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=gamevisioning`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
  };
}

// 生成Open Graph图片URL
export function generateOGImageUrl(title: string, category?: string): string {
  const baseUrl = 'https://visionong.dpdns.org';
  
  // 如果有动态图片生成服务，可以使用
  // return `${baseUrl}/api/og?title=${encodeURIComponent(title)}&category=${category}`;
  
  // 否则返回默认图片
  return `${baseUrl}/og-image.jpg`;
}

// 结构化数据验证
export function validateStructuredData(data: object): boolean {
  try {
    // 基本验证
    if (typeof data !== 'object' || data === null) return false;
    
    const schemaData = data as any;
    
    // 检查必需字段
    if (!schemaData['@context'] || !schemaData['@type']) return false;
    
    // 验证context
    if (schemaData['@context'] !== 'https://schema.org') return false;
    
    return true;
  } catch {
    return false;
  }
}

// 生成robots meta标签内容
export function generateRobotsMeta({
  index = true,
  follow = true,
  maxSnippet = -1,
  maxImagePreview = 'large',
  maxVideoPreview = -1,
}: {
  index?: boolean;
  follow?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
} = {}): string {
  const directives = [];
  
  directives.push(index ? 'index' : 'noindex');
  directives.push(follow ? 'follow' : 'nofollow');
  
  if (maxSnippet !== -1) {
    directives.push(`max-snippet:${maxSnippet}`);
  }
  
  directives.push(`max-image-preview:${maxImagePreview}`);
  
  if (maxVideoPreview !== -1) {
    directives.push(`max-video-preview:${maxVideoPreview}`);
  }
  
  return directives.join(', ');
}

// 生成网站搜索动作的结构化数据
export function generateSearchActionLD(searchUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://visionong.dpdns.org',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${searchUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}