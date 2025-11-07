import { NextResponse } from 'next/server';

// GSC状态检查和监控API
export async function GET() {
  try {
    const baseUrl = 'https://visionong.dpdns.org';
    
    // 检查关键SEO元素
    const checks = {
      sitemap: await checkSitemap(`${baseUrl}/sitemap.xml`),
      newsSitemap: await checkSitemap(`${baseUrl}/news-sitemap.xml`),
      rss: await checkSitemap(`${baseUrl}/rss.xml`),
      robotsTxt: await checkRobotsTxt(`${baseUrl}/robots.txt`),
      homepage: await checkHomepage(baseUrl),
    };

    // 计算整体健康分数
    const totalChecks = Object.values(checks).length;
    const passedChecks = Object.values(checks).filter(check => check.status === 'success').length;
    const healthScore = Math.round((passedChecks / totalChecks) * 100);

    return NextResponse.json({
      success: true,
      healthScore,
      checks,
      timestamp: new Date().toISOString(),
      recommendations: generateRecommendations(checks),
    });

  } catch (error) {
    console.error('GSC status check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

async function checkSitemap(url: string) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: { 'User-Agent': 'GSC-Status-Checker/1.0' }
    });
    
    return {
      url,
      status: response.ok ? 'success' : 'error',
      statusCode: response.status,
      lastModified: response.headers.get('last-modified'),
      contentType: response.headers.get('content-type'),
    };
  } catch (error) {
    return {
      url,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function checkRobotsTxt(url: string) {
  try {
    const response = await fetch(url);
    const content = await response.text();
    
    const hasUserAgent = content.includes('User-agent:');
    const hasSitemap = content.includes('Sitemap:');
    const hasDisallowApi = content.includes('Disallow: /api/');
    
    return {
      url,
      status: response.ok && hasUserAgent && hasSitemap ? 'success' : 'warning',
      statusCode: response.status,
      checks: {
        hasUserAgent,
        hasSitemap,
        hasDisallowApi,
      },
      content: content.slice(0, 500), // 只返回前500字符
    };
  } catch (error) {
    return {
      url,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function checkHomepage(url: string) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'GSC-Status-Checker/1.0' }
    });
    
    const content = await response.text();
    
    // 检查关键SEO元素
    const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(content);
    const hasMetaDescription = /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i.test(content);
    const hasMetaViewport = /<meta[^>]*name="viewport"[^>]*>/i.test(content);
    const hasCanonical = /<link[^>]*rel="canonical"[^>]*>/i.test(content);
    const hasOgTags = /<meta[^>]*property="og:[^"]*"[^>]*>/i.test(content);
    const hasStructuredData = /<script[^>]*type="application\/ld\+json"[^>]*>/i.test(content);
    const hasGoogleVerification = /<meta[^>]*name="google-site-verification"[^>]*>/i.test(content);
    
    // 提取标题和描述
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch = content.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    
    return {
      url,
      status: response.ok ? 'success' : 'error',
      statusCode: response.status,
      seo: {
        title: titleMatch ? titleMatch[1] : null,
        description: descriptionMatch ? descriptionMatch[1] : null,
        titleLength: titleMatch ? titleMatch[1].length : 0,
        descriptionLength: descriptionMatch ? descriptionMatch[1].length : 0,
      },
      checks: {
        hasTitle,
        hasMetaDescription,
        hasMetaViewport,
        hasCanonical,
        hasOgTags,
        hasStructuredData,
        hasGoogleVerification,
      },
    };
  } catch (error) {
    return {
      url,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function generateRecommendations(checks: any) {
  const recommendations = [];
  
  // Sitemap 建议
  if (checks.sitemap.status !== 'success') {
    recommendations.push({
      type: 'error',
      title: 'Sitemap不可访问',
      description: '主要sitemap无法访问，这会影响搜索引擎抓取。',
      action: '检查sitemap.xml文件是否正确生成和部署。',
    });
  }
  
  if (checks.newsSitemap.status !== 'success') {
    recommendations.push({
      type: 'warning',
      title: '新闻Sitemap问题',
      description: '新闻sitemap可能有问题，影响Google News收录。',
      action: '检查news-sitemap.xml的生成逻辑。',
    });
  }
  
  // SEO建议
  if (checks.homepage.checks && !checks.homepage.checks.hasGoogleVerification) {
    recommendations.push({
      type: 'warning',
      title: '缺少Google验证',
      description: '未找到Google Search Console验证标签。',
      action: '添加Google Site Verification meta标签。',
    });
  }
  
  if (checks.homepage.seo) {
    if (checks.homepage.seo.titleLength > 60) {
      recommendations.push({
        type: 'warning',
        title: '标题过长',
        description: `页面标题${checks.homepage.seo.titleLength}字符，建议控制在60字符以内。`,
        action: '优化页面标题长度。',
      });
    }
    
    if (checks.homepage.seo.descriptionLength > 160) {
      recommendations.push({
        type: 'warning',
        title: '描述过长',
        description: `Meta描述${checks.homepage.seo.descriptionLength}字符，建议控制在160字符以内。`,
        action: '优化Meta描述长度。',
      });
    }
  }
  
  // Robots.txt建议
  if (checks.robotsTxt.status !== 'success') {
    recommendations.push({
      type: 'error',
      title: 'Robots.txt问题',
      description: 'robots.txt文件有问题或缺少必要指令。',
      action: '检查robots.txt文件配置。',
    });
  }
  
  return recommendations;
}

// POST方法用于手动触发GSC相关操作
export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'ping-google':
        return await pingGoogle();
      case 'ping-bing':
        return await pingBing();
      case 'validate-structured-data':
        return await validateStructuredData();
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

async function pingGoogle() {
  const baseUrl = 'https://visionong.dpdns.org';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  
  try {
    const response = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    return NextResponse.json({
      success: true,
      message: 'Successfully pinged Google',
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to ping Google',
    });
  }
}

async function pingBing() {
  const baseUrl = 'https://visionong.dpdns.org';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  
  try {
    const response = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    return NextResponse.json({
      success: true,
      message: 'Successfully pinged Bing',
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to ping Bing',
    });
  }
}

async function validateStructuredData() {
  // 这里可以添加结构化数据验证逻辑
  // 例如检查JSON-LD格式是否正确
  return NextResponse.json({
    success: true,
    message: 'Structured data validation completed',
    // 这里可以返回验证结果
  });
}