import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

// 创建具有服务角色权限的Supabase客户端
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// 验证项目数据
function validateProjectData(data: any) {
  const errors = [];
  
  if (!data.name) errors.push("项目名称必填");
  if (!data.description) errors.push("项目描述必填");
  if (!data.url) errors.push("项目网址必填");
  
  if (data.name && data.name.length > 100) {
    errors.push("项目名称不能超过100个字符");
  }
  
  if (data.description && data.description.length > 1000) {
    errors.push("项目描述不能超过1000个字符");
  }
  
  return errors;
}

// 生成唯一的slug
function generateUniqueSlug(name: string) {
  const baseSlug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  
  const uniqueId = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${uniqueId}`;
}

// 格式化URL
function formatUrl(url: string) {
  try {
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      return 'https://' + url;
    }
    return url;
  } catch (error) {
    return 'https://' + url;
  }
}

export async function POST(request: Request) {
  try {
    console.log("管理员提交API: 开始处理请求");
    
    // 从请求体中获取项目数据
    const projectData = await request.json();
    
    // 验证项目数据
    const validationErrors = validateProjectData(projectData);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      );
    }
    
    // 生成唯一ID和slug
    const projectId = uuidv4();
    const slug = generateUniqueSlug(projectData.name);
    
    // 格式化URL
    const formattedUrl = formatUrl(projectData.url);
    
    // 准备项目数据 - 管理员提交的项目默认已验证
    const newProject = {
      id: projectId,
      name: projectData.name,
      slug: slug,
      description: projectData.description,
      url: formattedUrl,
      category: projectData.category || '',
      keywords: projectData.keywords || '',
      meta_description: projectData.meta_description || projectData.description.substring(0, 160),
      logo: projectData.logo || '',
      image: projectData.image || '',
      gradient: projectData.gradient || '',
      features: projectData.features || null,
      instructions: projectData.instructions || '',
      stats: projectData.stats || null,
      verified: true, // 管理员提交的项目默认已验证
      stars: 0,
      clicks: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // 插入项目数据
    const { error } = await supabaseAdmin
      .from('projects')
      .insert(newProject);
    
    if (error) {
      console.error("管理员提交API: 插入项目失败:", error);
      
      // 检查是否为slug冲突
      if (error.code === '23505' && error.message.includes('slug')) {
        return NextResponse.json(
          { success: false, message: "项目名称已存在，请使用不同的名称" },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { success: false, message: `保存项目失败: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log(`管理员提交API: 项目 ${projectData.name} (${projectId}) 已成功创建并上线`);
    
    return NextResponse.json({
      success: true,
      message: "项目已成功创建并上线",
      project: {
        id: projectId,
        name: projectData.name,
        slug: slug
      }
    });
    
  } catch (error) {
    console.error("管理员提交API: 处理请求时出错:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
} 