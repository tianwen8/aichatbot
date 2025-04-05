import "./globals.css";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import NavBar from "@/components/layout/nav-bar";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="AI chat, AI character roleplay, AI companions, AI chatbots, Character.ai, ChatGPT, Claude, AI conversation, virtual characters, AI directory, AI character chat directory" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://aidirectory.example.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AI Character Chat Directory" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AI Character Chat Directory",
              "description": "Discover the best AI character chat websites and tools, including Character.ai, ChatGPT, Claude and other AI chat applications",
              "url": "https://aidirectory.example.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://aidirectory.example.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
        <NavBar />
        <Toaster position="top-center" richColors closeButton />
        <main>{children}</main>
        <footer className="mx-auto mt-16 w-full max-w-5xl border-t border-gray-200 p-6 text-center text-sm text-gray-500">
          <p className="mb-2">
            © {new Date().getFullYear()} AI Character Chat Directory. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            <a href="/about" className="hover:text-gray-800">About Us</a>
            <a href="/privacy" className="hover:text-gray-800">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-800">Terms of Use</a>
            <a href="/submit" className="hover:text-gray-800">Submit AI Chat Site</a>
            <a href="/contact" className="hover:text-gray-800">Contact Us</a>
          </div>
          <div className="mt-4 text-xs">
            <p>Keywords: AI chat, AI roleplay, virtual companions, ChatGPT, Character.ai, Claude, AI conversation</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
