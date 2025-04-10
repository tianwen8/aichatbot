import { Metadata } from "next";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Filter, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/projects/project-card";
import { getProjectsByCategory } from "@/lib/supabase-db";

export const metadata: Metadata = {
  title: "AI 聊天工具 | AI 目录",
  description: "探索多功能 AI 聊天工具和会话助手。发现为生产力、学习和创造力设计的 AI 聊天应用。",
  keywords: "AI 聊天, AI 会话, 聊天机器人, AI 助手, 对话式 AI, 语言模型, GPT 聊天"
};

// Sub-categories for AI Chat
const subCategories = [
  { id: "all", name: "所有聊天工具", description: "浏览所有 AI 聊天工具和会话助手" },
  { id: "productivity", name: "生产力", description: "提高工作效率和组织能力的 AI 聊天工具" },
  { id: "learning", name: "学习", description: "支持教育和知识获取的 AI 聊天助手" },
  { id: "specialized", name: "专业领域", description: "针对特定领域和行业的 AI 聊天解决方案" },
  { id: "multilingual", name: "多语言", description: "支持多种语言的 AI 聊天工具" },
  { id: "creative", name: "创意", description: "激发创造力和内容创作的 AI 聊天助手" },
];

export default async function AIChatPage({ 
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
  const projects = await getProjectsByCategory("ai-chat", 24);
  
  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/categories"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回分类
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 text-sm">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              AI 聊天
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">AI 聊天工具与助手</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              探索由先进语言模型驱动的智能对话工具。从个人助手到专业解决方案，发现适合各种需求的 AI 聊天应用。
            </p>
          </div>
        </div>
      </div>
      
      {/* Sub-category navigation */}
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
        {subCategories.map((category) => (
          <Link 
            key={category.id}
            href={`/categories/ai-chat?subcategory=${category.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeCategory === category.id
                ? 'bg-blue-100 text-blue-800'
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
            {subCategories.find(c => c.id === activeCategory)?.name || "所有聊天工具"}
          </h2>
          <p className="text-sm text-gray-500">
            {subCategories.find(c => c.id === activeCategory)?.description || "浏览所有 AI 聊天工具和会话助手"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            筛选
          </Button>
          <Tabs value={sortBy} className="w-[180px]">
            <TabsList>
              <TabsTrigger value="popular" asChild>
                <Link href={`/categories/ai-chat?subcategory=${activeCategory}&sort=popular`}>热门</Link>
              </TabsTrigger>
              <TabsTrigger value="latest" asChild>
                <Link href={`/categories/ai-chat?subcategory=${activeCategory}&sort=latest`}>最新</Link>
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
              gradient="from-blue-100 via-cyan-50 to-sky-100"
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">未找到聊天工具</h3>
            <p className="text-gray-500 mb-4">我们找不到符合您条件的 AI 聊天工具</p>
            <Button asChild variant="outline">
              <Link href="/categories/ai-chat">查看所有聊天工具</Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Call to action */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">有 AI 聊天工具要分享？</h2>
            <p className="mt-2 text-gray-600">
              将您的 AI 聊天工具提交到我们的目录，接触成千上万的潜在用户。
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/submit">
              提交您的聊天工具
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 