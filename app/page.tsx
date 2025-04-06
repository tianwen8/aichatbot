import { Metadata } from "next";
import Link from "next/link";
import { getVerifiedProjects } from "@/lib/supabase-db";
import ProjectCard from "@/components/projects/project-card";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata: Metadata = {
  title: "AI角色聊天导航 | 发现最佳AI聊天工具",
  description: "发现并探索最流行的AI角色扮演、聊天和虚拟伴侣应用。从Character.AI到Claude，找到最适合你的AI聊天工具。",
  keywords: "AI聊天, 角色扮演, 虚拟伴侣, AI助手, 语言模型, ChatGPT, Character AI, Claude, AI导航, AI工具",
  openGraph: {
    title: "AI角色聊天导航 | 发现最佳AI聊天工具",
    description: "发现并探索最流行的AI角色扮演、聊天和虚拟伴侣应用。从Character.AI到Claude，找到最适合你的AI聊天工具。",
    url: "https://aichatbot.directory",
  }
};

export default async function Home() {
  // 获取已验证的项目
  const projects = await getVerifiedProjects(12);
  const trendingProjects = [...projects]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 4);
  
  // 热门分类
  const categories = [
    { name: "角色扮演", slug: "roleplay", count: 24 },
    { name: "知识问答", slug: "qa", count: 18 },
    { name: "AI伴侣", slug: "companion", count: 15 },
    { name: "语言模型", slug: "llm", count: 12 },
    { name: "写作助手", slug: "writing", count: 10 },
    { name: "多语言", slug: "multilingual", count: 8 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      {/* Hero Section */}
      <div className="py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block text-blue-600">AI角色聊天</span>
          <span className="block mt-2">导航目录</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-gray-500 sm:max-w-3xl">
          发现并探索最流行的AI角色扮演、聊天和虚拟伴侣应用。从Character.AI到Claude，找到最适合你的AI聊天工具。
        </p>
        
        {/* Search Bar */}
        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pl-10 py-3 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              placeholder="搜索AI聊天工具、角色扮演助手..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-gray-500">⌘K</span>
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              href={`/category/${category.slug}`}
              className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-800 hover:bg-blue-100"
            >
              {category.name}
              <span className="ml-1.5 text-xs text-blue-600/70">({category.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 shadow-xl sm:px-12 sm:py-12">
        <div className="relative lg:flex lg:items-center lg:gap-x-12 lg:justify-between">
          <div className="text-center lg:text-left">
            <h2 className="text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
              想要添加您的AI聊天工具？
            </h2>
            <p className="mt-2 text-white/80">
              免费提交您的AI工具、角色扮演或聊天平台，让更多用户发现它！
            </p>
            <div className="mt-6">
              <Link
                href="/submit"
                className="inline-flex items-center rounded-md border border-transparent bg-white px-5 py-2.5 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
              >
                立即提交
              </Link>
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0 lg:flex-shrink-0">
            <div className="h-48 w-48 rounded-full bg-white/10 p-2 lg:h-56 lg:w-56">
              <div className="h-full w-full rounded-full bg-white/80 p-2">
                <div className="h-full w-full rounded-full bg-indigo-600 flex items-center justify-center">
                  <svg className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">精选AI聊天工具</h2>
          <Link href="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            查看全部
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.slice(0, 8).map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>

      {/* Trending Projects */}
      <div className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">本周热门</h2>
            <Badge className="ml-3 bg-red-100 text-red-800 hover:bg-red-200">热门</Badge>
          </div>
          <Link href="/trending" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            更多热门
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          探索AI聊天的无限可能
        </h2>
        <div className="mt-4 grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-gray-600">
              人工智能聊天工具正在彻底改变我们与技术互动的方式。从像Character.AI这样的角色扮演平台到ChatGPT这样的知识助手，AI聊天工具正在为用户提供前所未有的体验。
            </p>
            <p className="mt-3 text-gray-600">
              在我们的导航网站上，您可以发现各种各样的AI聊天工具，包括：
            </p>
            <ul className="mt-3 space-y-1 text-gray-600">
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">•</span>
                角色扮演AI - 与虚构角色交流的平台
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">•</span>
                知识问答助手 - 帮助您解答疑问的AI工具
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">•</span>
                AI伴侣 - 提供情感支持和陪伴的虚拟角色
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">•</span>
                创意写作助手 - 帮助您创作内容和故事
              </li>
            </ul>
          </div>
          <div>
            <p className="text-gray-600">
              随着人工智能技术的快速发展，新的AI聊天工具不断涌现。我们的目标是提供一个全面的导航平台，帮助用户发现最适合自己需求的AI聊天工具。
            </p>
            <p className="mt-3 text-gray-600">
              无论您是想要找一个有趣的AI角色聊天，还是需要一个专业的AI助手帮助工作，我们都能帮您找到最合适的工具。
            </p>
            <div className="mt-5">
              <Button asChild size="lg">
                <Link href="/submit">
                  提交您的AI聊天工具
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
