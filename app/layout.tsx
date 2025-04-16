import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleAnalytics from "../src/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Character & Virtual Companion Directory - Find Your Perfect AI Partner",
  description: "Discover the best AI characters, virtual companions, and AI girlfriends. Compare and find your ideal AI chat partner for meaningful conversations and companionship.",
  metadataBase: new URL('https://periai.xyz'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta 
          name="keywords" 
          content="AI girlfriend, AI companion, AI waifu, virtual girlfriend, AI characters, chatbots, roleplay, AI lover, digital companion, AI chat partner, AI dating, virtual companionship" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://periai.xyz" />
        <link rel="icon" href="/logo.ico" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo512.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AI Character & Virtual Companion Directory" />
        <meta property="og:title" content="AI Character & Virtual Companion Directory - Find Your Perfect AI Partner" />
        <meta property="og:description" content="Discover the best AI characters, virtual companions, and AI girlfriends. Compare and find your ideal AI chat partner." />
        <meta property="og:url" content="https://periai.xyz" />
        <meta property="og:image" content="https://periai.xyz/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Character & Virtual Companion Directory" />
        <meta name="twitter:description" content="Discover the best AI characters, virtual companions, and AI girlfriends" />
        <meta name="twitter:image" content="https://periai.xyz/og-image.jpg" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AI Character & Virtual Companion Directory",
              "description": "Directory of AI characters, virtual companions, and AI girlfriends",
              "url": "https://periai.xyz",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://periai.xyz/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
            <div className="container flex h-16 items-center">
              <div className="flex gap-6 md:gap-10">
                <Link href="/" className="flex items-center space-x-2" aria-label="Home">
                  <img src="/logo.png" alt="AI Character Directory Logo" className="h-8 w-8" />
                  <span className="hidden font-bold sm:inline-block">
                    AI Character Directory
                  </span>
                </Link>
                <nav className="flex gap-6" role="navigation" aria-label="Main navigation">
                  <Link href="/categories" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary" aria-label="Browse Categories">
                    Categories
                  </Link>
                  <Link href="/rankings" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary" aria-label="View Rankings">
                    Rankings
                  </Link>
                  <Link href="/new" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary" aria-label="New and Trending">
                    New & Trending
                  </Link>
                </nav>
              </div>
              <div className="flex flex-1 items-center justify-end space-x-4">
                <Button variant="default" asChild>
                  <Link href="/submit" aria-label="Submit a new character">Submit Character</Link>
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1" role="main">{children}</main>
          <footer className="border-t py-6 md:py-0" role="contentinfo">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  &copy; {new Date().getFullYear()} AI Character Directory. All rights reserved.
                </p>
              </div>
              <nav className="flex gap-4 text-sm text-muted-foreground" aria-label="Footer navigation">
                <Link href="/terms" aria-label="Terms of Service">Terms</Link>
                <Link href="/privacy" aria-label="Privacy Policy">Privacy</Link>
                <Link href="/contact" aria-label="Contact Us">Contact</Link>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
