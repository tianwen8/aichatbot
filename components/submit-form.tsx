"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Loader2, RefreshCw, Check, AlertTriangle, ArrowRight, Sparkles, 
  Search, Globe, Link as LinkIcon, Users, Eye, BarChart, Code, 
  MessageSquare, ChevronRight, Layers, Star, Cpu, Camera, AlertCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SubmitForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [wideScreenshotUrl, setWideScreenshotUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState("");
  const [websiteData, setWebsiteData] = useState<any>(null);
  
  const categories = [
    { value: "ai-character", label: "AI Character" },
    { value: "ai-chat", label: "AI Chat" },
    { value: "ai-tool", label: "AI Tool" },
    { value: "ai-writing", label: "AI Writing" },
    { value: "ai-image", label: "AI Image" },
    { value: "ai-video", label: "AI Video" },
    { value: "ai-audio", label: "AI Audio" },
    { value: "ai-code", label: "AI Code" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    keywords: "",
    meta_description: "",
    category: "ai-tool"
  });
  
  const [loading, setLoading] = useState({
    submit: false,
    capture: false,
    generate: false
  });
  
  const [generatedContent, setGeneratedContent] = useState<{
    keywords: string;
    descriptions: {
      short: string;
      medium: string;
      long: string;
    };
    features: string[];
    suggestions: {
      title: string;
      seoScore: number;
    };
  } | null>(null);

  useEffect(() => {
    if (success && submittedSlug) {
      // Auto redirect to the project page after 3 seconds
      const timer = setTimeout(() => {
        router.push(`/projects/${submittedSlug}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, submittedSlug, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear previous error messages
    setError("");
  };

  const handleCaptureWebsite = async () => {
    if (!formData.url) {
      setError("Please enter a website URL");
      return;
    }
    
    try {
      setLoading({ ...loading, capture: true });
      setError("");
      console.log("Starting website capture for URL:", formData.url);
      
      // First clean URL and check format
      let urlToCapture = formData.url.trim();
      if (!urlToCapture.startsWith('http://') && !urlToCapture.startsWith('https://')) {
        console.log("URL doesn't have protocol, adding https://");
        urlToCapture = 'https://' + urlToCapture;
      }
      console.log("Formatted URL for capture:", urlToCapture);
      
      // Call the API with detailed logging
      console.log("Sending request to /api/capture endpoint...");
      const response = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToCapture }),
      });
      
      console.log("Capture API response status:", response.status, response.statusText);
      console.log("Capture API response headers:", Object.fromEntries(Array.from(response.headers)));
      
      // Get response as text first to log it
      const responseText = await response.text();
      console.log("Capture API raw response:", responseText);
      
      // Check for response problems
      if (!response.ok) {
        console.error("Capture API failed with status:", response.status);
        
        let errorMessage = "Failed to capture website";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse the response JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Capture API parsed response data:", JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error("Error parsing response JSON:", parseError);
        throw new Error("Invalid response format from server");
      }
      
      // Store screenshot URLs
      console.log("Setting screenshot URLs...");
      if (data.screenshot) {
        console.log("Screenshot URL:", data.screenshot);
        setScreenshotUrl(data.screenshot);
      } else {
        console.warn("No screenshot URL in response");
      }
      
      if (data.wideScreenshot) {
        console.log("Wide screenshot URL:", data.wideScreenshot);
        setWideScreenshotUrl(data.wideScreenshot);
      } else {
        console.warn("No wide screenshot URL in response");
      }
      
      if (data.logo) {
        console.log("Logo URL:", data.logo);
        setLogoUrl(data.logo);
      } else {
        console.warn("No logo URL in response");
      }
      
      // Store website data
      if (data.metadata) {
        console.log("Setting website data from metadata:", JSON.stringify(data.metadata, null, 2));
        setWebsiteData(data.metadata);
        
        // Auto-fill form fields
        console.log("Auto-filling form fields from metadata");
        setFormData(prev => {
          const updatedForm = {
            ...prev,
            name: data.metadata.title || prev.name,
            description: data.metadata.description || prev.description,
            keywords: data.metadata.keywords || prev.keywords,
            meta_description: data.metadata.description || prev.meta_description,
          };
          console.log("Updated form data:", updatedForm);
          return updatedForm;
        });
      } else {
        console.warn("No metadata in response");
      }
      
      // Show success message
      toast.success("Website captured successfully!");
      
    } catch (err: any) {
      console.error("Error capturing website:", err);
      setError(err.message || "Failed to capture website");
      toast.error("Failed to capture website: " + err.message);
    } finally {
      setLoading({ ...loading, capture: false });
    }
  };

  const handleGenerateContent = async () => {
    if (!formData.name || !formData.description) {
      setError("Please provide a name and description first");
      return;
    }

    try {
      setLoading({ ...loading, generate: true });
      setError("");
      
      const response = await fetch("/api/content-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.name,
          category: formData.category
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setGeneratedContent(data);
      
      // Auto-fill form with generated content
      setFormData(prev => ({
        ...prev,
        keywords: data.keywords,
        meta_description: data.descriptions.short
      }));
      
      toast.success("Content generated successfully!");
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate content");
      toast.error("Failed to generate content: " + err.message);
    } finally {
      setLoading({ ...loading, generate: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started...");
    
    // Debug information for form data
    console.log("Current form state:", {
      url: formData.url,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      meta_description: formData.meta_description ? formData.meta_description.length + " chars" : "empty",
      screenshotUrl: screenshotUrl ? "yes" : "no",
      logoUrl: logoUrl ? "yes" : "no"
    });
    
    if (!formData.name || !formData.description || !formData.url) {
      const missingFields = [];
      if (!formData.name) missingFields.push("Name");
      if (!formData.description) missingFields.push("Description");
      if (!formData.url) missingFields.push("URL");
      
      const errorMsg = `Please fill in the required fields: ${missingFields.join(", ")}`;
      console.error("Form validation failed, missing required fields:", missingFields);
      setError(errorMsg);
      
      // Alert to make the error more visible
      alert(`Please fill in the required fields: ${missingFields.join(", ")}`);
      return;
    }
    
    // Check if screenshot exists
    if (!screenshotUrl) {
      console.error("Missing website screenshot, submission aborted");
      setError("Please capture the website screenshot first");
      alert("Please capture the website screenshot first by clicking the Capture button");
      setLoading({ ...loading, submit: false });
      return;
    }
    
    try {
      setLoading({ ...loading, submit: true });
      setError("");
      console.log("Form validation passed, preparing submission...");
      
      console.log("Preparing submission data...");
      
      // Ensure features is a valid array
      let features = [];
      if (websiteData && websiteData.features) {
        if (Array.isArray(websiteData.features)) {
          features = websiteData.features;
        } else if (typeof websiteData.features === 'string') {
          try {
            const parsedFeatures = JSON.parse(websiteData.features);
            features = Array.isArray(parsedFeatures) ? parsedFeatures : [];
          } catch (err) {
            console.error("Failed to parse features string to JSON:", err);
            features = [];
          }
        }
      }
      
      // Ensure stats is a valid object
      let stats = {};
      if (websiteData && websiteData.stats) {
        if (typeof websiteData.stats === 'object' && websiteData.stats !== null) {
          stats = websiteData.stats;
        } else if (typeof websiteData.stats === 'string') {
          try {
            const parsedStats = JSON.parse(websiteData.stats);
            stats = typeof parsedStats === 'object' && parsedStats !== null ? parsedStats : {};
          } catch (err) {
            console.error("Failed to parse stats string to JSON:", err);
            stats = {};
          }
        }
      }
      
      // Truncate long meta_description
      let metaDescription = formData.meta_description || "";
      if (metaDescription.length > 160) {
        console.log("Meta description too long, truncating to 160 characters");
        metaDescription = metaDescription.substring(0, 157) + "...";
      }
      
      const submitData = {
        name: formData.name,
        description: formData.description,
        url: formData.url,
        keywords: formData.keywords || "",
        meta_description: metaDescription,
        category: formData.category,
        logo: logoUrl,
        image: screenshotUrl,
        features: features,
        instructions: websiteData?.instructions || "",
        stats: stats
      };
      
      toast.info("Submitting, please wait...");
      
      console.log("Submission data details:", JSON.stringify(submitData, null, 2));
      
      // Sanitize data to avoid JSON issues
      const sanitizedData = JSON.parse(JSON.stringify(submitData));
      console.log("Sanitized submission data:", JSON.stringify(sanitizedData));
      console.log("Starting API request...");
      
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });
      
      console.log("API response status:", response.status, response.statusText);
      console.log("Response headers:", Object.fromEntries(Array.from(response.headers)));
      
      // Get complete response text first
      const responseText = await response.text();
      console.log("API response text:", responseText);
      
      let data;
      try {
        // Then try to parse it as JSON
        data = JSON.parse(responseText);
        console.log("API response data:", JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Invalid response format from server: " + responseText.substring(0, 100));
      }
      
      if (!data.success) {
        console.error("API request failed:", data.message);
        throw new Error(data.message || "Submission failed");
      }
      
      console.log("Submission successful! Project ID:", data.data?.id, "Slug:", data.data?.slug);
      
      // Check if submission needs approval
      const needsApproval = data.data?.needsApproval;
      console.log("Submission needs approval:", needsApproval);
      
      // Visibly indicate success with appropriate message
      alert(data.message || "Tool submitted successfully!");
      
      setSuccess(true);
      setSubmitted(true);
      setSubmittedSlug(data.data?.slug);
      
      // Show different toast messages based on approval status
      if (needsApproval) {
        toast.success("Tool submitted successfully! It will be visible after review.");
      } else {
        toast.success("Tool submission successful! Redirecting to your submission page...");
      }
      
      console.log("Cleaning up form state...");
      setTimeout(() => {
        setFormData({
          name: "",
          url: "",
          description: "",
          keywords: "",
          meta_description: "",
          category: "ai-tool"
        });
        setScreenshotUrl("");
        setWideScreenshotUrl("");
        setLogoUrl("");
        setWebsiteData(null);
      }, 5000);
      
    } catch (err: any) {
      console.error("Error during submission:", err);
      setError(err.message || "An error occurred during submission");
      alert("Submission failed: " + err.message);
      toast.error("Submission failed: " + err.message);
    } finally {
      console.log("Submission process completed");
      setLoading({ ...loading, submit: false });
    }
  };
  
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Submission successful!</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Thank you for your submission. {submittedSlug ? "You can view your submission after it has been approved by an administrator." : "Our team will review it as soon as possible."}
        </p>
        {submittedSlug && (
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => router.push(`/projects/${submittedSlug}`)}
          >
            <ArrowRight className="h-4 w-4" />
            <span>View Submission</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              Website URL <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="url"
                  name="url"
                  id="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <Button
                type="button"
                onClick={handleCaptureWebsite}
                disabled={loading.capture || !formData.url}
                className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {loading.capture ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                <span className="ml-2">Capture</span>
              </Button>
            </div>
            {!screenshotUrl && (
              <p className="text-xs text-amber-600 mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Please capture the website screenshot before submitting
              </p>
            )}
          </div>

          {screenshotUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Website Preview</label>
              <div className="mt-1 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                <div className="border border-gray-300 rounded-lg p-2 bg-white">
                  <p className="text-xs text-gray-500 mb-1">Screenshot</p>
                  <div className="relative h-32 w-full">
                    <img
                      src={screenshotUrl}
                      alt="Website screenshot"
                      className="h-32 object-contain rounded-lg"
                      onError={(e) => {
                        console.error("Screenshot loading failed:", e);
                        e.currentTarget.src = "/placeholder-image.png";
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{screenshotUrl}</p>
                </div>
                {logoUrl && (
                  <div className="border border-gray-300 rounded-lg p-2 bg-white">
                    <p className="text-xs text-gray-500 mb-1">Logo</p>
                    <div className="relative h-32 w-32">
                      <img
                        src={logoUrl}
                        alt="Website logo"
                        className="h-32 w-32 rounded-lg object-contain"
                        onError={(e) => {
                          console.error("Logo loading failed:", e);
                          e.currentTarget.src = "/placeholder-image.png";
                          e.currentTarget.onerror = null;
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{logoUrl}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tool Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              placeholder="Enter tool name"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-character">AI Character</SelectItem>
                  <SelectItem value="ai-chat">AI Chat</SelectItem>
                  <SelectItem value="ai-tool">AI Tool</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-gray-500">
                Choose the most appropriate category for your submission
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              placeholder="Describe your tool..."
              required
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <Input
              type="text"
              name="keywords"
              id="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              placeholder="Enter keywords (comma separated)"
            />
          </div>

          <div>
            <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <Textarea
              name="meta_description"
              id="meta_description"
              value={formData.meta_description}
              onChange={handleInputChange}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              placeholder="Enter meta description for SEO"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={handleGenerateContent}
              disabled={loading.generate || !formData.name || !formData.description}
              variant="outline"
              className="inline-flex items-center"
            >
              {loading.generate ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Generate Content</span>
              )}
            </Button>
            <Button
              type="submit"
              disabled={loading.submit || !formData.name || !formData.description || !formData.url || !screenshotUrl}
              className="inline-flex items-center bg-purple-600 hover:bg-purple-700"
            >
              {loading.submit ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Submit Tool</span>
              )}
            </Button>
          </div>
          {!screenshotUrl && (
            <p className="text-center text-sm text-amber-600">
              You must capture the website screenshot before submitting
            </p>
          )}
        </div>
      </Card>
    </form>
  );
} 