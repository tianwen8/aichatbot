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

// 创建一个管理员会话并设置cookie
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");
    
    if (!sessionId) {
      // 如果没有提供session_id，获取数据库中最新的会话
      const { data: latestSession, error } = await supabaseAdmin
        .from('admin_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !latestSession) {
        return NextResponse.json(
          { success: false, message: "无法获取会话信息", error },
          { status: 500 }
        );
      }
      
      // 设置cookie
      const cookieStore = cookies();
      cookieStore.set('admin_session', latestSession.session_id, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7天有效期
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      return NextResponse.json({
        success: true,
        message: "已设置管理员会话cookie",
        session: {
          id: latestSession.id,
          session_id: latestSession.session_id,
          created_at: latestSession.created_at,
          expires_at: latestSession.expires_at
        }
      });
    } else {
      // 使用提供的session_id
      // 先检查此session_id是否存在
      const { data: existingSession, error } = await supabaseAdmin
        .from('admin_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();
      
      if (error) {
        return NextResponse.json(
          { success: false, message: "提供的session_id不存在", error },
          { status: 400 }
        );
      }
      
      // 设置cookie
      const cookieStore = cookies();
      cookieStore.set('admin_session', sessionId, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7天有效期
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      return NextResponse.json({
        success: true,
        message: "已设置管理员会话cookie",
        session: {
          id: existingSession.id,
          session_id: existingSession.session_id,
          created_at: existingSession.created_at,
          expires_at: existingSession.expires_at
        }
      });
    }
  } catch (error) {
    console.error("设置管理员会话时出错:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
} 