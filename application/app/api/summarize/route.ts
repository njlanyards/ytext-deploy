import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Reuse existing extractVideoId function
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

// Add this helper function at the top of the file
function cleanSummaryText(text: string): string {
  return text
    .replace(/\*\*/g, '') // Remove bold markdown
    .replace(/\*/g, '')   // Remove any remaining asterisks
    .trim();              // Remove extra whitespace
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
    const fullText = transcript
      .map((segment: any) => segment.text)
      .join(' ');

    // Generate summary using Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "When summarizing YouTube videos: 1) Begin with a brief introduction that captures the video's topic and purpose, using an emoji to set the tone. 2) Present main points using bullet points with emojis. 3) Provide a relatable analogy. 4) List important keywords. 5) End with a key takeaway. Keep the format clean and avoid using any special formatting characters like asterisks or underscores. Use clear section headers like 'Main Points:' and 'Keywords:' without any special formatting."
        },
        {
          role: "user",
          content: fullText
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const summary = cleanSummaryText(
      chatCompletion.choices[0]?.message?.content || 'Failed to generate summary'
    );

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to summarize video' },
      { status: 500 }
    );
  }
}
