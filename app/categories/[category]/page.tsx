import { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPage from "@/components/category-page";
import { getProjectsByCategory } from "@/lib/supabase-db";

type Props = {
  params: {
    category: string;
  };
};

// 构建分类映射，用于更友好的显示名称
const categoryDisplayNames: Record<string, string> = {
  'ai-character': 'AI Characters',
  'ai-characters': 'AI Characters',
  'ai-chat': 'AI Chat Tools',
  'ai-tool': 'AI Tools',
  'ai-tools': 'AI Tools',
};

// 生成页面元数据
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { category } = params;
  
  // 获取显示名称
  const displayName = categoryDisplayNames[category] || category;
  
  // 根据类别构建描述
  let description = '';
  if (category.includes('character')) {
    description = `Discover the best AI characters for roleplay, companionship, and entertainment. Browse our curated list of top AI character bots.`;
  } else if (category.includes('chat')) {
    description = `Explore the most advanced AI chat tools and conversational assistants. Find the perfect AI chat companion for your needs.`;
  } else if (category.includes('tool')) {
    description = `Browse cutting-edge AI tools and utilities that enhance productivity and creativity. Discover AI-powered solutions for various tasks.`;
  } else {
    description = `Explore the best ${displayName} in our AI directory. Discover top-rated AI solutions and tools.`;
  }
  
  return {
    title: `${displayName} | AI Character Directory`,
    description,
    keywords: `${displayName}, AI character, virtual assistant, chatbot, AI tools, AI directory, ${category.replace(/-/g, ' ')}`,
    openGraph: {
      title: `${displayName} - AI Character Directory`,
      description,
      url: `https://aichatbot-tianwen8.vercel.app/categories/${category}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} - AI Character Directory`,
      description,
    },
  };
}

export default async function CategoryPageWrapper({ params }: Props) {
  const { category } = params;
  
  // 从数据库获取项目
  const projects = await getProjectsByCategory(category);
  
  // 如果没有项目，返回404页面
  if (!projects || projects.length === 0) {
    return notFound();
  }
  
  // 构建结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryDisplayNames[category] || category} - AI Character Directory`,
    "description": `Browse our collection of ${categoryDisplayNames[category] || category}`,
    "url": `https://aichatbot-tianwen8.vercel.app/categories/${category}`,
    "numberOfItems": projects.length,
    "itemListElement": projects.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": project.name,
        "description": project.description,
        "url": `https://aichatbot-tianwen8.vercel.app/projects/${project.slug}`,
        "image": project.logo || 'https://aichatbot-tianwen8.vercel.app/og-image.jpg'
      }
    }))
  };

  return (
    <>
      {/* 注入结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 渲染类别页面组件 */}
      <CategoryPage category={category} projects={projects} />
    </>
  );
} 