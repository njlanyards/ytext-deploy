"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Copy, Clock } from "lucide-react";
import { ConfettiButton } from "@/components/ui/confetti";
import { extractVideoId } from "@/lib/utils";

export default function VideoSummarizer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const extractedVideoId = extractVideoId(url);
      if (!extractedVideoId) {
        throw new Error('Invalid YouTube URL');
      }
      setVideoId(extractedVideoId);

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize video");
      }

      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
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
        <h1 className="text-4xl font-bold mb-4">Video Summarizer</h1>
        <p className="text-muted-foreground max-w-2xl">
          Get an AI-powered summary of any YouTube video in seconds. Perfect for quick understanding
          of long videos.
        </p>
      </header>

      {/* Main Content */}
      <div>
        <div className="max-w-4xl">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
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
                  {loading ? "Summarizing..." : "Get Summary"}
                </ConfettiButton>
              </div>
              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        {(videoId || summary) && (
          <div className="flex gap-6 mb-8">
            {/* Video Player */}
            {videoId && (
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
            )}

            {/* Summary Card */}
            {summary && (
              <div className="w-96 bg-card rounded-lg border border-border flex flex-col h-[calc(56.25vw*0.75)]">
                <div className="p-4 border-b border-border flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Video Summary</h2>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center justify-center px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg"
                    >
                      {copyStatus ? (
                        <>
                          <Bot className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Summary
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{summary}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
