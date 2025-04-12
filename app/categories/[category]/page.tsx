import { Suspense } from "react";
import ProjectGrid from "@/components/projects/project-grid";
import { getProjectsByCategory } from "@/lib/supabase-db";
import { SearchBarPlaceholder } from "@/components/ui/search-bar";
import SearchBar from "@/components/ui/search-bar";

// Category mapping and SEO descriptions
const categoryMap = {
  roleplay: {
    title: "AI Roleplay | AI Character Chat Directory",
    description: "Explore the best AI roleplay applications and tools for interacting with historical figures, fictional characters, and more. Find AI chat tools that simulate various roles.",
    heading: "AI Roleplay",
    subheading: "AI tools for conversations with historical figures, fictional characters, and experts"
  },
  companions: {
    title: "AI Virtual Companions | AI Character Chat Directory",
    description: "Discover the best AI virtual companion applications offering emotional support, daily conversations, and personalized interactions. Find AI chat partners for companionship, listening, and communication.",
    heading: "AI Virtual Companions",
    subheading: "Artificial intelligence applications providing emotional support, companionship, and conversation"
  },
  platforms: {
    title: "AI Chat Platforms | AI Character Chat Directory",
    description: "Explore mainstream AI chat platforms like ChatGPT, Character.ai, and Claude. Find powerful AI dialogue systems supporting various characters and use cases.",
    heading: "AI Chat Platforms",
    subheading: "Mainstream artificial intelligence dialogue systems and comprehensive chat platforms"
  },
  tools: {
    title: "AI Chat Tools | AI Character Chat Directory",
    description: "Discover innovative AI chat tools and utilities to enhance your chat experience. Find chatbot builders, conversation enhancement tools, and specialized AI assistants.",
    heading: "AI Chat Tools",
    subheading: "Practical chatbots, conversation tools, and specialized AI assistants"
  }
};

// Dynamically generate metadata
export function generateMetadata({ params }) {
  const category = params.category;
  const categoryInfo = categoryMap[category] || {
    title: "AI Character Chat Directory",
    description: "Explore the best AI character chat tools, platforms, and resources for all your AI conversation needs."
  };

  return {
    title: categoryInfo.title,
    description: categoryInfo.description,
  };
}

export default async function CategoryPage({ params }) {
  const category = params.category;
  const categoryInfo = categoryMap[category] || {
    heading: "AI Chat Category",
    subheading: "Explore AI chat tools and platforms"
  };

  // Get projects for this category
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
            {categoryInfo.heading} Resources
          </h2>
          <ProjectGrid projects={projects} />
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700">No Content Yet</h2>
          <p className="mt-2 text-gray-500">There are no resources in this category yet. Please check back later!</p>
          <a 
            href="/submit" 
            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Submit a Resource
          </a>
        </div>
      )}

      {/* SEO Rich Text */}
      <div className="mt-16 text-sm text-gray-500">
        <h3 className="font-medium mb-2">About {categoryInfo.heading}</h3>
        <p>
          {category === 'roleplay' && 'AI roleplay chat is a technology that allows users to converse with AI that simulates historical figures, fictional characters, celebrities, or experts. These applications use powerful language models and character settings to create immersive communication experiences. Users can discuss relativity with Einstein, solve mysteries with Sherlock Holmes, or interact with various virtual characters.'}
          {category === 'companions' && 'AI virtual companions are artificial intelligence applications designed to provide emotional support, companionship, and daily conversation. These chatbots typically have personalized features that remember user preferences, habits, and conversation history to create more natural and personalized interactions. Virtual companions can help alleviate feelings of loneliness, provide emotional support, and offer interesting conversations in everyday life.'}
          {category === 'platforms' && 'AI chat platforms are comprehensive systems that provide infrastructure and tools for creating, deploying, and managing AI chat experiences. These platforms typically include pre-trained language models, custom character creation tools, community features, and development APIs. Mainstream platforms like ChatGPT, Character.ai, and Claude offer various features to meet needs ranging from casual conversation to professional applications.'}
          {category === 'tools' && 'AI chat tools are applications and utilities designed for specific chat-related tasks. These tools may include chatbot builders, conversation enhancement tools, content generation assistants, and specialized domain assistants. They typically focus on solving specific problems or improving productivity in specific areas such as writing, learning, creative thinking, or professional consultation.'}
        </p>
        <p className="mt-2">
          In our AI Character Chat Directory, you can find the highest quality {categoryInfo.heading} tools and platforms to help you find the AI chat experience that best suits your needs.
        </p>
      </div>
    </div>
  );
} 