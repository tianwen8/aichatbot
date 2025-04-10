import { Metadata } from "next";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { ArrowLeft, Star, ArrowRight, SparklesIcon, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/projects/project-card";
import { getFeaturedProjects } from "@/lib/supabase-db";

export const metadata: Metadata = {
  title: "Featured AI Tools | AI Character Directory",
  description: "Explore our curated selection of featured AI tools, characters, and chat assistants. Discover the best in AI technology and innovation.",
  keywords: "featured AI tools, best AI, top AI characters, recommended chatbots, curated AI selection, AI highlights"
};

export default async function FeaturedPage({ 
  searchParams
}: { 
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  unstable_noStore();
  
  // Get category filter
  const categoryFilter = typeof searchParams.category === 'string'
    ? searchParams.category
    : 'all';
  
  // Fetch featured projects
  const projects = await getFeaturedProjects([], categoryFilter === 'all' ? undefined : categoryFilter);
  
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
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge className="mb-2 bg-secondary/10 text-secondary hover:bg-secondary/20 px-3 py-1">
              <SparklesIcon className="h-3.5 w-3.5 mr-1" />
              Editor's Choice
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">Featured AI Tools</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Our handpicked selection of exceptional AI tools, characters, and chat assistants.
              These are the standout tools that impressed our team with their innovation and quality.
            </p>
          </div>
        </div>
      </div>
      
      {/* Filter tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <Link
            key={category.id}
            href={`/featured?category=${category.id}`}
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
      
      {/* Featured projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
              featured={true}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <SparklesIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No featured tools found</h3>
            <p className="text-gray-500 mb-4">We couldn't find any featured AI tools in this category</p>
            <Button asChild variant="outline">
              <Link href="/featured">View All Featured Tools</Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Info section */}
      <div className="bg-gray-50 border rounded-xl p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How We Select Featured Tools</h2>
        <p className="text-gray-700 mb-4">
          Our featured selection represents the best AI tools and experiences available, carefully curated by our team of AI experts.
          Each featured tool has been thoroughly evaluated based on the following criteria:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-5 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Star className="h-4 w-4" />
              </div>
              <h3 className="font-medium text-gray-900">Innovation</h3>
            </div>
            <p className="text-sm text-gray-600">
              Brings new ideas, capabilities, or approaches to the AI space that push the boundaries of what's possible.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Star className="h-4 w-4" />
              </div>
              <h3 className="font-medium text-gray-900">User Experience</h3>
            </div>
            <p className="text-sm text-gray-600">
              Offers an exceptional, intuitive, and delightful experience for users, with thoughtful design and flow.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Star className="h-4 w-4" />
              </div>
              <h3 className="font-medium text-gray-900">Impact</h3>
            </div>
            <p className="text-sm text-gray-600">
              Demonstrates significant potential to improve workflows, creativity, productivity, or quality of life.
            </p>
          </div>
        </div>
      </div>
      
      {/* Submission CTA */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Have an exceptional AI tool?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Submit your AI tool, chatbot, or character to our directory. Outstanding submissions may be selected for our featured collection.
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