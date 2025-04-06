import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// 创建具有服务器角色权限的Supabase客户端
// 使用SERVICE_ROLE_KEY可以绕过RLS策略
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// 简单的管理员检查函数，实际项目中应该使用真实的认证
const isAdmin = (userId?: string) => {
  // 这里可以实现更复杂的管理员检查逻辑
  // 比如从数据库中查询用户角色等
  // 目前简单返回true，让所有提交都被视为管理员提交
  return true;
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.name || !data.description || !data.url) {
      return NextResponse.json(
        { success: false, message: "缺少必要的网站信息" },
        { status: 400 }
      );
    }
    
    // 生成slug
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    
    // 检查用户是否为管理员（自动审核）
    const adminStatus = isAdmin();
    
    // 准备数据
    const projectData = {
      id: uuidv4(), // 生成唯一ID
      name: data.name,
      slug,
      description: data.description,
      url: data.url,
      keywords: data.keywords || "",
      meta_description: data.meta_description || "",
      category: data.category || "",
      logo: data.logo || `https://placehold.co/150x150?text=${data.name.charAt(0).toUpperCase()}`,
      image: data.image || null,
      verified: adminStatus, // 管理员提交自动验证，普通用户需要审核
      gradient: "from-purple-100 via-violet-50 to-blue-100",
      stars: 0,
      clicks: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log("提交项目数据:", projectData);
    
    // 使用具有服务器角色权限的客户端提交到Supabase
    // 这可以绕过行级安全策略限制
    const { data: insertedData, error: submitError } = await supabaseAdmin
      .from("projects")
      .insert([projectData])
      .select()
      .single();
    
    if (submitError) {
      console.error("提交失败:", submitError);
      return NextResponse.json(
        { 
          success: false, 
          message: "提交失败: " + submitError.message,
          error: submitError
        },
        { status: 500 }
      );
    }
    
    // 提交成功
    return NextResponse.json({
      success: true,
      message: adminStatus ? "网站提交成功，已发布到首页" : "网站提交成功，等待审核",
      data: { 
        slug,
        id: projectData.id
      }
    });
    
  } catch (error: any) {
    console.error("处理提交请求时出错:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误: " + (error.message || "未知错误") },
      { status: 500 }
    );
  }
} 