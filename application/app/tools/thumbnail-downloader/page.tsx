"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Image as ImageIcon } from "lucide-react";
import { ConfettiButton } from "@/components/ui/confetti";

interface ThumbnailUrls {
  default: string;   // 120x90
  medium: string;    // 320x180
  high: string;      // 480x360
  standard: string;  // 640x480
  maxres: string;    // 1280x720
}

export default function ThumbnailDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<ThumbnailUrls | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setThumbnails(null);
    setVideoTitle(null);

    try {
      const response = await fetch("/api/thumbnails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch thumbnails");
      }

      setThumbnails(data.thumbnails);
      setVideoTitle(data.title);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, quality: string) => {
    try {
      const response = await fetch('/api/download-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) throw new Error('Failed to download image');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = `youtube-thumbnail-${quality}-${videoTitle || 'video'}.jpg`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download image. Please try again.');
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
        <h1 className="text-4xl font-bold mb-4">Thumbnail Downloader</h1>
        <p className="text-muted-foreground max-w-2xl">
          Download high-quality thumbnails from any YouTube video. Choose from multiple resolutions
          and get instant previews.
        </p>
      </header>

      {/* Main Content */}
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
                {loading ? "Loading..." : "Get Thumbnails"}
              </ConfettiButton>
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
          </div>
        </form>

        {/* Results Grid */}
        {thumbnails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(thumbnails).map(([quality, url]) => (
              <div key={quality} className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="aspect-video relative group">
                  <img
                    src={url}
                    alt={`${quality} thumbnail`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDownload(url, quality)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white"
                  >
                    <Download className="w-5 h-5" />
                    Download {quality} Quality
                  </button>
                </div>
                <div className="p-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {quality} Quality
                    </span>
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
