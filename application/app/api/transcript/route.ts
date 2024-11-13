import { YoutubeTranscript } from 'youtube-transcript';
import { NextResponse } from 'next/server';

// Define the type that matches the actual YouTube transcript response
interface TranscriptResponse {
  text: string;
  duration: number;
  start: number;
}

// Helper function to decode HTML entities
function decodeHTMLEntities(text: string): string {
  // First pass: decode &amp; to & to handle double-encoded entities
  text = text.replace(/&amp;/g, '&');
  
  // Second pass: decode all other entities
  return text.replace(/&(#39|apos|quot|lt|gt);/g, match => {
    switch (match) {
      case '&#39;': return "'";
      case '&apos;': return "'";
      case '&quot;': return '"';
      case '&lt;': return '<';
      case '&gt;': return '>';
      default: return match;
    }
  });
}

// Helper function to extract video ID from various YouTube URL formats
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

// Helper function to format seconds into MM:SS
function formatTimestamp(seconds: number): string {
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    return '00:00';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Fetch transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Format the transcript data
    const formattedTranscript = transcript.map((segment: any) => {
      console.log('Segment data:', segment); // Debug log
      return {
        text: decodeHTMLEntities(segment.text),
        timestamp: formatTimestamp(segment.offset || segment.start || 0)
      };
    });

    return NextResponse.json({ transcript: formattedTranscript });
  } catch (error: any) {
    console.error('Transcript error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}