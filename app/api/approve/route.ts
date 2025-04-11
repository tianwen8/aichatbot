import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // 禁止缓存此API路由
export const fetchCache = 'force-no-store'; // 确保fetch请求不缓存

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

// 直接在路由中验证管理员会话
async function isAdmin() {
  try {
    // 获取会话cookie
    const cookieStore = cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    
    if (!sessionId) {
      console.log("审批API: 未找到管理员会话cookie");
      return false;
    }
    
    console.log("审批API: 检查会话ID:", sessionId);
    
    // 直接使用session_id字段匹配，因为从数据库结构看这是正确的字段
    const { data: session, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (error) {
      console.error("审批API: 查询session_id失败:", error);
      return false;
    }
    
    if (!session) {
      console.log("审批API: 未找到与session_id匹配的会话:", sessionId);
      return false;
    }
    
    console.log("审批API: 成功找到会话:", {
      id: session.id,
      session_id: session.session_id,
      expires_at: session.expires_at
    });
    
    // 检查会话是否过期
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    
    if (now > expiresAt) {
      console.log("审批API: 会话已过期, 当前时间:", now, "过期时间:", expiresAt);
      return false;
    }
    
    console.log("审批API: 会话有效, 验证成功");
    return true;
  } catch (error) {
    console.error("审批API: 验证管理员状态时出错:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    console.log("审批API: 请求开始处理", new Date().toISOString());
    
    // 验证管理员权限
    const adminStatus = await isAdmin();
    console.log("审批API: 管理员状态:", adminStatus);
    
    if (!adminStatus) {
      console.error("审批API: 未授权的审批尝试");
      return NextResponse.json(
        { success: false, message: "未授权访问" },
        { status: 401 }
      );
    }
    
    // 从请求体中获取项目ID
    let id;
    try {
      const body = await request.json();
      id = body.id;
      console.log("审批API: 从请求体中获取到项目ID:", id);
    } catch (parseError) {
      console.error("审批API: 解析请求体失败:", parseError);
      
      // 尝试从URL参数中获取ID作为备选方案
      const url = new URL(request.url);
      id = url.searchParams.get("id");
      console.log("审批API: 尝试从URL参数获取项目ID:", id);
    }
    
    if (!id) {
      console.error("审批API: 缺少项目ID参数");
      return NextResponse.json(
        { success: false, message: "缺少项目ID" },
        { status: 400 }
      );
    }
    
    console.log(`审批API: 审批项目 ID ${id}`);
    
    // 更新项目状态为已验证
    const { error, data } = await supabaseAdmin
      .from("projects")
      .update({ 
        verified: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select();
    
    if (error) {
      console.error("审批API: 审批失败:", error);
      return NextResponse.json(
        { success: false, message: `审批失败: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log(`审批API: 项目 ${id} 审批成功, 返回数据:`, data);
    return NextResponse.json(
      { success: true, message: "项目已成功审核通过" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("审批API: 处理审批请求时出错:", error);
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