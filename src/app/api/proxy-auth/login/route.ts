import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const correctPassword = process.env.DASHBOARD_PASSWORD || 'changeme';
  const secret = process.env.AUTH_SECRET || 'changeme';

  if (password !== correctPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth_session', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 дней
    path: '/',
  });

  return res;
}
