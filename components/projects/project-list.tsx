import { Suspense } from "react";
import ProjectGrid from "./project-grid";
import { getFeaturedProjects, getVerifiedProjects } from "@/lib/supabase-db";

export default function ProjectList() {
  return (
    <Suspense fallback={null}>
      <ProjectListRSC />
    </Suspense>
  );
}

async function ProjectListRSC() {
  const featured = ["gallery", "dub", "ui"];
  const [featuredProjects, projects] = await Promise.all([
    getFeaturedProjects(featured),
    getVerifiedProjects(300),
  ]);

  return (
    <div className="mx-5 md:mx-0">
      <div className="grid gap-4">
        <h2 className="font-display text-2xl font-semibold">精选</h2>
        <ProjectGrid projects={featuredProjects} />
      </div>

      <div className="mb-8 mt-12 border-t border-gray-200" />

      <div className="grid gap-4">
        <h2 className="font-display text-2xl">所有项目</h2>
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
