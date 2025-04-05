import { Suspense } from "react";
import ProjectGrid from "@/components/projects/project-grid";
import { getProjectsByCategory } from "@/lib/supabase-db";
import { SearchBarPlaceholder } from "@/components/ui/search-bar";
import SearchBar from "@/components/ui/search-bar";

// 类别映射表和SEO描述
const categoryMap = {
  roleplay: {
    title: "AI角色扮演 | AI Character Chat Directory",
    description: "探索最佳AI角色扮演应用与工具，体验与历史人物、虚构角色等互动的乐趣。寻找模拟各种角色的AI聊天工具。",
    heading: "AI角色扮演",
    subheading: "与历史人物、虚构角色和专家进行对话的AI工具"
  },
  companions: {
    title: "AI虚拟伴侣 | AI Character Chat Directory",
    description: "发现最佳AI虚拟伴侣应用，提供情感支持、日常对话和个性化互动体验。寻找能够陪伴、倾听和交流的AI聊天伙伴。",
    heading: "AI虚拟伴侣",
    subheading: "提供情感支持、陪伴和对话的人工智能应用"
  },
  platforms: {
    title: "AI聊天平台 | AI Character Chat Directory",
    description: "探索主流AI聊天平台，如ChatGPT、Character.ai和Claude等。寻找功能强大的AI对话系统，支持多种角色和用例。",
    heading: "AI聊天平台",
    subheading: "主流的人工智能对话系统和综合聊天平台"
  },
  tools: {
    title: "AI聊天工具 | AI Character Chat Directory",
    description: "发现创新的AI聊天工具和实用程序，增强您的聊天体验。寻找聊天机器人构建器、对话增强工具和专业AI助手。",
    heading: "AI聊天工具",
    subheading: "实用的聊天机器人、对话工具和专业AI助手"
  }
};

// 动态生成元数据
export function generateMetadata({ params }) {
  const category = params.category;
  const categoryInfo = categoryMap[category] || {
    title: "AI角色聊天导航 | AI Character Chat Directory",
    description: "探索最佳AI角色聊天工具、平台和资源，满足您的所有AI对话需求。"
  };

  return {
    title: categoryInfo.title,
    description: categoryInfo.description,
  };
}

export default async function CategoryPage({ params }) {
  const category = params.category;
  const categoryInfo = categoryMap[category] || {
    heading: "AI聊天分类",
    subheading: "探索AI聊天工具和平台"
  };

  // 获取该类别的项目
  const projects = await getProjectsByCategory(category);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">{categoryInfo.heading}</h1>
        <p className="mt-4 text-lg text-gray-600">
          {categoryInfo.subheading}
        </p>
        <div className="my-10 flex justify-center">
          <Suspense fallback={<SearchBarPlaceholder />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      {projects.length > 0 ? (
        <div>
          <h2 className="mb-6 text-2xl font-bold">
            {categoryInfo.heading}分类下的网站
          </h2>
          <ProjectGrid projects={projects} />
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700">暂无内容</h2>
          <p className="mt-2 text-gray-500">该分类下暂时没有网站。请稍后再来查看！</p>
          <a 
            href="/submit" 
            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            提交网站
          </a>
        </div>
      )}

      {/* SEO富文本 */}
      <div className="mt-16 text-sm text-gray-500">
        <h3 className="font-medium mb-2">关于{categoryInfo.heading}</h3>
        <p>
          {category === 'roleplay' && '人工智能角色扮演聊天是一种允许用户与模拟历史人物、虚构角色、名人或专家的AI进行对话的技术。这些应用利用强大的语言模型和角色设定，创造出沉浸式的交流体验。用户可以与爱因斯坦讨论相对论，与福尔摩斯一起解谜，或与各种虚拟角色互动。'}
          {category === 'companions' && 'AI虚拟伴侣是设计用来提供情感支持、陪伴和日常对话的人工智能应用。这些聊天机器人通常具有个性化的特征，能够记住用户的偏好、习惯和对话历史，从而创造更加自然和个性化的互动体验。虚拟伴侣可以帮助缓解孤独感，提供情感支持，并在日常生活中提供有趣的对话。'}
          {category === 'platforms' && 'AI聊天平台是提供基础设施和工具来创建、部署和管理AI聊天体验的综合性系统。这些平台通常包括预训练的语言模型、自定义角色创建工具、社区功能和开发API。主流平台如ChatGPT、Character.ai和Claude等提供各种功能，满足从休闲对话到专业应用的多种需求。'}
          {category === 'tools' && 'AI聊天工具是专为特定聊天相关任务设计的应用程序和实用程序。这些工具可能包括聊天机器人构建器、对话增强工具、内容生成助手和专业领域助手。它们通常专注于解决特定问题或提高特定领域的生产力，如写作、学习、创意思维或专业咨询。'}
        </p>
        <p className="mt-2">
          在我们的AI角色聊天导航目录中，您可以找到最优质的{categoryInfo.heading}工具和平台，帮助您找到最适合您需求的AI聊天体验。
        </p>
      </div>
    </div>
  );
} 