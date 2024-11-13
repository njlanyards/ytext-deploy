import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

const tools = [
  {
    title: "Transcript Explorer",
    description: "Search, explore and copy YouTube video transcripts with timestamps",
    icon: (
      <svg width="48" height="48" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect x="14" y="24" width="100" height="70" rx="20" fill="#FF0000"/>
        
        {/* Search icon overlay */}
        <circle cx="79" cy="59" r="20" fill="white" fillOpacity="0.9"/>
        <line x1="94" y1="74" x2="109" y2="89" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        
        {/* Text lines */}
        <line x1="24" y1="104" x2="64" y2="104" stroke="#666666" strokeWidth="4" strokeLinecap="round"/>
        <line x1="24" y1="114" x2="54" y2="114" stroke="#666666" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    href: "/tools/transcript-explorer",
    status: "popular",
  },
  {
    title: "Video Summarizer",
    description: "Get AI-powered summaries of YouTube videos in seconds",
    icon: (
      <svg width="48" height="48" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect x="14" y="24" width="100" height="70" rx="20" fill="#FF0000"/>
        
        {/* AI Brain Icon */}
        <circle cx="64" cy="59" r="20" fill="white" fillOpacity="0.9"/>
        <path
          d="M54 59a10 10 0 0120 0M59 54a5 5 0 0110 0M64 64v-10"
          stroke="#FF0000"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Text lines */}
        <line x1="24" y1="104" x2="104" y2="104" stroke="#666666" strokeWidth="4" strokeLinecap="round"/>
        <line x1="24" y1="114" x2="84" y2="114" stroke="#666666" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    href: "/tools/video-summarizer",
    status: "new"
  },
  {
    title: "Video SEO Enhancer",
    description: "Optimize your YouTube videos for better discoverability with AI-powered suggestions",
    icon: (
      <svg width="48" height="48" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect x="14" y="24" width="100" height="70" rx="20" fill="#FF0000"/>
        
        {/* SEO Graph Icon */}
        <path
          d="M34 74L54 54L74 64L94 44"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Text lines */}
        <line x1="24" y1="104" x2="104" y2="104" stroke="#666666" strokeWidth="4" strokeLinecap="round"/>
        <line x1="24" y1="114" x2="84" y2="114" stroke="#666666" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    href: "/tools/seo-enhancer",
    status: "new"
  },
  {
    title: "Thumbnail Downloader",
    description: "Download high-quality thumbnails from any YouTube video in multiple resolutions",
    icon: (
      <svg width="48" height="48" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect x="14" y="24" width="100" height="70" rx="20" fill="#FF0000"/>
        
        {/* Download Icon */}
        <path
          d="M64 44v30M52 64l12 12 12-12M44 84h40"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Text lines */}
        <line x1="24" y1="104" x2="104" y2="104" stroke="#666666" strokeWidth="4" strokeLinecap="round"/>
        <line x1="24" y1="114" x2="84" y2="114" stroke="#666666" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    href: "/tools/thumbnail-downloader",
    status: "new"
  },
  {
    title: "More Tools Coming Soon",
    description: "We're working on exciting new tools to enhance your YouTube experience",
    icon: "🚀",
    href: "#",
    status: "disabled",
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-[3.25rem] font-bold mb-6 leading-[1.15] tracking-tight">
            Enhance Your YouTube Experience<br />
            with AI-Powered Tools
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            A collection of tools created to make your YouTube viewing more enjoyable.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            tool.status === "disabled" ? (
              // Disabled "More Tools Coming Soon" card
              <div
                key={tool.title}
                className="relative bg-card/50 rounded-xl p-6 cursor-not-allowed opacity-75"
              >
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                  {tool.title}
                </h3>
                <p className="text-muted-foreground text-sm">{tool.description}</p>
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-border/50" />
              </div>
            ) : (
              // Regular interactive tool cards
              <Link
                key={tool.title}
                href={tool.href}
                className="group relative bg-card hover:bg-card/80 rounded-xl p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                {tool.status === 'popular' && (
                  <div className="absolute top-4 right-4 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Popular
                  </div>
                )}
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-muted-foreground text-sm">{tool.description}</p>
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-border group-hover:ring-primary/50 transition-colors" />
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
