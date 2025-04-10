import { Metadata } from "next";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, SparklesIcon, MessageCircle, Zap, Grid3X3, BrainCircuit, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectsByCategory } from "@/lib/supabase-db";
import FallbackImage from "@/components/ui/fallback-image";

export const metadata: Metadata = {
  title: "Browse AI Categories | AI Character Directory",
  description: "Explore all categories of AI tools, characters, and chat assistants. Find the perfect AI solution for your needs.",
  keywords: "AI categories, AI characters, AI chat tools, AI assistants, virtual companions, AI directory"
};

// Main category definitions
const mainCategories = [
  {
    id: "ai-character",
    name: "AI Characters",
    description: "Chat with AI personalities and virtual companions",
    icon: <Users className="h-6 w-6" />,
    color: "bg-purple-100",
    textColor: "text-purple-800",
    gradient: "from-purple-100 via-violet-50 to-blue-100",
  },
  {
    id: "ai-chat",
    name: "AI Chat",
    description: "Powerful conversation models and language assistants",
    icon: <MessageCircle className="h-6 w-6" />,
    color: "bg-blue-100",
    textColor: "text-blue-800",
    gradient: "from-blue-100 via-sky-50 to-indigo-100",
  },
  {
    id: "ai-tool",
    name: "AI Tools",
    description: "Productivity enhancers and specialized AI utilities",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-emerald-100",
    textColor: "text-emerald-800",
    gradient: "from-emerald-100 via-green-50 to-teal-100",
  }
];

// Sub-categories mapped to main categories
const subCategories = {
  "ai-character": [
    { id: "roleplay", name: "Roleplay Characters", count: 28 },
    { id: "virtual-companion", name: "Virtual Companions", count: 23 },
    { id: "historical-figures", name: "Historical Figures", count: 17 },
    { id: "fictional-characters", name: "Fictional Characters", count: 14 },
  ],
  "ai-chat": [
    { id: "language-models", name: "Language Models", count: 19 },
    { id: "conversation-assistants", name: "Conversation Assistants", count: 24 },
    { id: "specialized-assistants", name: "Specialized Assistants", count: 16 },
    { id: "multilingual-chat", name: "Multilingual Chat", count: 12 },
  ],
  "ai-tool": [
    { id: "writing-assistants", name: "Writing Assistants", count: 31 },
    { id: "code-helpers", name: "Code Helpers", count: 26 },
    { id: "content-generators", name: "Content Generators", count: 24 },
    { id: "productivity-tools", name: "Productivity Tools", count: 18 },
  ]
};

export default async function CategoriesPage() {
  unstable_noStore();
  
  // Fetch sample projects for each main category
  const characterProjects = await getProjectsByCategory("ai-character", 3);
  const chatProjects = await getProjectsByCategory("ai-chat", 3);
  const toolProjects = await getProjectsByCategory("ai-tool", 3);
  
  const categoryProjects = {
    "ai-character": characterProjects,
    "ai-chat": chatProjects,
    "ai-tool": toolProjects
  };
  
  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1 text-sm">
          <SparklesIcon className="h-3.5 w-3.5 mr-1" />
          Find the Perfect AI for Your Needs
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900">Browse AI Categories</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Explore our comprehensive collection of AI tools, chat models, and virtual characters,
          organized into categories to help you find exactly what you're looking for.
        </p>
      </div>
      
      {/* Main Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {mainCategories.map((category) => (
          <div key={category.id} className={`rounded-xl overflow-hidden border shadow-sm bg-gradient-to-br ${category.gradient}`}>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${category.color}`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="font-bold text-2xl text-gray-900">{category.name}</h2>
                  <p className="text-sm text-gray-600">{subCategories[category.id].reduce((sum, sub) => sum + sub.count, 0)} tools</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{category.description}</p>
              
              {/* Sub-categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {subCategories[category.id].map((subCategory) => (
                  <Link
                    key={subCategory.id}
                    href={`/categories/${category.id}?subcategory=${subCategory.id}`}
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${category.textColor} ${category.color} hover:opacity-90`}
                  >
                    {subCategory.name} ({subCategory.count})
                  </Link>
                ))}
              </div>
              
              {/* Sample projects */}
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-sm text-gray-700">Featured Tools</h3>
                {categoryProjects[category.id]?.length > 0 ? (
                  categoryProjects[category.id].map((project) => (
                    <Link 
                      key={project.id} 
                      href={`/projects/${project.slug}`}
                      className="block group hover:bg-white/50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {project.logo && (
                          <div className="w-8 h-8 rounded overflow-hidden bg-white">
                            <FallbackImage 
                              src={project.logo} 
                              alt={project.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate group-hover:text-primary">{project.name}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No tools available</p>
                )}
              </div>
              
              <Button asChild variant="outline" className="w-full">
                <Link href={`/categories/${category.id}`}>
                  View All {category.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Advanced Categories & Use Cases */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Specialized Categories & Use Cases</h2>
          <Link
            href="/use-cases"
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
          >
            View all use cases
            <ArrowRight className="ml-1 inline-block h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            { id: "creative-writing", name: "Creative Writing", icon: <Bot className="h-5 w-5" />, count: 38 },
            { id: "programming", name: "Programming", icon: <BrainCircuit className="h-5 w-5" />, count: 42 },
            { id: "education", name: "Education", icon: <Grid3X3 className="h-5 w-5" />, count: 31 },
            { id: "entertainment", name: "Entertainment", icon: <SparklesIcon className="h-5 w-5" />, count: 27 },
            { id: "productivity", name: "Productivity", icon: <Zap className="h-5 w-5" />, count: 45 },
            { id: "customer-service", name: "Customer Service", icon: <MessageCircle className="h-5 w-5" />, count: 19 },
            { id: "healthcare", name: "Healthcare", icon: <Users className="h-5 w-5" />, count: 23 },
            { id: "research", name: "Research", icon: <BrainCircuit className="h-5 w-5" />, count: 34 },
          ].map((useCase) => (
            <Link
              key={useCase.id}
              href={`/use-cases/${useCase.id}`}
              className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {useCase.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{useCase.name}</h3>
                <p className="text-xs text-gray-500">{useCase.count} tools</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Category Request Section */}
      <div className="rounded-xl bg-gray-50 p-8 border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Can't find what you're looking for?</h2>
            <p className="mt-2 text-gray-600">We're constantly adding new AI tools and categories. Let us know if you have a suggestion!</p>
          </div>
          <Button asChild className="rounded-md">
            <Link href="/contact">
              Submit Category Suggestion
            </Link>
          </Button>
        </div>
      </div>
      
      {/* About Section */}
      <div className="mt-16 text-sm text-gray-500">
        <h3 className="font-medium mb-2">About AI Categories</h3>
        <p>
          The AI landscape is constantly evolving, with new tools and capabilities emerging regularly. Our categorization system aims to organize the growing ecosystem of AI tools into intuitive groups based on their primary functions and use cases.
        </p>
        <p className="mt-2">
          AI Characters focus on personality-driven interactions, AI Chat tools emphasize conversational intelligence, and AI Tools provide specialized functions for specific tasks. Many modern AI solutions blend these categories, offering comprehensive capabilities across multiple domains.
        </p>
      </div>
    </div>
  );
} 