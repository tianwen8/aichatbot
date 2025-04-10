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
  title: "AI 工具 | AI 目录",
  description: "发现实用的 AI 工具，包括内容生成、图像处理、数据分析和更多专业应用。",
  keywords: "AI 工具, 人工智能应用, AI 软件, 内容生成, AI 工作流程, 生产力工具, 数据分析"
};

// Sub-categories for AI Tools
const subCategories = [
  { id: "all", name: "所有工具", description: "浏览各种功能和用途的 AI 工具" },
  { id: "content", name: "内容创建", description: "用于生成文本、图像和多媒体内容的 AI 工具" },
  { id: "productivity", name: "生产力", description: "提高工作效率和简化任务的 AI 助手" },
  { id: "data", name: "数据分析", description: "用于分析和可视化数据的 AI 工具" },
  { id: "coding", name: "编程辅助", description: "帮助编写和优化代码的 AI 工具" },
  { id: "workflow", name: "工作流程", description: "集成到现有工作流程的 AI 自动化工具" },
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
          返回分类
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 text-sm">
              <Wrench className="h-3.5 w-3.5 mr-1" />
              AI 工具
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">AI 工具与应用</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              探索增强生产力、创造力和解决问题能力的实用 AI 工具。从内容创建到数据分析，发现适合您需求的解决方案。
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
            {subCategories.find(c => c.id === activeCategory)?.name || "所有工具"}
          </h2>
          <p className="text-sm text-gray-500">
            {subCategories.find(c => c.id === activeCategory)?.description || "浏览各种功能和用途的 AI 工具"}
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
                <Link href={`/categories/ai-tools?subcategory=${activeCategory}&sort=popular`}>热门</Link>
              </TabsTrigger>
              <TabsTrigger value="latest" asChild>
                <Link href={`/categories/ai-tools?subcategory=${activeCategory}&sort=latest`}>最新</Link>
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
            <h3 className="text-lg font-medium text-gray-900 mb-1">未找到工具</h3>
            <p className="text-gray-500 mb-4">我们找不到符合您条件的 AI 工具</p>
            <Button asChild variant="outline">
              <Link href="/categories/ai-tools">查看所有工具</Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Call to action */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">有 AI 工具要分享？</h2>
            <p className="mt-2 text-gray-600">
              将您的 AI 工具提交到我们的目录，接触成千上万的潜在用户。
            </p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/submit">
              提交您的工具
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 