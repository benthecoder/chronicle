import Exa from "exa-js";
import { NextResponse } from "next/server";

const exa = new Exa(process.env.EXA_API_KEY);

// List of major news domains and social media platforms
const newsDomains = [
  "www.reuters.com",
  "www.apnews.com",
  "www.npr.org",
  "www.bbc.com",
  "www.theguardian.com",
  "www.aljazeera.com",
  "www.bloomberg.com",
  "www.economist.com",
  "www.washingtonpost.com",
  "www.nytimes.com",
];

const socialMediaDomains = [
  "bsky.app", // Bluesky
  "mastodon.social", // Mastodon main instance
  "twitter.com", // Twitter/X
  "reddit.com", // Reddit
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const commonSearchParams = {
      useAutoprompt: true,
      startPublishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      text: true,
      highlights: false,
    } as const;

    // Search news domains
    const newsResults = await exa.search(query, {
      ...commonSearchParams,
      includeDomains: newsDomains,
      numResults: 5,
    });

    // Search Twitter/X
    const twitterResults = await exa.search(query, {
      ...commonSearchParams,
      includeDomains: ["twitter.com"],
      numResults: 5,
    });

    // Search Reddit
    const redditResults = await exa.search(query, {
      ...commonSearchParams,
      includeDomains: ["reddit.com"],
      numResults: 5,
    });

    // Combine all results
    const combinedResults = {
      news: newsResults,
      twitter: twitterResults,
      reddit: redditResults,
    };

    return NextResponse.json(combinedResults);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
