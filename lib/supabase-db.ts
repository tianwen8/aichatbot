import { supabase, supabaseAdmin, createBucketIfNotExists } from './supabase';
import { measureAsync } from './performance';
import { createClient } from '@supabase/supabase-js';

// 存储桶名称
export const THUMBNAILS_BUCKET = 'thumbnails';
export const LOGOS_BUCKET = 'logos';

// 初始化存储桶
export async function initStorage() {
  await createBucketIfNotExists(THUMBNAILS_BUCKET);
  await createBucketIfNotExists(LOGOS_BUCKET);
}

// 手动创建表
export async function createTables() {
  try {
    // 创建projects表
    const { error: projectsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          verified BOOLEAN DEFAULT FALSE,
          description TEXT NOT NULL,
          logo TEXT NOT NULL,
          image TEXT,
          gradient TEXT DEFAULT 'from-purple-100 via-violet-50 to-blue-100',
          stars INTEGER DEFAULT 0,
          clicks INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    });
    
    if (projectsError) {
      console.error('创建projects表失败:', projectsError);
      // 尝试直接在SQL编辑器中运行
      console.log('请在Supabase的SQL编辑器中手动运行创建表的SQL语句');
    }
    
    // 创建links表
    const { error: linksError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.links (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL CHECK (type IN ('GITHUB', 'TWITTER', 'LINKEDIN', 'WEBSITE')),
          url TEXT NOT NULL,
          short_link TEXT NOT NULL,
          order_num INTEGER DEFAULT 0,
          project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          CONSTRAINT links_url_unique UNIQUE (url),
          CONSTRAINT links_short_link_unique UNIQUE (short_link)
        );
      `
    });
    
    if (linksError) {
      console.error('创建links表失败:', linksError);
    }
    
    // 创建计数器函数
    const { error: counterError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION increment_counter(row_id TEXT)
        RETURNS INTEGER AS $$
        DECLARE
          current_value INTEGER;
        BEGIN
          -- 获取当前值
          SELECT clicks INTO current_value FROM public.projects WHERE id = row_id;
          -- 返回增加后的值
          RETURN current_value + 1;
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    if (counterError) {
      console.error('创建计数器函数失败:', counterError);
    }
    
    return true;
  } catch (error) {
    console.error('创建表失败:', error);
    return false;
  }
}

// 项目类型定义
export interface Project {
  id: string;
  name: string;
  slug: string;
  verified: boolean;
  description: string;
  logo: string;
  image?: string | null;
  gradient: string;
  stars: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  type: 'GITHUB' | 'TWITTER' | 'LINKEDIN' | 'WEBSITE';
  url: string;
  short_link: string;
  order: number;
  project_id: string;
  created_at: string;
  updated_at: string;
}

export interface EnrichedProject extends Project {
  links: Link[];
  githubLink?: Link;
  websiteLink?: Link;
}

// 用户类型定义
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: string | null;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectUser {
  id: string;
  role: string;
  project_id: string;
  user_id: string;
  created_at: string;
}

export interface UserWithProjects extends User {
  projects: {
    project: Project;
  }[];
}

// 获取精选项目
export async function getFeaturedProjects(slugs: string[]): Promise<Project[]> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .in('slug', slugs);
  
  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
  
  return data as Project[];
}

// 获取已验证的项目列表
export async function getVerifiedProjects(count = 12): Promise<any[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("verified", true)
      .order("clicks", { ascending: false })
      .limit(count);

    if (error) {
      console.error("Failed to fetch verified projects:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching verified projects:", error);
    return [];
  }
}

// 按类别获取项目
export async function getProjectsByCategory(category: string, count = 12): Promise<any[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("verified", true)
      .eq("category", category)
      .order("clicks", { ascending: false })
      .limit(count);

    if (error) {
      console.error(`Failed to fetch projects for category ${category}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching projects for category ${category}:`, error);
    return [];
  }
}

// 搜索项目
export async function searchProjects(query: string, limit = 10): Promise<any[]> {
  if (!query.trim()) {
    return [];
  }
  
  try {
    // 使用ILIKE进行模糊搜索
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("verified", true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,keywords.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error("Failed to search projects:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error searching projects:", error);
    return [];
  }
}

// 获取项目通过slug
export async function getProject(slug: string): Promise<any | null> {
  console.log(`正在获取项目: ${slug}`);
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select(`
        *,
        websiteLink: links(*)
      `)
      .eq("slug", slug)
      .eq("links.type", "website")
      .single();

    if (error) {
      console.error(`获取项目失败 (slug=${slug}):`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`获取项目时出错 (slug=${slug}):`, error);
    return null;
  }
}

// 获取项目详情
export async function getProjectBySlug(slug: string): Promise<any | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Failed to fetch project with slug ${slug}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }
}

// 增加项目点击量
export async function incrementProjectClicks(slug: string): Promise<boolean> {
  try {
    // 先获取当前项目信息
    const project = await getProjectBySlug(slug);
    
    if (!project) {
      return false;
    }
    
    // 更新点击量
    const { error } = await supabaseAdmin
      .from("projects")
      .update({ 
        clicks: (project.clicks || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq("slug", slug);

    if (error) {
      console.error(`Failed to increment clicks for project ${slug}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error incrementing clicks for project ${slug}:`, error);
    return false;
  }
}

// 获取最新的提交项目
export async function getLatestSubmissions(limit = 10): Promise<any[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Failed to fetch latest submissions:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching latest submissions:", error);
    return [];
  }
}

// 审核项目
export async function approveProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("projects")
      .update({ 
        status: "published",
        updated_at: new Date().toISOString()
      })
      .eq("id", id);
    
    if (error) {
      console.error(`Failed to approve project ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error approving project ${id}:`, error);
    return false;
  }
}

// 拒绝项目
export async function rejectProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("projects")
      .update({ 
        status: "rejected",
        updated_at: new Date().toISOString()
      })
      .eq("id", id);
    
    if (error) {
      console.error(`Failed to reject project ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error rejecting project ${id}:`, error);
    return false;
  }
}

// 获取所有用户
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return data as User[];
}

// 获取单个用户
export async function getUser(username: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  
  return data as User;
}

// 获取用户及其项目
export async function getUserWithProjects(username: string): Promise<UserWithProjects | null> {
  // 获取用户
  const user = await getUser(username);
  
  if (!user) return null;
  
  // 获取用户关联的项目
  const { data: projectUsers, error: projectUsersError } = await supabaseAdmin
    .from('project_users')
    .select('project_id')
    .eq('user_id', user.id);
  
  if (projectUsersError) {
    console.error('Error fetching user projects:', projectUsersError);
    return null;
  }
  
  // 获取项目详情
  const projects = [];
  for (const pu of projectUsers || []) {
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', pu.project_id)
      .single();
    
    if (!projectError && project) {
      projects.push({ project });
    }
  }
  
  return {
    ...user,
    projects
  } as UserWithProjects;
}

// 上传图片到Supabase存储
export async function uploadImage(
  bucket: string, 
  filename: string, 
  file: File
): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .storage
    .from(bucket)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) {
    console.error(`Error uploading file to ${bucket}:`, error);
    return null;
  }
  
  // 获取公共URL
  const { data: publicUrl } = supabaseAdmin
    .storage
    .from(bucket)
    .getPublicUrl(data.path);
  
  return publicUrl.publicUrl;
} 