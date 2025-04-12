import { Metadata } from "next";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Filter, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/projects/project-card";
import { getProjectsByCategory } from "@/lib/supabase-db";

export const metadata: Metadata = {
  title: "AI Tools | AI Directory",
  description: "Discover practical AI tools including content generation, image processing, data analysis, and more specialized applications.",
  keywords: "AI tools, artificial intelligence applications, AI software, content generation, AI workflows, productivity tools, data analysis"
};

// Sub-categories for AI Tools
const subCategories = [
  { id: "all", name: "All Tools", description: "Browse AI tools for various functions and purposes" },
  { id: "content", name: "Content Creation", description: "AI tools for generating text, images, and multimedia content" },
  { id: "productivity", name: "Productivity", description: "AI assistants for improving efficiency and simplifying tasks" },
  { id: "data", name: "Data Analysis", description: "AI tools for analyzing and visualizing data" },
  { id: "coding", name: "Coding Assistance", description: "AI tools for writing and optimizing code" },
  { id: "workflow", name: "Workflow", description: "AI automation tools that integrate into existing workflows" },
];

export default async function AIToolsPage({ 
  searchParams
}: { 
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  unstable_noStore();
  
  // Get active sub-category
  const activeCategory = typeof searchParams.subcategory === 'string' 
    ? searchParams.subcategory 
    : 'all';
  
  // Get sorting preference
  const sortBy = typeof searchParams.sort === 'string'
    ? searchParams.sort
    : 'popular';
  
  // Fetch projects
  const projects = await getProjectsByCategory("ai-tools", 24);
  
  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/categories"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Categories
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 text-sm">
              <Wrench className="h-3.5 w-3.5 mr-1" />
              AI Tools
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">AI Tools & Applications</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Explore practical AI tools that enhance productivity, creativity, and problem-solving capabilities. From content creation to data analysis, discover solutions for your needs.
            </p>
          </div>
        </div>
      </div>
      
      {/* Sub-category navigation */}
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
        {subCategories.map((category) => (
          <Link 
            key={category.id}
            href={`/categories/ai-tools?subcategory=${category.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeCategory === category.id
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
      
      {/* Filters and sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-4">
        <div>
          <h2 className="text-lg font-semibold">
            {subCategories.find(c => c.id === activeCategory)?.name || "All Tools"}
          </h2>
          <p className="text-sm text-gray-500">
            {subCategories.find(c => c.id === activeCategory)?.description || "Browse AI tools for various functions and purposes"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Tabs value={sortBy} className="w-[180px]">
            <TabsList>
              <TabsTrigger value="popular" asChild>
                <Link href={`/categories/ai-tools?subcategory=${activeCategory}&sort=popular`}>Popular</Link>
              </TabsTrigger>
              <TabsTrigger value="latest" asChild>
                <Link href={`/categories/ai-tools?subcategory=${activeCategory}&sort=latest`}>Latest</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.slug}
              {...project}
              gradient="from-green-100 via-lime-50 to-emerald-100"
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Tools Found</h3>
            <p className="text-gray-500 mb-4">We couldn't find any AI tools matching your criteria</p>
            <Button asChild variant="outline">
              <Link href="/categories/ai-tools">View All Tools</Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Call to action */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Have an AI Tool to Share?</h2>
            <p className="mt-2 text-gray-600">
              Submit your AI tool to our directory and reach thousands of potential users.
            </p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/submit">
              Submit Your Tool
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 