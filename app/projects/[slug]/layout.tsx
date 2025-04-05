import EditGradientPopover from "@/components/projects/edit-gradient-popover";
import EditProjectButton from "@/components/projects/edit-project-button";
import ProjectLayoutTabs from "@/components/projects/project-layout-tabs";
import ProjectProvider from "@/components/projects/project-provider";
import { buttonLinkVariants } from "@/components/ui/button-link";
import { getProject } from "@/lib/supabase-db";
import { supabaseAdmin } from "@/lib/supabase";
import { constructMetadata } from "@/lib/utils";
import { cn } from "@dub/utils";
import { BadgeCheck, Globe } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { measureAsync } from "@/lib/performance";

export const revalidate = 43200;

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const project = await getProject(slug);

  if (!project) {
    return;
  }

  return constructMetadata({
    title: `${project.name} | Web Directory`,
    description: `View ${project.name} details: ${project.description}`,
  });
}

export async function generateStaticParams() {
  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('slug')
    .eq('verified', true)
    .limit(150);
    
  return projects ? projects.map(({ slug }) => ({ slug })) : [];
}

export default async function ProjectLayout({
  params: { slug },
  children,
}: {
  params: {
    slug: string;
  };
  children: React.ReactNode;
}) {
  // 测量整个组件的渲染时间
  const startTime = Date.now();
  console.log(`ProjectLayout-${slug}-开始渲染`, startTime);
  
  // 测量项目数据获取时间
  const dbStartTime = Date.now();
  const project = await getProject(slug);
  const dbEndTime = Date.now();
  console.log(`项目数据获取耗时: ${dbEndTime - dbStartTime}ms`);

  if (!project) {
    console.log(`ProjectLayout-${slug}-未找到项目`, Date.now() - startTime);
    notFound();
  }

  let currentClicks = project.clicks || 0;

  // 异步更新点击次数，但不等待它完成
  const updateStartTime = Date.now(); 
  try {
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ clicks: project.clicks + 1 })
      .eq('id', project.id);
    
    if (!error) {
      currentClicks += 1;
    }
    console.log(`点击次数更新耗时: ${Date.now() - updateStartTime}ms`);
  } catch (err) {
    console.warn(`更新点击次数失败: ${err}`);
  }

  // 为组件创建必要的属性
  const mockGithubLink = project.websiteLink || {
    id: "mock",
    type: "WEBSITE",
    url: "",
    short_link: "#",
    order: 0,
    project_id: project.id,
    created_at: "",
    updated_at: ""
  };

  const enrichedProject = {
    ...project,
    githubLink: mockGithubLink, // 添加必要的githubLink属性
    users: [],
    clicks: currentClicks
  };

  const endTime = Date.now();
  console.log(`ProjectLayout-${slug}-总渲染时间: ${endTime - startTime}ms`);

  return (
    <ProjectProvider props={enrichedProject}>
      <div
        className={cn(
          "relative aspect-[4/1] w-full rounded-t-2xl bg-gradient-to-tr",
          project.gradient,
        )}
      >
        <Suspense>
          <EditGradientPopover project={enrichedProject} />
        </Suspense>
      </div>
      <div className="relative -mt-8 flex items-center justify-between px-4 sm:-mt-12 sm:items-end md:pr-0">
        <Image
          src={project.logo}
          alt={project.name}
          width={100}
          height={100}
          className="h-16 w-16 rounded-full bg-white p-2 sm:h-24 sm:w-24"
        />
        <div className="flex items-center space-x-2 py-2">
          <Suspense>
            <EditProjectButton project={enrichedProject} />
          </Suspense>
          {project.websiteLink && (
            <a
              href={project.websiteLink.short_link}
              target="_blank"
              className={buttonLinkVariants()}
            >
              <Globe className="h-4 w-4" />
              <p className="text-sm">访问网站</p>
            </a>
          )}
        </div>
      </div>
      <div className="max-w-lg p-4 pb-0">
        <div className="flex items-center space-x-2">
          <h1 className="font-display text-3xl font-bold">{project.name}</h1>
          {project.verified && (
            <BadgeCheck className="h-8 w-8 text-white" fill="#1c9bef" />
          )}
        </div>
        <p className="mt-2 text-gray-500">{project.description}</p>
        <p className="mt-1 text-xs text-gray-400">访问次数: {currentClicks}</p>
        
        {/* 添加性能信息 */}
        <div className="mt-2 text-xs text-gray-400">
          数据加载耗时: {dbEndTime - dbStartTime}ms | 
          总渲染耗时: {endTime - startTime}ms
        </div>
      </div>

      <ProjectLayoutTabs />

      <div className="relative mx-4 flex min-h-[22rem] items-center justify-center rounded-xl border border-gray-200 bg-white p-4">
        {children}
      </div>
    </ProjectProvider>
  );
}
