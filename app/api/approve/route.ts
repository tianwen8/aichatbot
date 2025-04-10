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

export const dynamic = 'force-dynamic'; // 禁止缓存此API路由
export const fetchCache = 'force-no-store'; // 确保fetch请求不缓存

export async function POST(request: Request) {
  console.log("Approve API called:", new Date().toISOString());
  
  try {
    // 验证管理员权限
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      console.error("Unauthorized approve attempt");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      console.error("Missing project ID in approve request");
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    console.log(`Approving project with ID: ${id}`);
    
    // 更新项目状态为已验证
    const { error } = await supabaseAdmin
      .from("projects")
      .update({ 
        verified: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);
    
    if (error) {
      console.error("Approval failed:", error);
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    console.log(`Project ${id} approved successfully`);
    return NextResponse.redirect(new URL("/admin", request.url));
    
  } catch (error) {
    console.error("Error processing approval request:", error);
    return NextResponse.redirect(new URL("/admin", request.url));
  }
}

// Add GET request handler
export async function GET(request: Request) {
  // Reuse the same logic as the POST method
  return POST(request);
} 