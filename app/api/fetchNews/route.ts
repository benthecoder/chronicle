import { NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const TOP_SOURCES = [
  'cnn',
  'the-new-york-times',
  'the-washington-post',
  'the-wall-street-journal',
  'bloomberg',
];

export async function GET() {
  try {
    if (!NEWS_API_KEY) {
      throw new Error('News API key is not configured');
    }

    const sourcesString = TOP_SOURCES.join(',');
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?sources=${sourcesString}&apiKey=${NEWS_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
