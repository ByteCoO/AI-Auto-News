import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = 10;
  const targetUrl = `https://www.bloomberg.com/lineup-next/api/stories?limit=${limit}&brand=ECONOMICS&pageNumber=${page}&types=ARTICLE,FEATURE,INTERACTIVE,LETTER,EXPLAINERS`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Bloomberg API responded with status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ message: 'Request timed out' }, { status: 504 });
    }
    console.error('API Route Error:', error);
    return NextResponse.json({ message: 'Error fetching economics news data.', error: error.message }, { status: 500 });
  }
}