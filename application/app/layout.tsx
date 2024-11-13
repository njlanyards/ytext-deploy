import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Nav } from "@/components/nav";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "YouTube Tools - Enhance Your Viewing Experience",
  description: "A collection of tools to improve your YouTube viewing experience",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <nav className="border-b border-border/40 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <circle cx="64" cy="64" r="64" fill="currentColor"/>
                <path
                  d="M85.5 64.5L52.5 84.5V44.5L85.5 64.5Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>YouTube Tools</span>
            </Link>
            <Nav />
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
