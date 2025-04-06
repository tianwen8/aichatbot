"use client";

import { createContext, useContext, type ReactNode } from "react";

// 定义项目类型
export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  image?: string;
  url?: string;
  verified: boolean;
  gradient: string;
  clicks: number;
  created_at: string;
  updated_at: string;
  websiteLink?: {
    id: string;
    type: string;
    url: string;
    short_link: string;
    order: number;
    project_id: string;
    created_at: string;
    updated_at: string;
  };
};

// 创建项目上下文
const ProjectContext = createContext<Project | null>(null);

// 项目提供者组件
export function ProjectProvider({
  props,
  children,
}: {
  props: Project;
  children: ReactNode;
}) {
  return (
    <ProjectContext.Provider value={props}>
      {children}
    </ProjectContext.Provider>
  );
}

// 使用项目上下文的钩子
export function useProjectContext() {
  const context = useContext(ProjectContext);
  
  if (!context) {
    throw new Error("useProjectContext必须在ProjectProvider内部使用");
  }
  
  return context;
} 