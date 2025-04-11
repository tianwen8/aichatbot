import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

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

// 直接在路由中验证管理员会话
async function isAdmin() {
  try {
    // 获取会话cookie
    const cookieStore = cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    
    if (!sessionId) {
      console.log("删除API: 未找到管理员会话cookie");
      return false;
    }
    
    console.log("删除API: 检查会话ID:", sessionId);
    
    // 输出所有cookie用于调试
    console.log("删除API: 所有cookies:", 
      Array.from(cookieStore.getAll()).map(c => ({ name: c.name, value: c.value }))
    );
    
    // 获取全部会话以便调试比对
    const { data: allSessions } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (!allSessions || allSessions.length === 0) {
      console.log("删除API: 数据库中没有任何会话记录");
      return false;
    }
    
    console.log("删除API: 数据库中的会话:", 
      allSessions.map(s => ({ 
        id: s.id, 
        session_id: s.session_id?.trim(),  // 确保去除空格，并处理可能为null的情况
        created_at: s.created_at
      }))
    );
    
    // 不区分大小写和空白字符的方式查找匹配的会话
    const matchingSession = allSessions.find(s => 
      s.session_id?.trim()?.toLowerCase() === sessionId?.trim()?.toLowerCase()
    );
    
    if (!matchingSession) {
      console.log("删除API: 未找到匹配的会话:", sessionId);
      return false;
    }
    
    console.log("删除API: 找到匹配的会话:", {
      id: matchingSession.id,
      session_id: matchingSession.session_id,
      created_at: matchingSession.created_at,
      expires_at: matchingSession.expires_at
    });
    
    // 检查会话是否过期
    const now = new Date();
    const expiresAt = new Date(matchingSession.expires_at);
    
    if (now > expiresAt) {
      console.log("删除API: 会话已过期, 当前时间:", now, "过期时间:", expiresAt);
      return false;
    }
    
    console.log("删除API: 会话有效, 验证成功");
    return true;
  } catch (error) {
    console.error("删除API: 验证管理员状态时出错:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    console.log("删除API: 请求开始处理", new Date().toISOString());
    
    // 检查管理员权限
    const adminStatus = await isAdmin();
    console.log("删除API: 管理员状态:", adminStatus);
    
    if (!adminStatus) {
      console.error("删除API: 未授权的删除尝试");
      return NextResponse.json(
        { success: false, message: "未授权访问" },
        { status: 401 }
      );
    }
    
    // 从请求体中获取项目ID
    let projectId;
    try {
      const body = await request.json();
      projectId = body.id;
      console.log("删除API: 从请求体中获取到项目ID:", projectId);
    } catch (parseError) {
      console.error("删除API: 解析请求体失败:", parseError);
      
      // 尝试从URL参数中获取ID作为备选方案
      const url = new URL(request.url);
      projectId = url.searchParams.get("id");
      console.log("删除API: 尝试从URL参数获取项目ID:", projectId);
    }
    
    if (!projectId) {
      console.error("删除API: 缺少项目ID参数");
      return NextResponse.json(
        { success: false, message: "缺少项目ID" },
        { status: 400 }
      );
    }
    
    console.log(`删除API: 删除项目 ID ${projectId}`);
    
    // 检查项目是否存在
    const { data: project, error: checkError } = await supabaseAdmin
      .from("projects")
      .select("id, name")
      .eq("id", projectId)
      .single();
    
    if (checkError) {
      console.error("删除API: 检查项目时出错:", checkError);
      return NextResponse.json(
        { success: false, message: "检查项目时出错" },
        { status: 500 }
      );
    }
    
    if (!project) {
      console.error("删除API: 未找到项目:", projectId);
      return NextResponse.json(
        { success: false, message: "未找到项目" },
        { status: 404 }
      );
    }
    
    console.log(`删除API: 找到要删除的项目: ${project.name} (${projectId})`);
    
    // 执行删除操作
    const { error: deleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", projectId);
    
    if (deleteError) {
      console.error("删除API: 删除失败:", deleteError);
      return NextResponse.json(
        { success: false, message: `删除失败: ${deleteError.message}` },
        { status: 500 }
      );
    }
    
    console.log(`删除API: 项目 ${projectId} 删除成功`);
    
    return NextResponse.json(
      { success: true, message: "项目已成功删除" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("删除API: 处理删除请求时出错:", error);
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