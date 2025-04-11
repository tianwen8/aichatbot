import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic'; // 禁止缓存此API路由
export const fetchCache = 'force-no-store'; // 确保fetch请求不缓存

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

export async function POST(request: Request) {
  try {
    console.log("管理员删除API: 请求开始处理", new Date().toISOString());
    
    // 从请求体中获取项目ID
    let projectId;
    try {
      const body = await request.json();
      projectId = body.id;
      console.log("管理员删除API: 从请求体中获取到项目ID:", projectId);
    } catch (parseError) {
      console.error("管理员删除API: 解析请求体失败:", parseError);
      
      // 尝试从URL参数中获取ID作为备选方案
      const url = new URL(request.url);
      projectId = url.searchParams.get("id");
      console.log("管理员删除API: 尝试从URL参数获取项目ID:", projectId);
    }
    
    if (!projectId) {
      console.error("管理员删除API: 缺少项目ID参数");
      return NextResponse.json(
        { success: false, message: "缺少项目ID" },
        { status: 400 }
      );
    }
    
    console.log(`管理员删除API: 删除项目 ID ${projectId}`);
    
    // 检查项目是否存在
    const { data: project, error: checkError } = await supabaseAdmin
      .from("projects")
      .select("id, name")
      .eq("id", projectId)
      .single();
    
    if (checkError) {
      console.error("管理员删除API: 检查项目时出错:", checkError);
      return NextResponse.json(
        { success: false, message: "检查项目时出错" },
        { status: 500 }
      );
    }
    
    if (!project) {
      console.error("管理员删除API: 未找到项目:", projectId);
      return NextResponse.json(
        { success: false, message: "未找到项目" },
        { status: 404 }
      );
    }
    
    console.log(`管理员删除API: 找到要删除的项目: ${project.name} (${projectId})`);
    
    // 执行删除操作
    const { error: deleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", projectId);
    
    if (deleteError) {
      console.error("管理员删除API: 删除失败:", deleteError);
      return NextResponse.json(
        { success: false, message: `删除失败: ${deleteError.message}` },
        { status: 500 }
      );
    }
    
    console.log(`管理员删除API: 项目 ${projectId} 删除成功`);
    
    return NextResponse.json(
      { success: true, message: "项目已成功删除" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("管理员删除API: 处理删除请求时出错:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}

// 添加GET请求处理
export async function GET(request: Request) {
  return POST(request);
} 