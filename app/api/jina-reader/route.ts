// app/api/jina-reader/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. 从前端请求中解析出 URL
    const body = await request.json();
    const targetUrl = body.url;

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json({ error: 'URL is required and must be a string.' }, { status: 400 });
    }

    // 2. 构造对 Jina API 的请求
    // 注意：这里的 targetUrl 不应该包含协议头，Jina API 会自动处理
    // 但为了与 Python 脚本行为一致，我们先移除它
    const cleanUrl = targetUrl.replace(/^(https?:\/\/)/, '');
    const jinaApiUrl = `https://r.jina.ai/${cleanUrl}`;

    const headers = {
      "Accept": "application/json",
      "X-With-Links-Summary": "true",
      // 如果 Jina 需要 Bearer Token 认证，可以在这里添加
      // "Authorization": `Bearer ${process.env.JINA_API_KEY}`
    };

    console.log(`🚀 Forwarding request to Jina API: ${jinaApiUrl}`);

    // 3. 发送请求到 Jina API
    // 在 Vercel 或 Node.js 环境中，fetch 会在服务器端执行，不受 CORS 限制
    const jinaResponse = await fetch(jinaApiUrl, {
      method: 'GET',
      headers: headers,
    });

    // 4. 处理 Jina API 的响应
    if (!jinaResponse.ok) {
      // 如果 Jina API 返回错误，将错误信息透传给前端
      const errorText = await jinaResponse.text();
      console.error(`❌ Jina API returned an error: ${jinaResponse.status}`, errorText);
      return NextResponse.json(
        { error: `Jina API Error: ${jinaResponse.status} - ${errorText || jinaResponse.statusText}` },
        { status: jinaResponse.status }
      );
    }

    const data = await jinaResponse.json();
    console.log("✅ Successfully fetched data from Jina API.");

    // 5. 将 Jina API 的成功响应返回给前端
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('❌ An unexpected error occurred in the API route:', error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}