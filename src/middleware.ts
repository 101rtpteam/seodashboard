import { NextRequest, NextResponse } from 'next/server';

const LOGIN_PATH = '/_auth/login';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Пропускаем статику и сам логин
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith(LOGIN_PATH) ||
    pathname.startsWith('/api/proxy') // proxy не блокируем — бэкенд сам не требует авторизации
  ) {
    return NextResponse.next();
  }

  const session = req.cookies.get('auth_session')?.value;
  const validSession = process.env.AUTH_SECRET || 'changeme';

  if (session !== validSession) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
