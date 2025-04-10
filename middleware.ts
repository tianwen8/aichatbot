import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 判断是否为管理员路径
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isAdminApiPath = request.nextUrl.pathname.startsWith('/api/admin');
  const isApiDeletePath = request.nextUrl.pathname.startsWith('/api/delete');
  
  // 如果是访问admin API或删除API，检查admin-auth cookie
  if ((isAdminApiPath || isApiDeletePath) && request.method !== 'GET') {
    const adminAuth = request.cookies.get('admin-auth')?.value;
    
    // 如果没有admin-auth cookie且不是登录API请求，返回未授权错误
    if (!adminAuth && !request.nextUrl.pathname.includes('/api/admin/auth')) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '未授权访问' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  return NextResponse.next();
}

// 设置匹配路径
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/delete/:path*'],
};
