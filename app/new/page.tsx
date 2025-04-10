import { Metadata } from "next";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { ArrowLeft, Clock, TrendingUp, Filter, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/projects/project-card";
import { getLatestProjects, getTrendingProjects } from "@/lib/supabase-db";

export const metadata: Metadata = {
  title: "New & Trending AI Tools | AI Character Directory",
  description: "Discover the latest and most trending AI tools, characters, and chat assistants. Stay updated with the newest additions to our directory.",
  keywords: "new AI tools, trending AI, latest AI characters, new chatbots, recent AI releases, AI updates"
};

export default async function NewAndTrendingPage({ 
  searchParams
}: { 
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  unstable_noStore();
  
  // Get active tab
  const activeTab = typeof searchParams.tab === 'string' 
    ? searchParams.tab
    : 'latest';
  
  // Get category filter
  const categoryFilter = typeof searchParams.category === 'string'
    ? searchParams.category
    : 'all';
  
  // Fetch projects based on active tab
  const projects = activeTab === 'latest'
    ? await getLatestProjects(categoryFilter, 24)
    : await getTrendingProjects(categoryFilter, 24);
  
  // Category options
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "ai-character", name: "AI Characters" },
    { id: "ai-chat", name: "AI Chat" },
    { id: "ai-tool", name: "AI Tools" }
  ];
  
  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900">New & Trending AI Tools</h1>
        <p className="mt-2 text-gray-600 max-w-3xl">
          Discover the latest additions to our directory and the most trending AI tools.
          Stay updated with new releases and rising stars in the AI ecosystem.
        </p>
      </div>
      
      {/* Tabs and filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <Tabs value={activeTab} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="latest" asChild>
              <Link href={`/new?tab=latest&category=${categoryFilter}`} className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Latest
              </Link>
            </TabsTrigger>
            <TabsTrigger value="trending" asChild>
              <Link href={`/new?tab=trending&category=${categoryFilter}`} className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Trending
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      {/* Filter tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <Link
            key={category.id}
            href={`/new?tab=${activeTab}&category=${category.id}`}
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${
              category.id === categoryFilter
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
      
      {/* Content */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          {activeTab === 'latest' ? (
            <Badge className="bg-blue-100 text-blue-800">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Latest Additions
            </Badge>
          ) : (
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              Trending Now
            </Badge>
          )}
          <span className="text-sm text-gray-500">
            {activeTab === 'latest' 
              ? 'New tools added within the last 30 days'
              : 'Tools gaining popularity this week'}
          </span>
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.slug}
                {...project}
                gradient={
                  project.category === 'ai-character'
                    ? 'from-purple-100 via-violet-50 to-blue-100'
                    : project.category === 'ai-chat'
                    ? 'from-blue-100 via-sky-50 to-teal-100'
                    : 'from-green-100 via-emerald-50 to-teal-100'
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeTab === 'latest' ? 'new' : 'trending'} tools found</h3>
              <p className="text-gray-500 mb-4">We couldn't find any AI tools matching your criteria</p>
              <Button asChild variant="outline">
                <Link href="/new">View All New Tools</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Info section */}
      <div className="bg-gray-50 border rounded-xl p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How we determine trending tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Latest Tools</h3>
            <p className="text-gray-600">
              Our "Latest" section showcases tools that have been added to our directory within the past 30 days, 
              sorted by their addition date with the most recent ones first.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Trending Tools</h3>
            <p className="text-gray-600">
              The "Trending" tab highlights tools that are seeing significant growth in popularity based on metrics
              like user count increases, rating improvements, and social media mentions over the past 7 days.
            </p>
          </div>
        </div>
      </div>
      
      {/* Submission CTA */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Have a new AI tool to share?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Submit your new AI tool, chatbot, or character to our directory and get it featured in our latest section.
        </p>
        <Button asChild size="lg">
          <Link href="/submit">
            Submit Your Tool
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
} 