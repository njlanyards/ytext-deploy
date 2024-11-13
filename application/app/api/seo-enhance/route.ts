import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: Request) {
  try {
    const { title, description, tags } = await request.json();

    // Validate input
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const prompt = `As a YouTube SEO expert, analyze and enhance this video metadata for maximum visibility:

Title: "${title}"
Description: "${description}"
Tags: "${tags}"

Provide optimization suggestions following YouTube's current best practices. Focus on creating:

1. Engaging titles that drive clicks (45-70 characters)
2. A comprehensive, well-structured description that includes:
   - An engaging hook in the first 2-3 lines
   - Main value points and content overview
   - Relevant timestamps (if applicable)
   - Call-to-action (subscribe, like, etc.)
   - Social media links
   - 3-5 relevant hashtags

3. Strategic tags and keywords that boost discoverability

Format the description with proper sections and spacing. Use \\n for newlines. Example format:

🎥 [Engaging Hook / Main Value Proposition]\\n\\n
In this video, you'll discover:\\n
• [Key Point 1]\\n
• [Key Point 2]\\n
• [Key Point 3]\\n\\n
🕒 TIMESTAMPS:\\n
00:00 - Introduction\\n
02:30 - Main Topic 1\\n
05:45 - Main Topic 2\\n\\n
📱 CONNECT WITH ME:\\n
Instagram: @handle\\n
Twitter: @handle\\n
Website: example.com\\n\\n
#Hashtag1 #Hashtag2 #Hashtag3

Respond with a JSON object in this format:
{
  "title": [
    "Primary SEO-optimized title",
    "Alternative engaging title",
    "Question-based title variation"
  ],
  "description": [
    "Full optimized description with all sections",
    "Alternative description with different emphasis",
    "Condensed version for sharing"
  ],
  "tags": [
    "primary-keyword",
    "secondary-keyword",
    "long-tail-keyword",
    "related-term",
    "niche-specific",
    "broader-topic"
  ],
  "keywords": [
    "trending-term-1",
    "trending-term-2",
    "trending-term-3",
    "trending-term-4"
  ]
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a YouTube SEO expert. Always respond with properly formatted JSON objects. Use \\n for newlines in descriptions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = chatCompletion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("Failed to generate suggestions");
    }

    // Clean up the response before parsing
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    
    // Parse the JSON
    let suggestions;
    try {
      suggestions = JSON.parse(cleanedResponse);
      
      // Convert escaped newlines back to actual newlines for display
      suggestions.description = suggestions.description.map((desc: string) => 
        desc.replace(/\\n/g, '\n')
      );
    } catch (error) {
      console.error("Failed to parse AI response:", cleanedResponse);
      throw new Error("Failed to parse suggestions");
    }

    // Validate the response structure
    const expectedKeys = ['title', 'description', 'tags', 'keywords'];
    const hasAllKeys = expectedKeys.every(key => 
      Array.isArray(suggestions[key]) && suggestions[key].length > 0
    );

    if (!hasAllKeys) {
      throw new Error("Invalid suggestion format received");
    }

    return NextResponse.json(suggestions);

  } catch (error) {
    console.error('SEO Enhancement error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate SEO suggestions" },
      { status: 500 }
    );
  }
}
