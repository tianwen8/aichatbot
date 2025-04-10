import { Metadata } from "next";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { ArrowLeft, ArrowUp, ArrowDown, Star, Users, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FallbackImage from "@/components/ui/fallback-image";
import { getProjectsByRanking } from "@/lib/supabase-db";

export const metadata: Metadata = {
  title: "AI Tools Rankings | AI Character Directory",
  description: "Discover the top-rated AI tools, chatbots, and virtual characters ranked by popularity, ratings, and user growth.",
  keywords: "AI rankings, top AI tools, best AI characters, AI leaderboard, popular AI, AI ratings"
};

type RankingCategory = "all" | "ai-character" | "ai-chat" | "ai-tool";
type SortOption = "popular" | "rating" | "trending";

export default async function RankingsPage({ 
  searchParams
}: { 
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  unstable_noStore();
  
  // Get active category
  const activeCategory = typeof searchParams.category === 'string' 
    ? searchParams.category as RankingCategory
    : 'all';
  
  // Get sorting method
  const sortBy = typeof searchParams.sort === 'string'
    ? searchParams.sort as SortOption
    : 'popular';
  
  // Fetch top projects
  const projects = await getProjectsByRanking(sortBy, activeCategory, 50);
  
  // Category options
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "ai-character", name: "AI Characters" },
    { id: "ai-chat", name: "AI Chat" },
    { id: "ai-tool", name: "AI Tools" }
  ];
  
  // Get category display name
  const categoryName = categories.find(c => c.id === activeCategory)?.name || "All Categories";
  
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
        
        <h1 className="text-3xl font-bold text-gray-900">AI Tools Rankings</h1>
        <p className="mt-2 text-gray-600 max-w-3xl">
          Discover the most popular, highest-rated, and trending AI tools across different categories.
          Our rankings are based on user counts, ratings, and recent growth.
        </p>
      </div>
      
      {/* Tabs and filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <Tabs value={sortBy} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="popular" asChild>
              <Link href={`/rankings?category=${activeCategory}&sort=popular`}>Most Popular</Link>
            </TabsTrigger>
            <TabsTrigger value="rating" asChild>
              <Link href={`/rankings?category=${activeCategory}&sort=rating`}>Highest Rated</Link>
            </TabsTrigger>
            <TabsTrigger value="trending" asChild>
              <Link href={`/rankings?category=${activeCategory}&sort=trending`}>Trending</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-500 mr-1">
            <Filter className="h-4 w-4 inline-block mr-1" />
            Filter by:
          </span>
          {categories.map(category => (
            <Link 
              key={category.id} 
              href={`/rankings?category=${category.id}&sort=${sortBy}`}
              className={`text-sm px-3 py-1 rounded-full ${
                activeCategory === category.id 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Rankings table */}
      <div className="border rounded-lg overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 text-left font-medium text-gray-500">Rank</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500">Tool Name</th>
              <th className="py-3 px-4 text-center font-medium text-gray-500">Rating</th>
              <th className="py-3 px-4 text-center font-medium text-gray-500">Users</th>
              <th className="py-3 px-4 text-center font-medium text-gray-500">Change</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={project.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex justify-center items-center w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-medium">
                    {index + 1}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Link href={`/projects/${project.slug}`} className="flex items-center gap-3 hover:text-primary">
                    {project.logo && (
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-white border">
                        <FallbackImage 
                          src={project.logo} 
                          alt={project.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {project.category === "ai-character" ? "AI Character" : 
                         project.category === "ai-chat" ? "AI Chat" : 
                         project.category === "ai-tool" ? "AI Tool" : "Other"}
                        {project.updated_at && ` • Updated ${new Date(project.updated_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                    <span className="font-medium">{project.rating?.toFixed(1) || "N/A"}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="font-medium">
                      {project.user_count 
                        ? project.user_count >= 1000000 
                          ? `${(project.user_count / 1000000).toFixed(1)}M`
                          : project.user_count >= 1000
                            ? `${(project.user_count / 1000).toFixed(1)}K`
                            : project.user_count
                        : "N/A"}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  {project.rank_change ? (
                    <div className={`flex items-center justify-center ${
                      project.rank_change > 0 
                        ? "text-green-600" 
                        : project.rank_change < 0 
                          ? "text-red-600" 
                          : "text-gray-500"
                    }`}>
                      {project.rank_change > 0 ? (
                        <>
                          <ArrowUp className="h-4 w-4 mr-1" />
                          <span>+{project.rank_change}</span>
                        </>
                      ) : project.rank_change < 0 ? (
                        <>
                          <ArrowDown className="h-4 w-4 mr-1" />
                          <span>{Math.abs(project.rank_change)}</span>
                        </>
                      ) : (
                        <span>–</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">–</span>
                  )}
                </td>
              </tr>
            ))}
            
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <p className="text-lg font-medium text-gray-900 mb-1">No rankings available</p>
                  <p className="text-gray-500">We couldn't find any projects matching your criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">About Our Rankings</h2>
        <p className="text-gray-700 mb-4">
          These rankings are updated weekly based on actual usage data, user ratings, and growth trends.
          Our ranking algorithm considers multiple factors to provide an accurate representation of each tool's popularity and quality.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded border border-blue-100">
            <h3 className="font-medium text-gray-900 mb-1">Most Popular</h3>
            <p className="text-sm text-gray-600">Ranked by total user count and overall engagement metrics</p>
          </div>
          <div className="bg-white p-4 rounded border border-blue-100">
            <h3 className="font-medium text-gray-900 mb-1">Highest Rated</h3>
            <p className="text-sm text-gray-600">Sorted by average user ratings and review quality</p>
          </div>
          <div className="bg-white p-4 rounded border border-blue-100">
            <h3 className="font-medium text-gray-900 mb-1">Trending</h3>
            <p className="text-sm text-gray-600">Based on recent growth and increasing popularity</p>
          </div>
        </div>
      </div>
      
      {/* Submission CTA */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Have an AI tool that should be on this list?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Submit your AI tool, chatbot, or character to our directory and let users discover your creation.
        </p>
        <Button asChild size="lg">
          <Link href="/submit">
            Submit Your Tool
          </Link>
        </Button>
      </div>
    </div>
  );
} 