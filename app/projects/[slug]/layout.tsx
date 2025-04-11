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
import { Link } from "@/lib/supabase-db";

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

  // 获取项目相关链接
  const { data: links = [] } = await supabaseAdmin
    .from('links')
    .select('*')
    .eq('project_id', project.id);

  // 查找网站链接和GitHub链接
  const websiteLink = links.find(link => link.type === 'WEBSITE') || null;
  const githubLink = links.find(link => link.type === 'GITHUB') || {
    id: "mock",
    type: "GITHUB",
    url: "",
    short_link: "#",
    order: 0,
    project_id: project.id,
    created_at: "",
    updated_at: ""
  };

  const enrichedProject = {
    ...project,
    links,
    githubLink,
    websiteLink,
    users: [],
    clicks: currentClicks
  };

  const endTime = Date.now();
  console.log(`ProjectLayout-${slug}-总渲染时间: ${endTime - startTime}ms`);

  return (
    <ProjectProvider props={enrichedProject}>
      <div className="relative mx-4">
        {children}
      </div>
    </ProjectProvider>
  );
}
