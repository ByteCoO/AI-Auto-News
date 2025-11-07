import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, name, voice, rate, volume } = body;

    if (!text || !name || !voice) {
      return NextResponse.json({ message: 'Missing required parameters: text, name, voice' }, { status: 400 });
    }

    const externalApiUrl = 'https://fond-nina-ballpo-dba04486.koyeb.app/api/tts';

    const response = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        name,
        voice,
        rate: rate || '-4%',
        volume: volume || '+0%',
      }),
    });

    if (!response.ok) {
      // Forward the error from the external API
      const errorData = await response.text();
      return new NextResponse(errorData, { status: response.status });
    }

    // Forward the success response from the external API
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('TTS Proxy Error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown internal server error occurred' }, { status: 500 });
  }
}
