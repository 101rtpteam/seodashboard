import { NextRequest, NextResponse } from 'next/server';

// BACKEND_URL — серверная переменная, не нужна в build time
const BACKEND = process.env.BACKEND_URL || 'http://localhost:5001';

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  // /api/proxy/api/sites → http://backend/api/sites
  const path = params.path.join('/');
  const search = req.nextUrl.search || '';
  const url = `${BACKEND}/${path}${search}`;

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try { body = await req.text(); } catch {}
  }

  try {
    const res = await fetch(url, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Backend unavailable', detail: String(e) }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const OPTIONS = handler;
