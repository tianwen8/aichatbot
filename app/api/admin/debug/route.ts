import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

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

// 调试会话状态的API端点
export async function GET(request: Request) {
  try {
    // 获取当前cookie
    const cookieStore = cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const allCookies = Array.from(cookieStore.getAll());
    
    // 获取所有会话记录
    const { data: allSessions, error: sessionsError } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (sessionsError) {
      return NextResponse.json(
        { success: false, message: "获取会话记录失败", error: sessionsError },
        { status: 500 }
      );
    }
    
    // 查找当前会话
    let matchingSession = null;
    let sessionStatus = "未找到";
    
    if (sessionId && allSessions) {
      matchingSession = allSessions.find(s => 
        s.session_id?.trim()?.toLowerCase() === sessionId?.trim()?.toLowerCase()
      );
      
      if (matchingSession) {
        const now = new Date();
        const expiresAt = new Date(matchingSession.expires_at);
        
        sessionStatus = now > expiresAt ? "已过期" : "有效";
      }
    }
    
    // 返回完整的调试信息
    return NextResponse.json({
      success: true,
      debug_info: {
        current_time: new Date().toISOString(),
        cookies: {
          has_session_cookie: !!sessionId,
          session_id: sessionId ? `${sessionId.substring(0, 4)}...${sessionId.substring(sessionId.length - 4)}` : null,
          all_cookies: allCookies.map(c => ({ name: c.name, value: c.name === 'admin_session' ? '(hidden)' : c.value }))
        },
        sessions: {
          total_count: allSessions?.length || 0,
          current_session: matchingSession ? {
            id: matchingSession.id,
            status: sessionStatus,
            created_at: matchingSession.created_at,
            expires_at: matchingSession.expires_at
          } : null,
          recent_sessions: allSessions?.map(s => ({
            id: s.id,
            session_id: `${s.session_id.substring(0, 4)}...${s.session_id.substring(s.session_id.length - 4)}`,
            created_at: s.created_at,
            expires_at: s.expires_at,
            status: new Date() > new Date(s.expires_at) ? "已过期" : "有效"
          }))
        }
      }
    });
    
  } catch (error) {
    console.error("调试会话状态时出错:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误", error },
      { status: 500 }
    );
  }
} 