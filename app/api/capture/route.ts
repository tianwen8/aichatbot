import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Helper function: Extract domain
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    console.log("Error extracting domain:", error);
    return url;
  }
}

// Auto-scroll function
async function autoScroll(page: any) {
  console.log("Starting auto-scroll...");
  return page.evaluate(() => {
    return new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const maxScrolls = 20;
      let scrollCount = 0;
      
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        scrollCount++;
        
        if (totalHeight >= scrollHeight || scrollCount >= maxScrolls) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
}

// Using Puppeteer for real screenshot and data extraction
export async function POST(request: Request) {
  let browser = null;
  
  console.log("=== WEBSITE CAPTURE API CALLED ===");
  console.log("Time:", new Date().toISOString());
  
  try {
    console.log("Received website capture request");
    
    // Parse request body
    let body;
    try {
      const requestText = await request.text();
      console.log("Raw request body:", requestText);
      
      body = JSON.parse(requestText);
      console.log("Parsed request body:", JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    
    const { url } = body;
    
    if (!url) {
      console.error("Missing URL parameter");
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }
    
    console.log("Getting website information:", url);
    
    // Format URL
    let formattedUrl = url;
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = 'https://' + url;
    }
    
    console.log("Accessing webpage:", formattedUrl);
    
    // Launch browser
    console.log("Launching browser...");
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log("Browser launched successfully");
    
    try {
      const page = await browser.newPage();
      console.log("New page created");
      
      await page.setViewport({ width: 1280, height: 800 });
      console.log("Viewport set to 1280x800");
      
      console.log("Navigating to URL:", formattedUrl);
      await page.goto(formattedUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      console.log("Page loaded successfully");
      
      // Wait for page to load
      console.log("Waiting for page to stabilize...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Wait completed");
      
      // Extract website metadata
      console.log("Extracting metadata...");
      const metadata = await page.evaluate(() => {
        console.log("Inside page evaluate for metadata extraction");
        
        const title = document.title || "";
        console.log("Title extracted:", title);
        
        // Get meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        const description = metaDesc ? metaDesc.getAttribute('content') : "";
        console.log("Description extracted:", description ? "Found" : "Not found");
        
        // Get meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        const keywords = metaKeywords ? metaKeywords.getAttribute('content') : "";
        console.log("Keywords extracted:", keywords ? "Found" : "Not found");
        
        // Try to extract more description from content
        let bodyText = "";
        try {
          const paragraphs = document.querySelectorAll('p');
          console.log("Found paragraphs:", paragraphs.length);
          
          if (paragraphs.length > 0) {
            // Get text from the first 3 paragraphs
            for (let i = 0; i < Math.min(3, paragraphs.length); i++) {
              const text = paragraphs[i].textContent?.trim();
              if (text && text.length > 20) {
                bodyText += text + " ";
              }
            }
          }
          console.log("Body text extracted:", bodyText ? bodyText.substring(0, 50) + "..." : "None");
        } catch (e) {
          console.log("Error extracting body text:", e);
        }
        
        // Look for favicon
        let favicon = "";
        const faviconEl = document.querySelector('link[rel*="icon"]');
        if (faviconEl) {
          favicon = faviconEl.getAttribute('href') || "";
          console.log("Favicon found in link tag:", favicon.substring(0, 50));
        }
        
        if (!favicon) {
          // Use default favicon location
          favicon = window.location.origin + "/favicon.ico";
          console.log("Using default favicon location:", favicon);
        } else if (favicon.startsWith("/")) {
          // Convert relative path to absolute path
          favicon = window.location.origin + favicon;
          console.log("Converting relative favicon path to absolute:", favicon.substring(0, 50));
        }
        
        return {
          title,
          description: description || bodyText.substring(0, 250),
          keywords,
          favicon
        };
      });
      
      console.log("Extracted metadata:", JSON.stringify(metadata, null, 2));
      
      // Extract additional information
      console.log("Setting up mock extra data...");
      const mockExtraData = {
        features: [],
        instructions: "",
        stats: {},
      };
      
      // Automatically scroll the page to load more content
      console.log("Starting page auto-scroll");
      await autoScroll(page);
      console.log("Auto-scroll completed");
      
      // Take screenshot of the entire page
      console.log("Taking screenshot...");
      try {
        const screenshotBuffer = await page.screenshot({
          type: 'jpeg',
          quality: 80,
          fullPage: false
        });
        console.log("Screenshot taken successfully, size:", screenshotBuffer.length, "bytes");
        
        // Widescreen screenshot
        console.log("Taking widescreen screenshot...");
        await page.setViewport({ width: 1920, height: 1080 });
        console.log("Viewport resized to 1920x1080");
        
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("Waiting 500ms after viewport resize");
        
        const wideScreenshotBuffer = await page.screenshot({
          type: 'jpeg',
          quality: 80,
          fullPage: false
        });
        console.log("Widescreen screenshot taken successfully, size:", wideScreenshotBuffer.length, "bytes");
        
        // Generate unique ID
        const domain = extractDomain(formattedUrl);
        const id = uuidv4();
        console.log(`Generated ID: ${id} for domain: ${domain}`);
        
        // Upload screenshots to Supabase Storage
        console.log("Starting to upload screenshots to Supabase...");
        const { data: screenshotData, error: screenshotError } = await supabase.storage
          .from('website-data')
          .upload(`screenshots/${domain}-${id}.jpg`, screenshotBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });
        
        if (screenshotError) {
          console.error("Screenshot upload error:", screenshotError);
          throw new Error("Failed to upload screenshot: " + screenshotError.message);
        }
        
        console.log("Screenshot uploaded successfully:", screenshotData);
        
        const { data: wideScreenshotData, error: wideScreenshotError } = await supabase.storage
          .from('website-data')
          .upload(`screenshots/${domain}-wide-${id}.jpg`, wideScreenshotBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });
        
        if (wideScreenshotError) {
          console.error("Widescreen screenshot upload error:", wideScreenshotError);
        } else {
          console.log("Widescreen screenshot uploaded successfully:", wideScreenshotData);
        }
        
        // Get public URLs
        const screenshotUrl = supabase.storage
          .from('website-data')
          .getPublicUrl(`screenshots/${domain}-${id}.jpg`).data.publicUrl;
        
        const wideScreenshotUrl = supabase.storage
          .from('website-data')
          .getPublicUrl(`screenshots/${domain}-wide-${id}.jpg`).data.publicUrl;
        
        console.log("Screenshot URL:", screenshotUrl);
        console.log("Widescreen screenshot URL:", wideScreenshotUrl);
        
        // Close browser
        await browser.close();
        browser = null;
        console.log("Browser closed");
        
        // Prepare return data
        console.log("Preparing response data...");
        const responseData = {
          screenshot: screenshotUrl,
          wideScreenshot: wideScreenshotUrl,
          logo: metadata.favicon,
          metadata: {
            ...metadata,
            ...mockExtraData
          }
        };
        
        console.log("Final response data:", JSON.stringify(responseData, null, 2));
        return NextResponse.json(responseData);
      } catch (screenshotError) {
        console.error("Error taking screenshot:", screenshotError);
        throw new Error("Failed to take screenshot: " + screenshotError.message);
      }
    } catch (pageError) {
      console.error("Error processing page:", pageError);
      if (browser) await browser.close();
      browser = null;
      throw new Error("Failed to process page: " + pageError.message);
    }
  } catch (error: any) {
    console.error("Error during website capture:", error);
    console.error("Error stack:", error.stack);
    if (browser) {
      try {
        await browser.close();
        console.log("Browser closed after error");
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
    return NextResponse.json(
      { error: error.message || "Failed to capture website" },
      { status: 500 }
    );
  } finally {
    console.log("=== WEBSITE CAPTURE API COMPLETED ===");
  }
} 