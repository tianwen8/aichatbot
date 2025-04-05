import { createClient } from '@supabase/supabase-js';

// 使用环境变量创建客户端实例
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// 导出项目类型
export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  gradient: string;
  category: string;
  verified: boolean;
  clicks: number;
  created_at: string;
  updated_at: string;
};

export type Link = {
  id: string;
  type: string;
  url: string;
  short_link: string;
  order: number;
  project_id: string;
  created_at: string;
  updated_at: string;
};

export type EnrichedProject = Project & {
  links: Link[];
  githubLink?: Link;
  websiteLink?: Link;
}; 