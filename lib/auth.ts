import { supabase } from './supabase-client';

export interface Session {
  user: {
    id: string;
    name?: string;
    email: string;
    image?: string;
    username?: string;
  };
}

/**
 * 获取当前用户会话信息
 * 如果没有登录，返回null
 */
export async function getUserSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('获取用户会话失败:', error);
      return null;
    }
    
    if (!session) {
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error('获取用户会话出错:', error);
    return null;
  }
}
