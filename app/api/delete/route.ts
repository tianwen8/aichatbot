import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// 创建具有管理员权限的Supabase客户端
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

// 验证管理员会话
async function verifyAdminSession() {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    
    if (!sessionId) {
      console.log("No admin session cookie found");
      return false;
    }
    
    const { data: session, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error) {
      console.error("Admin session verification failed:", error);
      return false;
    }
    
    if (!session) {
      console.log("No session found");
      return false;
    }
    
    if (new Date(session.expires_at) < new Date()) {
      console.log("Admin session expired");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error verifying admin session:", error);
    return false;
  }
}

export async function POST(request: Request) {
  console.log("DELETE API called:", new Date().toISOString());
  
  try {
    // 验证管理员权限
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      console.error("Unauthorized delete attempt");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      console.error("Missing project ID in delete request");
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    console.log(`Deleting project with ID: ${id}`);
    
    // 先检查项目是否存在
    const { data: existingProject, error: checkError } = await supabaseAdmin
      .from("projects")
      .select("id, name")
      .eq("id", id)
      .single();
    
    if (checkError) {
      console.error("Error checking if project exists:", checkError);
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    if (!existingProject) {
      console.error("Project not found:", id);
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    console.log(`Found project to delete: ${existingProject.name} (${id})`);
    
    // 先删除相关的链接
    try {
      console.log(`Deleting links for project ${id}`);
      const { error: linkError } = await supabaseAdmin
        .from("links")
        .delete()
        .eq("project_id", id);
      
      if (linkError) {
        console.warn(`Error deleting links for project ${id}:`, linkError);
      }
    } catch (linkError) {
      console.warn(`Exception cleaning up links for project ${id}:`, linkError);
    }
    
    // 删除项目
    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Delete failed:", error);
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    console.log(`Project ${id} deleted successfully`);
    return NextResponse.redirect(new URL("/admin", request.url));
    
  } catch (error) {
    console.error("Error processing delete request:", error);
    return NextResponse.redirect(new URL("/admin", request.url));
  }
}

// 添加GET请求处理
export async function GET(request: Request) {
  return POST(request);
} 