import { NextResponse } from 'next/server';

// API路由用于自动提交sitemap到搜索引擎
export async function POST() {
  try {
    const baseUrl = 'https://visionong.dpdns.org';
    const sitemaps = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/news-sitemap.xml`
    ];

    const results = [];

    // 提交到Google
    for (const sitemap of sitemaps) {
      try {
        const googleSubmitUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`;
        const response = await fetch(googleSubmitUrl, { method: 'GET' });
        
        results.push({
          sitemap,
          google: response.ok ? 'success' : 'failed',
          status: response.status
        });
      } catch (error) {
        results.push({
          sitemap,
          google: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // 提交到Bing
    for (const sitemap of sitemaps) {
      try {
        const bingSubmitUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`;
        const response = await fetch(bingSubmitUrl, { method: 'GET' });
        
        const existingResult = results.find(r => r.sitemap === sitemap);
        if (existingResult) {
          existingResult.bing = response.ok ? 'success' : 'failed';
          existingResult.bingStatus = response.status;
        }
      } catch (error) {
        const existingResult = results.find(r => r.sitemap === sitemap);
        if (existingResult) {
          existingResult.bing = 'error';
          existingResult.bingError = error instanceof Error ? error.message : 'Unknown error';
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sitemap submission completed',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sitemap submission error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET方法用于检查sitemap状态
export async function GET() {
  try {
    const baseUrl = 'https://visionong.dpdns.org';
    const sitemaps = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/news-sitemap.xml`,
      `${baseUrl}/rss.xml`
    ];

    const checks = [];

    for (const sitemap of sitemaps) {
      try {
        const response = await fetch(sitemap, { 
          method: 'HEAD',
          headers: {
            'User-Agent': 'Game-Visioning-Sitemap-Checker/1.0'
          }
        });
        
        checks.push({
          url: sitemap,
          status: response.status,
          accessible: response.ok,
          lastModified: response.headers.get('last-modified'),
          contentType: response.headers.get('content-type')
        });
      } catch (error) {
        checks.push({
          url: sitemap,
          status: 0,
          accessible: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      checks,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sitemap check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}