// D:\\2025\\Code\\auto-NW\\my-app\\app\\api\\bloomberg-general\\route.js
import { NextResponse } from 'next/server';
import { HttpsProxyAgent } from 'https-proxy-agent';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '50';

  const bloombergParams = new URLSearchParams({
    limit: limit,
    pageNumber: page,
    types: 'ARTICLE,FEATURE,INTERACTIVE,LETTER,EXPLAINERS',
  });

  const targetUrl = `https://www.bloomberg.com/lineup-next/api/stories?${bloombergParams.toString()}`;

  // 1. 组合所有必要的请求头
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  };

  // 2. 从环境变量添加 Cookie (这是绕过 WAF 的关键)
  const cookie = process.env.BLOOMBERG_COOKIE;
  if (cookie) {
    headers['Cookie'] = cookie;
    console.log('[API Route] Found and using BLOOMBERG_COOKIE from .env.local');
  } else {
    console.warn('[API Route] WARNING: BLOOMBERG_COOKIE is not set in .env.local. Request will likely fail.');
  }

  // 3. 从环境变量或默认值设置代理
  const proxyUrl = process.env.PROXY_URL || 'http://127.0.0.1:7890';
  const agent = new HttpsProxyAgent(proxyUrl);
  console.log(`[API Route] Using proxy: ${proxyUrl}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      cache: 'no-store',
      headers: headers,
      dispatcher: agent
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[API Route] Bloomberg API responded with status: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Upstream API failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API Route] Successfully fetched ${data.length} stories.`);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[API Route] Final fetch attempt failed:', error);
    if (error.name === 'AbortError') {
      return NextResponse.json({ message: 'Request to Bloomberg timed out' }, { status: 504 });
    }
    return NextResponse.json({ message: 'Error fetching from Bloomberg.', error: error.message }, { status: 502 });
  }
}