import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing or invalid URL parameter' }, { status: 400 });
  }

  try {
    // Fetch the RSS feed server-side
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch RSS feed' }, { status: 500 });
    }

    const rssText = await response.text();

    // Return the RSS feed data as plain text
    return new NextResponse(rssText, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
