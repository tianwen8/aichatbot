import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 判断是否为管理员路径
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isAdminApiPath = request.nextUrl.pathname.startsWith('/api/admin');
  const isLoginPath = request.nextUrl.pathname === '/admin/login';
  
  // 如果是登录页面，直接允许访问
  if (isLoginPath) {
    return NextResponse.next();
  }
  
  // 如果是访问admin页面或admin API，检查admin_session cookie
  if (isAdminPath || isAdminApiPath) {
    const adminSession = request.cookies.get('admin_session')?.value;
    
    // 如果没有admin_session cookie且不是登录API请求，返回未授权错误或重定向到登录页
    if (!adminSession && !request.nextUrl.pathname.includes('/api/admin/auth')) {
      // 对于API请求返回JSON响应
      if (isAdminApiPath) {
        return new NextResponse(
          JSON.stringify({ success: false, message: '未授权访问' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // 对于页面请求重定向到登录页
      if (isAdminPath) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

// 设置匹配路径
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
