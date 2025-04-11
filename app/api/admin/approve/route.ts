import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

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

export async function POST(request: Request) {
  try {
    console.log("管理员审核API: 开始处理请求");
    
    // 从请求体中获取项目ID和审核状态
    const { id, approve } = await request.json();
    
    if (!id) {
      console.error("管理员审核API: 缺少项目ID");
      return NextResponse.json(
        { success: false, message: "缺少项目ID" },
        { status: 400 }
      );
    }
    
    console.log(`管理员审核API: 审核项目 ID ${id}, 状态: ${approve ? '批准' : '拒绝'}`);
    
    // 检查项目是否存在
    const { data: project, error: checkError } = await supabaseAdmin
      .from("projects")
      .select("id, name, verified")
      .eq("id", id)
      .single();
    
    if (checkError) {
      console.error("管理员审核API: 检查项目时出错:", checkError);
      return NextResponse.json(
        { success: false, message: "检查项目时出错" },
        { status: 500 }
      );
    }
    
    if (!project) {
      console.error("管理员审核API: 未找到项目:", id);
      return NextResponse.json(
        { success: false, message: "未找到项目" },
        { status: 404 }
      );
    }
    
    console.log(`管理员审核API: 找到要审核的项目: ${project.name} (${id}), 当前状态: ${project.verified ? '已验证' : '未验证'}`);
    
    // 更新项目状态
    const { error: updateError } = await supabaseAdmin
      .from("projects")
      .update({ 
        verified: approve,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);
    
    if (updateError) {
      console.error("管理员审核API: 更新项目状态失败:", updateError);
      return NextResponse.json(
        { success: false, message: `更新项目状态失败: ${updateError.message}` },
        { status: 500 }
      );
    }
    
    console.log(`管理员审核API: 项目 ${id} 状态已更新为 ${approve ? '已验证' : '未验证'}`);
    
    // 如果拒绝项目，则删除它
    if (!approve) {
      const { error: deleteError } = await supabaseAdmin
        .from("projects")
        .delete()
        .eq("id", id);
      
      if (deleteError) {
        console.error("管理员审核API: 删除拒绝的项目失败:", deleteError);
        return NextResponse.json(
          { success: false, message: `删除拒绝的项目失败: ${deleteError.message}` },
          { status: 500 }
        );
      }
      
      console.log(`管理员审核API: 已拒绝并删除项目 ${id}`);
      
      return NextResponse.json(
        { success: true, message: "项目已被拒绝并删除" },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: "项目已被批准并上线" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("管理员审核API: 处理审核请求时出错:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
} 