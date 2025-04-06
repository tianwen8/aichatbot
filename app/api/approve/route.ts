import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "缺少项目ID" },
        { status: 400 }
      );
    }
    
    // 更新项目状态为已验证
    const { error } = await supabase
      .from("projects")
      .update({ 
        verified: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);
    
    if (error) {
      console.error("审核失败:", error);
      return NextResponse.json(
        { success: false, message: "审核失败" },
        { status: 500 }
      );
    }
    
    // 重定向回管理页面
    return NextResponse.redirect(new URL("/admin", request.url));
    
  } catch (error) {
    console.error("处理审核请求时出错:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}

// 添加GET请求处理方法
export async function GET(request: Request) {
  // 重用与POST方法相同的逻辑
  return POST(request);
} 