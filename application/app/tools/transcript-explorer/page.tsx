"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Copy, Clock, Download, Check } from "lucide-react";
import { ConfettiButton } from "@/components/ui/confetti";

interface TranscriptSegment {
  text: string;
  timestamp: string;
}

const extractVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default function TranscriptExplorer() {
  const [url, setUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'timestamps' | 'text' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const extractedVideoId = extractVideoId(url);
      if (!extractedVideoId) {
        throw new Error('Invalid YouTube URL');
      }
      setVideoId(extractedVideoId);

      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }

      setTranscript(data.transcript);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTranscript = (withTimestamps: boolean) => {
    const text = transcript
      .map((segment) => 
        withTimestamps ? `[${segment.timestamp}] ${segment.text}` : segment.text
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    
    // Set the status for the clicked button
    setCopyStatus(withTimestamps ? 'timestamps' : 'text');
    
    // Reset the status after 2 seconds
    setTimeout(() => {
      setCopyStatus(null);
    }, 2000);
  };

  const handleTimestampClick = (timestamp: string) => {
    // Convert MM:SS to seconds
    const [minutes, seconds] = timestamp.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    
    // Get the iframe element and update its src
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const currentSrc = iframe.src;
      const baseUrl = currentSrc.split('?')[0];
      iframe.src = `${baseUrl}?start=${totalSeconds}&autoplay=1`;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Link>
        <h1 className="text-4xl font-bold mb-4">Transcript Explorer</h1>
        <p className="text-muted-foreground max-w-2xl">
          Enter a YouTube video URL to view its transcript. Search through the content
          and copy with or without timestamps.
        </p>
      </header>

      {/* URL Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 max-w-2xl">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here... (e.g., https://www.youtube.com/watch?v=...)"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              required
            />
            <ConfettiButton
              type="submit"
              disabled={loading}
              options={{
                spread: 360,
                particleCount: 100,
                origin: { y: 0.6 }
              }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Get Transcript"}
            </ConfettiButton>
          </div>
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
        </div>
      </form>

      

      {transcript.length > 0 && (
        <div className="flex gap-6 mb-8">
          {/* Video Section */}
          <div className="flex-1">
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full rounded-lg"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>

          {/* Transcript Section */}
          <div className="w-96 bg-card rounded-lg border border-border flex flex-col h-[calc(56.25vw*0.75)]">
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transcript..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {transcript
                .filter((segment) => 
                  searchQuery === '' || 
                  segment.text.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((segment, index) => (
                  <div
                    key={index}
                    className="mb-4 last:mb-0 hover:bg-muted/50 p-2 rounded cursor-pointer"
                  >
                    <div 
                      onClick={() => handleTimestampClick(segment.timestamp)}
                      className="text-sm text-primary hover:text-primary/80 mb-1 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3 h-3" />
                      {segment.timestamp}
                    </div>
                    <p>{segment.text}</p>
                  </div>
                ))}
            </div>
            <div className="p-4 border-t border-border flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleCopyTranscript(true)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg"
              >
                {copyStatus === 'timestamps' ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Clock className="w-4 h-4 mr-2" />
                )}
                {copyStatus === 'timestamps' ? 'Copied!' : 'With Timestamps'}
              </button>
              <button
                onClick={() => handleCopyTranscript(false)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg"
              >
                {copyStatus === 'text' ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copyStatus === 'text' ? 'Copied!' : 'Text Only'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 