import { Metadata } from "next";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { ArrowLeft, Search, Filter, ShieldCheck, Users, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/projects/project-card";
import { searchProjects } from "@/lib/supabase-db";

export const metadata: Metadata = {
  title: "Search AI Characters & Tools | AI Character Directory",
  description: "Search for AI characters, chat tools, virtual companions, and specialized AI utilities in our comprehensive directory.",
  keywords: "search AI tools, find AI characters, AI search, chatbot search, AI directory search"
};

export default async function SearchPage({ 
  searchParams
}: { 
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  unstable_noStore();
  
  // Get search query
  const query = typeof searchParams.q === 'string' 
    ? searchParams.q 
    : '';
  
  // Get category filter
  const categoryFilter = typeof searchParams.category === 'string'
    ? searchParams.category
    : 'all';
  
  // Get sort option
  const sortBy = typeof searchParams.sort === 'string'
    ? searchParams.sort
    : 'relevance';
  
  // Fetch search results if query exists
  const results = query.length > 0 
    ? await searchProjects(query, categoryFilter, sortBy)
    : [];
  
  // 如果搜索结果为空且查询词不为空，添加一些调试日志
  if (query.length > 0 && results.length === 0) {
    console.log(`搜索页面: 查询"${query}"没有返回结果`);
    console.log('分类过滤:', categoryFilter);
    console.log('排序方式:', sortBy);
  }
  
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
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search AI Characters & Tools</h1>
        
        {/* Search Box */}
        <div className="relative max-w-3xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <form action="/search" method="GET">
            <Input
              type="search"
              name="q"
              placeholder="Search by name, description, or features..."
              className="pl-12 pr-20 py-6 text-lg"
              defaultValue={query}
              autoComplete="off"
            />
            <input type="hidden" name="category" value={categoryFilter} />
            <input type="hidden" name="sort" value={sortBy} />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              Search
            </Button>
          </form>
        </div>
      </div>
      
      {query.length > 0 ? (
        <>
          {/* Results Stats */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {results.length > 0 
                ? `Found ${results.length} results for "${query}"`
                : `No results found for "${query}"`
              }
            </p>
            
            {/* Filter and Sort */}
            <div className="flex gap-2">
              <Tabs value={categoryFilter} className="w-auto">
                <TabsList>
                  {categories.map(cat => (
                    <TabsTrigger key={cat.id} value={cat.id} asChild>
                      <Link href={`/search?q=${encodeURIComponent(query)}&category=${cat.id}&sort=${sortBy}`}>
                        {cat.name}
                      </Link>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              <Tabs value={sortBy} className="w-auto">
                <TabsList>
                  <TabsTrigger value="relevance" asChild>
                    <Link href={`/search?q=${encodeURIComponent(query)}&category=${categoryFilter}&sort=relevance`}>
                      Relevance
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="popular" asChild>
                    <Link href={`/search?q=${encodeURIComponent(query)}&category=${categoryFilter}&sort=popular`}>
                      Popular
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="newest" asChild>
                    <Link href={`/search?q=${encodeURIComponent(query)}&category=${categoryFilter}&sort=newest`}>
                      Newest
                    </Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Search Results */}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
              {results.map((project) => (
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
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg border mb-12">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                We couldn't find any AI tools or characters matching "{query}". 
                Try using different keywords or removing filters.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="outline">
                  <Link href="/search">Clear Search</Link>
                </Button>
                <Button asChild>
                  <Link href="/categories">Browse Categories</Link>
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty search state */
        <div className="text-center py-16 bg-gray-50 rounded-lg border">
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">
            Enter a search term to find AI characters, chat tools, or specialized utilities
            in our comprehensive directory.
          </p>
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <h4 className="font-medium text-gray-700">Popular searches:</h4>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/search?q=virtual companion">Virtual Companion</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/search?q=historical figure">Historical Figure</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/search?q=coding assistant">Coding Assistant</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/search?q=writing helper">Writing Helper</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/search?q=language model">Language Model</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Tips */}
      <div className="rounded-xl border p-6 bg-white mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <Users className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Find characters</h3>
              <p className="text-sm text-gray-600">Search by character name, type, or personality traits</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Filter className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Use filters</h3>
              <p className="text-sm text-gray-600">Narrow down by category, features, or rating</p>
            </div>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Verified tools</h3>
              <p className="text-sm text-gray-600">Look for verified badge for trusted AI tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 