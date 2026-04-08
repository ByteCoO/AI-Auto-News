import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const limit = 10;
  const targetUrl = `https://personalization.bloomberg.com/popular/resources?minAge=0&maxAge=86400000&limit=${limit}&facets=Story%7CAll`;

  try {
    const response = await fetch(targetUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Bloomberg API responded with status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // *** FIX STARTS HERE ***
    // The API returns an object like { "Story|All": [...] }, so we extract the array.
    const articles = data['Story|All'];

    // Final check to ensure we are returning an array
    if (Array.isArray(articles)) {
      return NextResponse.json(articles);
    } else {
      // If the structure is not as expected, return an empty array to prevent frontend errors.
      console.error("Popular news API returned unexpected data structure:", data);
      return NextResponse.json([]);
    }
    // *** FIX ENDS HERE ***

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ message: 'Error fetching popular news data.', error: error.message }, { status: 500 });
  }
}