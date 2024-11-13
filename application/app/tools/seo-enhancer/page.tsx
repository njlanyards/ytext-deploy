"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wand2 } from "lucide-react";
import { ConfettiButton } from "@/components/ui/confetti";

interface SEOSuggestions {
  title: string[];
  description: string[];
  tags: string[];
  keywords: string[];
}

export default function SEOEnhancer() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SEOSuggestions | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/seo-enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, tags }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate SEO suggestions");
      }

      setSuggestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
        <h1 className="text-4xl font-bold mb-4">Video SEO Enhancer</h1>
        <p className="text-muted-foreground max-w-2xl">
          Optimize your YouTube videos for better discoverability. Get AI-powered suggestions
          for titles, descriptions, and tags to improve your video's reach.
        </p>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Video Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your video title..."
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              required
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Video Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your video description..."
              className="w-full h-32 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              required
            />
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="gaming, tutorial, minecraft..."
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          <ConfettiButton
            type="submit"
            disabled={loading}
            options={{
              spread: 360,
              particleCount: 100,
              origin: { y: 0.6 }
            }}
            className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Enhance SEO"}
          </ConfettiButton>
        </form>

        {/* Results Section */}
        {suggestions && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">Suggestions</h2>
            
            {/* Title Suggestions */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Title Suggestions</h3>
              <ul className="space-y-2">
                {suggestions.title.map((suggestion, index) => (
                  <li key={index} className="p-4 rounded-lg bg-card border border-border">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Description Suggestions */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Description Improvements</h3>
              <div className="space-y-4">
                {suggestions.description.map((suggestion, index) => (
                  <div key={index} className="p-6 rounded-lg bg-card border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {index === 0 ? "Full Optimized Version" : 
                           index === 1 ? "Alternative Version" : 
                           "Condensed Version"}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {index === 0 ? "Complete description with all recommended sections" :
                           index === 1 ? "Different emphasis and structure" :
                           "Shorter version for social sharing"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(suggestion, index)}
                        className="inline-flex items-center px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-sm font-medium transition-colors"
                      >
                        {copiedIndex === index ? (
                          <>
                            <span className="text-green-500">✓</span>
                            <span className="ml-1.5">Copied!</span>
                          </>
                        ) : (
                          <>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none bg-muted/50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {suggestion}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tag Suggestions */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recommended Tags</h3>
                <span className="text-xs text-muted-foreground">
                  Ordered by relevance
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Keyword Insights */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Trending Keywords</h3>
                <span className="text-xs text-muted-foreground">
                  Current trending terms in your niche
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
