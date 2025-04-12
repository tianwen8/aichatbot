import { Suspense } from "react";
import ProjectGrid from "@/components/projects/project-grid";
import { SearchBarPlaceholder } from "@/components/ui/search-bar";
import SearchBar from "@/components/ui/search-bar";
import Link from "next/link";

// 分类映射，用于更友好的显示名称和描述
const categoryDisplayNames: Record<string, string> = {
  'ai-character': 'AI Characters & Companions',
  'ai-characters': 'AI Characters & Companions',
  'ai-chat': 'AI Chat Platforms',
  'ai-tool': 'AI Tools',
  'ai-tools': 'AI Tools',
};

// 分类详细信息
const categoryInfo: Record<string, { heading: string; subheading: string; description: string }> = {
  'ai-character': {
    heading: 'AI Characters & Companions',
    subheading: 'Virtual Girlfriends, Boyfriends & AI Relationships',
    description: 'AI characters and companions offer intimate, personalized interaction through artificial intelligence. These virtual partners can simulate romantic relationships, provide emotional support, and engage in meaningful conversations. Modern AI companions feature customizable personalities, conversation memory, voice interactions, and sometimes even image generation capabilities, creating increasingly realistic digital relationships for users seeking companionship or connection.'
  },
  'ai-characters': {
    heading: 'AI Characters & Companions',
    subheading: 'Virtual Girlfriends, Boyfriends & AI Relationships',
    description: 'AI characters and companions offer intimate, personalized interaction through artificial intelligence. These virtual partners can simulate romantic relationships, provide emotional support, and engage in meaningful conversations. Modern AI companions feature customizable personalities, conversation memory, voice interactions, and sometimes even image generation capabilities, creating increasingly realistic digital relationships for users seeking companionship or connection.'
  },
  'ai-chat': {
    heading: 'AI Chat Platforms',
    subheading: 'Powerful AI Conversation Systems & Relationship Simulators',
    description: 'AI chat platforms provide the foundation for creating and interacting with virtual companions and romantic AI characters. These platforms utilize advanced language models to enable natural, flowing conversations with artificial intelligence. They offer features like personalized responses, emotional understanding, memory of past interactions, and frequently include support for both text and voice communication. Many platforms allow users to create their own AI characters or choose from libraries of pre-designed personalities.'
  },
  'ai-tool': {
    heading: 'AI Companion Tools',
    subheading: 'Enhance Your Virtual Relationship Experience',
    description: 'AI companion tools extend the capabilities of virtual relationships and AI girlfriends with specialized features. These tools enhance the AI companion experience through various functionalities like voice modulation for more realistic conversations, image generation for visual companionship, emotion detection for more empathetic responses, and conversation analytics to improve relationship quality. These supplementary technologies help create deeper, more meaningful connections with AI companions.'
  },
  'ai-tools': {
    heading: 'AI Companion Tools',
    subheading: 'Enhance Your Virtual Relationship Experience',
    description: 'AI companion tools extend the capabilities of virtual relationships and AI girlfriends with specialized features. These tools enhance the AI companion experience through various functionalities like voice modulation for more realistic conversations, image generation for visual companionship, emotion detection for more empathetic responses, and conversation analytics to improve relationship quality. These supplementary technologies help create deeper, more meaningful connections with AI companions.'
  }
};

type CategoryPageProps = {
  category: string;
  projects: any[];
};

export default function CategoryPage({ category, projects }: CategoryPageProps) {
  // 获取当前分类的显示信息
  const info = categoryInfo[category] || {
    heading: categoryDisplayNames[category] || category,
    subheading: `Explore ${categoryDisplayNames[category] || category} and platforms`,
    description: `Find the best ${categoryDisplayNames[category] || category} in our comprehensive AI directory. Browse our curated collection of high-quality AI solutions and tools.`
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">{info.heading}</h1>
        <p className="mt-4 text-lg text-gray-600">
          {info.subheading}
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
            {info.heading} Resources
          </h2>
          <ProjectGrid projects={projects} />
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700">No Content Yet</h2>
          <p className="mt-2 text-gray-500">There are no resources in this category yet. Please check back later!</p>
          <Link 
            href="/submit" 
            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Submit a Resource
          </Link>
        </div>
      )}

      {/* SEO Rich Text */}
      <div className="mt-16 text-sm text-gray-500">
        <h3 className="font-medium mb-2">About {info.heading}</h3>
        <p>{info.description}</p>
        <p className="mt-2">
          In our AI Character Directory, you can find the highest quality {info.heading.toLowerCase()} to help you find the AI experience that best suits your needs.
        </p>
      </div>
    </div>
  );
} 