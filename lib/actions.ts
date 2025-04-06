"use server";

import { supabase } from "./supabase-client";
import { toast } from "sonner";

/**
 * 创建新项目提交
 */
export async function createProject(data: {
  name: string;
  description: string;
  url: string;
  category: string;
  tags?: string;
  logoUrl?: string;
  screenShotUrl?: string;
  verified: boolean;
  status: string;
  userId: string;
}) {
  try {
    // 生成slug
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    // 分割tags为数组
    const tags = data.tags
      ? data.tags.split(",").map((tag) => tag.trim())
      : [];

    // 准备提交数据
    const projectData = {
      name: data.name,
      slug,
      description: data.description,
      logo: data.logoUrl || `https://placehold.co/400?text=${data.name.charAt(0).toUpperCase()}`,
      screenshot: data.screenShotUrl,
      category: data.category,
      tags,
      website: data.url,
      verified: data.verified,
      status: data.status,
      clicks: 0,
      user_id: data.userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 提交到Supabase
    const { error } = await supabase
      .from("projects")
      .insert([projectData]);

    if (error) {
      console.error("项目创建失败:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("创建项目失败:", error);
    return { success: false, error };
  }
}

/**
 * 获取项目列表
 */
export async function getProjects(options: { limit?: number; category?: string; status?: string } = {}) {
  const { limit = 20, category, status = "published" } = options;
  
  try {
    let query = supabase
      .from("projects")
      .select("*")
      .eq("status", status)
      .order("clicks", { ascending: false });
    
    if (category) {
      query = query.eq("category", category);
    }
    
    const { data, error } = await query.limit(limit);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("获取项目列表失败:", error);
    return { success: false, error };
  }
}

/**
 * 更新项目状态
 */
export async function updateProjectStatus(id: string, status: string) {
  try {
    const { error } = await supabase
      .from("projects")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("更新项目状态失败:", error);
    return { success: false, error };
  }
} 