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
  url: string;
  logo?: string | null;
  image?: string | null;
  category?: string;
  keywords?: string;
  meta_description?: string;
  gradient?: string;
  stars: number;
  clicks: number;
  popularity?: number;
  features?: string[];
  instructions?: string;
  stats?: {
    users?: number;
    views?: number;
  };
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
export async function getFeaturedProjects(slugs: string[] = [], category?: string): Promise<Project[]> {
  try {
    // 添加日志
    console.log(`Fetching featured projects, slugs: ${slugs.join(', ')}, category: ${category || 'all'}`);
    
    let query = supabaseAdmin
      .from('projects')
      .select('*')
      .eq('verified', true);
    
    // 如果指定了分类，添加分类过滤条件
    if (category) {
      query = query.eq('category', category);
    }
    
    // 按创建时间倒序排序，确保新提交的项目优先显示
    query = query.order('created_at', { ascending: false })
      .limit(6);
    
    // 如果提供了特定slug列表，只返回这些项目
    if (slugs.length > 0) {
      query = query.in('slug', slugs);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }
    
    console.log(`Found ${data?.length || 0} featured projects`);
    return data || [];
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

// 获取已验证的项目列表
export async function getVerifiedProjects(count = 12, category?: string): Promise<Project[]> {
  try {
    // 添加日志
    console.log(`Fetching verified projects, limit: ${count}, category: ${category || 'all'}`);
    const startTime = Date.now();
    
    let query = supabaseAdmin
      .from("projects")
      .select("*")
      .eq("verified", true);
    
    // 如果指定了分类，添加分类过滤条件
    if (category) {
      query = query.eq('category', category);
    }
    
    // 按创建时间倒序排序
    query = query.order("created_at", { ascending: false })
      .limit(count);
    
    const { data, error } = await query;
    
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error("Error fetching verified projects:", error);
      return [];
    }
    
    console.log(`Found ${data?.length || 0} verified projects in ${duration}ms`);
    return data || [];
  } catch (error) {
    console.error("Error fetching verified projects:", error);
    return [];
  }
}

// 按类别获取项目
export async function getProjectsByCategory(category: string, count = 12): Promise<Project[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("verified", true)
      .eq("category", category)
      .order("created_at", { ascending: false })
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

/**
 * Search for projects
 * @param query - Search query string
 * @param category - Category filter
 * @param sortBy - Sort method
 * @returns Array of projects
 */
export async function searchProjects(
  query: string,
  category: string = 'all',
  sortBy: string = 'relevance'
) {
  try {
    console.log(`搜索项目: 查询="${query}", 分类="${category}", 排序="${sortBy}"`);
    
    if (!query || query.trim() === '') {
      console.log('搜索查询为空，返回空结果');
      return [];
    }

    const cleanedQuery = query.trim().toLowerCase();
    console.log(`处理后的搜索关键词: "${cleanedQuery}"`);
    
    // 将单独查询文本字段和JSON字段，然后合并结果
    // 第一步：查询文本字段
    const { data: textResults, error: textError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .or(`name.ilike.%${cleanedQuery}%,description.ilike.%${cleanedQuery}%`)
      .eq('verified', true);
    
    if (textError) {
      console.error('搜索文本字段失败:', textError);
      return [];
    }
    
    console.log(`文本字段搜索结果数量: ${textResults?.length || 0}`);
    
    // 第二步：查询features字段（使用原始SQL查询以确保正确处理JSON）
    // 注意：直接在Supabase控制台运行的SQL查询显示需要使用单引号
    const { data: jsonResults, error: jsonError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .filter('features', 'ilike', `%${cleanedQuery}%`)
      .eq('verified', true);
    
    if (jsonError) {
      console.error('搜索JSON features字段失败:', jsonError);
      
      // 尝试备选方法
      console.log('尝试使用备选方法搜索features字段...');
      const { data: altJsonResults, error: altJsonError } = await supabaseAdmin
        .rpc('search_json_field', { 
          search_term: cleanedQuery
        });
        
      if (altJsonError) {
        console.error('备选方法失败:', altJsonError);
      } else {
        console.log(`备选方法搜索结果数量: ${altJsonResults?.length || 0}`);
        
        // 合并结果并去重
        if (altJsonResults && altJsonResults.length > 0) {
          const allIds = new Set(textResults?.map(item => item.id) || []);
          for (const item of altJsonResults) {
            if (!allIds.has(item.id)) {
              textResults.push(item);
              allIds.add(item.id);
            }
          }
        }
      }
    } else {
      console.log(`JSON字段搜索结果数量: ${jsonResults?.length || 0}`);
      
      // 合并结果并去重
      if (jsonResults && jsonResults.length > 0) {
        const allIds = new Set(textResults?.map(item => item.id) || []);
        for (const item of jsonResults) {
          if (!allIds.has(item.id)) {
            textResults.push(item);
            allIds.add(item.id);
          }
        }
      }
    }
    
    // 应用分类过滤
    let finalResults = textResults || [];
    if (category !== 'all') {
      console.log(`应用分类过滤: ${category}`);
      finalResults = finalResults.filter(item => item.category === category);
    }
    
    // 应用排序
    switch (sortBy) {
      case 'popular':
        finalResults.sort((a, b) => (b.user_count || 0) - (a.user_count || 0));
        break;
      case 'newest':
        finalResults.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'relevance':
      default:
        // 对于相关性排序，将名称或描述中直接包含查询词的项目排在前面
        finalResults.sort((a, b) => {
          const aNameMatch = a.name.toLowerCase().includes(cleanedQuery) ? 1 : 0;
          const bNameMatch = b.name.toLowerCase().includes(cleanedQuery) ? 1 : 0;
          if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;
          
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
    }
    
    console.log(`最终搜索结果数量: ${finalResults.length}`);
    if(finalResults.length > 0) {
      console.log('结果项目名称:', finalResults.map(item => item.name).join(', '));
    }
    
    return finalResults;
  } catch (error) {
    console.error('Error in searchProjects:', error);
    return [];
  }
}

// 获取项目通过slug
export async function getProject(slug: string): Promise<EnrichedProject | null> {
  try {
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (projectError || !project) {
      console.error("Error fetching project:", projectError);
      return null;
    }

    const { data: links, error: linksError } = await supabaseAdmin
      .from("links")
      .select("*")
      .eq("project_id", project.id)
      .order("order_num", { ascending: true });

    if (linksError) {
      console.error("Error fetching links:", linksError);
      return null;
    }

    const enrichedProject: EnrichedProject = {
      ...project,
      links: links || [],
      githubLink: links?.find(link => link.type === 'GITHUB'),
      websiteLink: links?.find(link => link.type === 'WEBSITE')
    };

    return enrichedProject;
  } catch (error) {
    console.error("Error in getProject:", error);
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

/**
 * Get projects by ranking
 * @param sortBy - Sorting method (popular, rating, trending)
 * @param category - Category filter
 * @param limit - Number of projects to return
 * @returns Array of projects
 */
export async function getProjectsByRanking(
  sortBy: 'popular' | 'rating' | 'trending',
  category: string = 'all',
  limit: number = 50
) {
  try {
    console.log(`Fetching ranked projects: sortBy=${sortBy}, category=${category}, limit=${limit}`);
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    let query = supabase
      .from('projects')
      .select('*')
      .eq('verified', true);

    // Apply category filter if not 'all'
    if (category !== 'all') {
      query = query.eq('category', category);
    }

    // Apply sorting using existing fields
    switch (sortBy) {
      case 'popular':
        // Use clicks instead of user_count for popularity
        query = query.order('clicks', { ascending: false });
        break;
      case 'rating':
        // Use stars instead of rating 
        query = query.order('stars', { ascending: false });
        break;
      case 'trending':
        // For trending, use updated_at as a proxy for recent activity
        query = query.order('updated_at', { ascending: false });
        break;
      default:
        query = query.order('clicks', { ascending: false });
    }

    // Apply limit
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching ranked projects:', error);
      return [];
    }

    // Add mock fields for UI compatibility
    const enhancedData = data?.map(project => ({
      ...project,
      // Add calculated or mock fields that might be expected by the UI
      user_count: project.clicks || 0,
      rating: (project.stars / 10) || 4.5, // Mock rating based on stars or default to 4.5
      rank_change: Math.floor(Math.random() * 5) // Random rank change for demonstration
    }));

    console.log(`Found ${enhancedData?.length || 0} ranked projects`);
    return enhancedData || [];
  } catch (error) {
    console.error('Error in getProjectsByRanking:', error);
    return [];
  }
}

/**
 * Get latest projects
 * @param category - Category filter
 * @param limit - Number of projects to return
 * @returns Array of projects
 */
export async function getLatestProjects(
  category: string = 'all',
  limit: number = 24
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    let query = supabase
      .from('projects')
      .select('*')
      .eq('verified', true)
      .order('created_at', { ascending: false });

    // Apply category filter if not 'all'
    if (category !== 'all') {
      query = query.eq('category', category);
    }

    // Apply limit
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching latest projects:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getLatestProjects:', error);
    return [];
  }
}

/**
 * Get trending projects
 * @param category - Category filter
 * @param limit - Number of projects to return
 * @returns Array of projects
 */
export async function getTrendingProjects(
  category: string = 'all',
  limit: number = 24
) {
  try {
    console.log(`Fetching trending projects: category=${category}, limit=${limit}`);
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    let query = supabase
      .from('projects')
      .select('*')
      .eq('verified', true)
      .order('updated_at', { ascending: false }); // Use updated_at for trending

    // Apply category filter if not 'all'
    if (category !== 'all') {
      query = query.eq('category', category);
    }

    // Apply limit
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching trending projects:', error);
      return [];
    }

    // Add mock fields for UI compatibility
    const enhancedData = data?.map(project => ({
      ...project,
      rank_change: Math.floor(Math.random() * 5), // Random rank change for demonstration
      rating: (project.stars / 10) || 4.5 // Mock rating based on stars or default to 4.5
    }));

    console.log(`Found ${enhancedData?.length || 0} trending projects`);
    return enhancedData || [];
  } catch (error) {
    console.error('Error in getTrendingProjects:', error);
    return [];
  }
} 