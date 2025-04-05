import SearchBar, { SearchBarPlaceholder } from "@/components/ui/search-bar";
import ProjectGrid from "@/components/projects/project-grid";
import { getVerifiedProjects } from "@/lib/supabase-db";
import { Suspense } from "react";
import { measureAsync } from "@/lib/performance";

export const metadata = {
  title: "AI Character Chat Directory",
  description: "Discover the best AI character chat websites, tools and resources for AI roleplay, chatbots, and virtual companions including Character.ai, ChatGPT, Claude and more.",
};

export default async function Home() {
  // Add performance measurement
  const startTime = Date.now();
  console.log('HomePage-StartRendering', startTime);

  // Record database request time
  const dbStartTime = Date.now();
  const projects = await getVerifiedProjects(24);
  const dbEndTime = Date.now();
  console.log(`Database request time: ${dbEndTime - dbStartTime}ms`);

  // Ensure projects are sorted by click count
  const sortedProjects = [...projects].sort(
    (a, b) => b.clicks - a.clicks
  );

  const endTime = Date.now();
  console.log(`HomePage-TotalRenderTime: ${endTime - startTime}ms`);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 pb-20 pt-16 sm:pt-24">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          AI Character Chat<br />
          <span className="text-5xl font-extrabold tracking-tight text-black sm:text-6xl">
            Directory
          </span>
        </h1>
        <p className="mt-4 text-lg leading-6 text-gray-500 sm:mt-7">
          Discover the best AI roleplay, chatbots and virtual companion platforms
        </p>
        <div className="my-10 flex justify-center">
          <Suspense fallback={<SearchBarPlaceholder />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
      <div className="w-full">
        <h2 className="mb-6 text-2xl font-bold">Featured AI Chat Platforms</h2>
        <ProjectGrid projects={sortedProjects.slice(0, 6)} />
        
        <h2 className="mb-6 mt-12 text-2xl font-bold">Popular AI Apps This Week</h2>
        <ProjectGrid projects={sortedProjects.slice(6, 12)} />
        
        <h2 className="mb-6 mt-12 text-2xl font-bold">Emerging AI Character Chat Tools</h2>
        <ProjectGrid projects={sortedProjects.slice(12)} />
        
        {/* SEO-rich text */}
        <div className="mt-16 text-sm text-gray-500">
          <h3 className="font-medium mb-2">About AI Character Chat</h3>
          <p>
            AI Character Chat refers to the experience of communicating with AI-powered virtual characters. These AI characters can simulate various personalities, historical figures, or fictional characters, providing users with immersive conversation experiences.
            Our directory includes the most popular AI chat platforms like Character.ai, ChatGPT, Claude, and many emerging AI applications focused on roleplaying and virtual companions.
            Whether you're looking for engaging conversations, language learning partners, or want to experience various character interactions, you'll find suitable AI chat tools here.
          </p>
        </div>

        {/* Performance monitoring info */}
        <div className="mt-16 border p-4 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold">Performance Info</h3>
          <p className="text-sm">Database request time: {dbEndTime - dbStartTime}ms</p>
          <p className="text-sm">Total render time: {endTime - startTime}ms</p>
        </div>
      </div>
    </main>
  );
}
