import Link from "next/link";

const tools = [
  {
    name: "Transcript Explorer",
    href: "/tools/transcript-explorer",
  },
  {
    name: "Video Summarizer",
    href: "/tools/video-summarizer",
  },
  {
    name: "Video SEO Enhancer",
    href: "/tools/seo-enhancer",
  },
  {
    name: "Thumbnail Downloader",
    href: "/tools/thumbnail-downloader",
  }
];

export function Nav() {
  return (
    <div className="flex items-center space-x-6">
      <div className="relative group">
        <button className="text-foreground hover:text-foreground/80 transition-colors">
          Tools
        </button>
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-background border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
