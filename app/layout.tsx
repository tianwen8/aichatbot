import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Character & Virtual Companion Directory - Find Your Perfect AI Partner",
  description: "Discover the best AI characters, virtual companions, and AI girlfriends. Compare and find your ideal AI chat partner for meaningful conversations and companionship.",
  metadataBase: new URL('https://www.perai.shop'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta 
          name="keywords" 
          content="AI girlfriend, AI companion, AI waifu, virtual girlfriend, AI characters, chatbots, roleplay, AI lover, digital companion, AI chat partner, AI dating, virtual companionship" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.perai.shop" />
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
        <meta property="og:url" content="https://www.perai.shop" />
        <meta property="og:image" content="https://www.perai.shop/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Character & Virtual Companion Directory" />
        <meta name="twitter:description" content="Discover the best AI characters, virtual companions, and AI girlfriends" />
        <meta name="twitter:image" content="https://www.perai.shop/og-image.jpg" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AI Character & Virtual Companion Directory",
              "description": "Directory of AI characters, virtual companions, and AI girlfriends",
              "url": "https://www.perai.shop",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.perai.shop/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
              <div className="flex gap-6 md:gap-10">
                <Link href="/" className="flex items-center space-x-2">
                  <img src="/logo.png" alt="AI Character Directory" className="h-8 w-8" />
                  <span className="hidden font-bold sm:inline-block">
                    AI Character Directory
                  </span>
                </Link>
                <nav className="flex gap-6">
                  <Link href="/categories" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Categories
                  </Link>
                  <Link href="/rankings" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Rankings
                  </Link>
                  <Link href="/new" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    New & Trending
                  </Link>
                </nav>
              </div>
              <div className="flex flex-1 items-center justify-end space-x-4">
                <Button variant="default" asChild>
                  <Link href="/submit">Submit Character</Link>
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  &copy; {new Date().getFullYear()} AI Character Directory. All rights reserved.
                </p>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <Link href="/terms">Terms</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
