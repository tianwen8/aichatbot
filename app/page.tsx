import type { Metadata } from "next";
import { unstable_noStore } from "next/cache"; // 禁用服务端缓存
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Star, Users, Clock, SparklesIcon, Filter, TrendingUp, Grid3X3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/projects/project-card";
import FallbackImage from "@/components/ui/fallback-image";
import { getFeaturedProjects, getVerifiedProjects } from "@/lib/supabase-db";

type Props = {
  params: { [key: string]: string | string[] | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return {
    title: "AI Character Directory - Find the Best AI Characters, Chat Bots & Tools",
    description: "Discover and chat with the best AI characters, virtual companions, and roleplay bots. Your gateway to meaningful AI conversations.",
    keywords: "AI chat, virtual assistants, AI characters, chatbots, AI companions, roleplay, AI tools"
  };
}

export default async function Home({ params, searchParams }: Props) {
  // 禁用服务端缓存，确保每次请求都获取最新数据
  unstable_noStore();
  
  console.log("Rendering homepage, fetching latest data");
  const startTime = Date.now();
  
  // 获取已验证的项目
  const verifiedProjects = await getVerifiedProjects(6);
  const verifiedTime = Date.now();
  console.log(`Verified projects fetched in ${verifiedTime - startTime}ms`);
  
  // 获取不同分类的精选项目
  const charactersProjects = await getVerifiedProjects(3, "ai-character");
  const chatProjects = await getVerifiedProjects(3, "ai-chat");
  const toolsProjects = await getVerifiedProjects(3, "ai-tool");
  
  // 获取精选项目
  const featuredProjects = await getFeaturedProjects([], "ai-character");
  const featuredTime = Date.now();
  console.log(`Featured projects fetched in ${featuredTime - verifiedTime}ms`);
  
  // Statistics
  const stats = {
    toolCount: verifiedProjects.length,
    categoryCount: 23,
    monthlyVisits: "1.2M",
    avgRating: 4.7,
  };
  
  console.log(`Homepage data loading completed in ${Date.now() - startTime}ms`);

  return (
    <div>
      {/* Hero Section - 更现代化的设计 */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[hsl(var(--background))] to-white">
        <div className="container-modern">
          <div className="text-center">
            <Badge className="mb-4 badge-modern badge-primary-modern px-4 py-1.5 text-sm">
              <SparklesIcon className="h-3.5 w-3.5 mr-1" />
              Discover the Best AI Characters & Tools
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find Your Favorite
              <br />
              <span className="heading-gradient">
                AI Characters
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Discover the best AI characters, chat tools and virtual companions
              <br />
              all in one place.
            </p>
            
            {/* Main Search Box - 更精致的设计 */}
            <div className="mx-auto mt-10 max-w-2xl">
              <form action="/search" method="GET" className="relative">
                <div className="relative shadow-soft rounded-full overflow-hidden">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    name="q"
                    placeholder="Search AI characters, roleplay bots, virtual companions..."
                    className="input-modern pl-12 pr-36 py-6 text-lg rounded-full border-0 shadow-none"
                    autoComplete="off"
                  />
                  <Button 
                    type="submit"
                    className="btn-modern btn-primary-modern absolute right-2 top-1/2 -translate-y-1/2"
                    size="lg"
                  >
                    Search
                  </Button>
                </div>
              </form>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                Popular:
                <Link href="/search?q=historical+figures" className="text-[hsl(var(--primary-hue),var(--primary-saturation),50%)] hover:text-[hsl(var(--primary-hue),var(--primary-saturation),40%)] transition-colors">Historical figures</Link> ·
                <Link href="/search?q=virtual+companions" className="text-[hsl(var(--primary-hue),var(--primary-saturation),50%)] hover:text-[hsl(var(--primary-hue),var(--primary-saturation),40%)] transition-colors">Virtual companions</Link> ·
                <Link href="/search?q=anime+characters" className="text-[hsl(var(--primary-hue),var(--primary-saturation),50%)] hover:text-[hsl(var(--primary-hue),var(--primary-saturation),40%)] transition-colors">Anime characters</Link> ·
                <Link href="/search?q=ai+experts" className="text-[hsl(var(--primary-hue),var(--primary-saturation),50%)] hover:text-[hsl(var(--primary-hue),var(--primary-saturation),40%)] transition-colors">AI experts</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured AI Characters */}
      <section className="py-16 bg-[hsl(var(--background))]">
        <div className="container-modern">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="mb-2 badge-modern badge-secondary-modern">
                <SparklesIcon className="h-3 w-3 mr-1" />
                Featured Selection
              </Badge>
              <h2 className="heading-modern text-2xl md:text-3xl">Featured AI Characters</h2>
              <p className="mt-2 text-gray-600">Discover our handpicked selection of the most engaging AI characters</p>
            </div>
            <Link
              href="/featured"
              className="flex items-center text-sm font-medium text-[hsl(var(--primary-hue),var(--primary-saturation),50%)] hover:text-[hsl(var(--primary-hue),var(--primary-saturation),40%)] transition-colors"
            >
              View all featured
              <ArrowRight className="ml-1 inline-block h-4 w-4" />
            </Link>
          </div>

          <div className="grid-modern grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.slug}
                {...project}
                gradient="from-[hsl(var(--primary-hue),var(--primary-saturation),95%)] to-[hsl(var(--secondary-hue),var(--secondary-saturation),95%)]"
                featured={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - 移到这个位置 */}
      <section className="py-16 bg-white">
        <div className="container-modern">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-modern text-2xl md:text-3xl">Browse by Category</h2>
            <Link
              href="/categories"
              className="flex items-center text-sm font-medium text-[hsl(var(--primary-hue),var(--primary-saturation),50%)] hover:text-[hsl(var(--primary-hue),var(--primary-saturation),40%)] transition-colors"
            >
              View all categories
              <ArrowRight className="ml-1 inline-block h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid-modern grid-cols-1 lg:grid-cols-3">
            {/* AI Characters Card */}
            <div className="card">
              <div className="bg-[hsl(var(--primary-hue),var(--primary-saturation),98%)] p-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary-hue),var(--primary-saturation),90%)] text-[hsl(var(--primary-hue),var(--primary-saturation),50%)]">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Characters</h3>
                    <p className="text-sm text-gray-500">Chat with AI personalities</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {charactersProjects.length > 0 ? (
                  <div className="space-y-4">
                    {charactersProjects.map((project) => (
                      <Link 
                        key={project.slug} 
                        href={`/projects/${project.slug}`}
                        className="block group hover:bg-gray-50 p-2 rounded-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          {project.logo && (
                            <FallbackImage 
                              src={project.logo} 
                              alt={project.name} 
                              className="w-10 h-10 rounded-full object-cover" 
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate group-hover:text-[hsl(var(--primary-hue),var(--primary-saturation),50%)]">{project.name}</p>
                            <p className="text-sm text-gray-500 truncate">{project.description.substring(0, 40)}...</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No AI characters available</p>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t">
                <Link 
                  href="/categories/ai-characters"
                  className="text-sm font-medium text-[hsl(var(--primary-hue),var(--primary-saturation),50%)] hover:text-[hsl(var(--primary-hue),var(--primary-saturation),40%)] flex items-center justify-center transition-colors"
                >
                  View all AI Characters
                  <ChevronRight className="ml-1 inline-block h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* AI Chat Card */}
            <div className="card">
              <div className="bg-[hsl(var(--secondary-hue),var(--secondary-saturation),98%)] p-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--secondary-hue),var(--secondary-saturation),90%)] text-[hsl(var(--secondary-hue),var(--secondary-saturation),50%)]">
                    <SparklesIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Chat</h3>
                    <p className="text-sm text-gray-500">Powerful conversation models</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {chatProjects.length > 0 ? (
                  <div className="space-y-4">
                    {chatProjects.map((project) => (
                      <Link 
                        key={project.slug} 
                        href={`/projects/${project.slug}`}
                        className="block group hover:bg-gray-50 p-2 rounded-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          {project.logo && (
                            <FallbackImage 
                              src={project.logo} 
                              alt={project.name} 
                              className="w-10 h-10 rounded-full object-cover" 
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate group-hover:text-[hsl(var(--secondary-hue),var(--secondary-saturation),50%)]">{project.name}</p>
                            <p className="text-sm text-gray-500 truncate">{project.description.substring(0, 40)}...</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No AI chat tools available</p>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t">
                <Link 
                  href="/categories/ai-chat"
                  className="text-sm font-medium text-[hsl(var(--secondary-hue),var(--secondary-saturation),50%)] hover:text-[hsl(var(--secondary-hue),var(--secondary-saturation),40%)] flex items-center justify-center transition-colors"
                >
                  View all AI Chat Tools
                  <ChevronRight className="ml-1 inline-block h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* AI Tools Card */}
            <div className="card">
              <div className="bg-[hsl(var(--accent-hue),var(--accent-saturation),98%)] p-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent-hue),var(--accent-saturation),90%)] text-[hsl(var(--accent-hue),var(--accent-saturation),50%)]">
                    <Grid3X3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Tools</h3>
                    <p className="text-sm text-gray-500">Productivity enhancers</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {toolsProjects.length > 0 ? (
                  <div className="space-y-4">
                    {toolsProjects.map((project) => (
                      <Link 
                        key={project.slug} 
                        href={`/projects/${project.slug}`}
                        className="block group hover:bg-gray-50 p-2 rounded-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          {project.logo && (
                            <FallbackImage 
                              src={project.logo} 
                              alt={project.name} 
                              className="w-10 h-10 rounded-full object-cover" 
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate group-hover:text-[hsl(var(--accent-hue),var(--accent-saturation),50%)]">{project.name}</p>
                            <p className="text-sm text-gray-500 truncate">{project.description.substring(0, 40)}...</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No AI tools available</p>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t">
                <Link 
                  href="/categories/ai-tools"
                  className="text-sm font-medium text-[hsl(var(--accent-hue),var(--accent-saturation),50%)] hover:text-[hsl(var(--accent-hue),var(--accent-saturation),40%)] flex items-center justify-center transition-colors"
                >
                  View all AI Tools
                  <ChevronRight className="ml-1 inline-block h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All AI Characters */}
      <section className="py-16 bg-[hsl(var(--background))]">
        <div className="container-modern">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-modern text-2xl md:text-3xl">Latest Submissions</h2>
              <p className="mt-2 text-gray-600">See what's new in our AI directory</p>
            </div>
            <div className="flex items-center gap-2">
              <Tabs defaultValue="latest">
                <TabsList className="bg-white shadow-sm">
                  <TabsTrigger value="latest" className="text-xs">Latest</TabsTrigger>
                  <TabsTrigger value="popular" className="text-xs">Popular</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid-modern grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {verifiedProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                {...project}
                gradient="from-[hsl(var(--accent-hue),var(--accent-saturation),95%)] to-white"
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="btn-modern btn-primary-modern px-8" size="lg">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[hsl(var(--primary-hue),var(--primary-saturation),95%)] via-white to-[hsl(var(--secondary-hue),var(--secondary-saturation),95%)]">
        <div className="container-modern">
          <div className="relative overflow-hidden bg-gradient-to-r from-[hsl(var(--primary-hue),var(--primary-saturation),30%)] to-[hsl(var(--secondary-hue),var(--secondary-saturation),30%)] px-6 py-24 text-center shadow-soft rounded-2xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Have an AI Character to Share?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90">
              Submit your AI character or chat tool to our directory and reach thousands of users
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Button asChild size="lg" className="btn-modern btn-primary-modern bg-white hover:bg-white/90 text-[hsl(var(--primary-hue),var(--primary-saturation),40%)] hover:text-[hsl(var(--primary-hue),var(--primary-saturation),30%)]">
                <Link href="/submit">Submit Character</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="btn-modern border-white text-white hover:bg-white/10">
                <Link href="/about">Learn More</Link>
              </Button>
      </div>

            {/* 装饰背景元素 */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container-modern">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-[hsl(var(--primary-hue),var(--primary-saturation),50%)]">{stats.toolCount}+</p>
              <p className="text-gray-500 mt-2">AI Tools</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[hsl(var(--secondary-hue),var(--secondary-saturation),50%)]">{stats.monthlyVisits}</p>
              <p className="text-gray-500 mt-2">Monthly Visits</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[hsl(var(--accent-hue),var(--accent-saturation),50%)]">{stats.categoryCount}</p>
              <p className="text-gray-500 mt-2">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[hsl(calc(var(--primary-hue) + 120),var(--primary-saturation),50%)]">{stats.avgRating}</p>
              <p className="text-gray-500 mt-2">Avg. Rating</p>
            </div>
          </div>
        </div>
      </section>
      </div>
  );
}
