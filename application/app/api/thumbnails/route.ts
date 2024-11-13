import { NextResponse } from 'next/server';

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Construct thumbnail URLs using i3.ytimg.com for better performance
    const thumbnails = {
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };

    // Get video title using oEmbed API (no API key needed)
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oEmbedResponse = await fetch(oEmbedUrl);
    const oEmbedData = await oEmbedResponse.json();

    return NextResponse.json({
      thumbnails,
      title: oEmbedData.title
    });

  } catch (error) {
    console.error('Thumbnail fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch thumbnails" },
      { status: 500 }
    );
  }
}
