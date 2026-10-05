import { NextResponse, type NextRequest } from 'next/server';

const COOKIE = process.env.NODE_ENV === 'production' ? '__Host-signal_session' : 'signal_session';

// Optimistic check only: redirects visitors without a session cookie before rendering.
// Every page and action still verifies the session and workspace membership on the server.
export function proxy(request: NextRequest) {
  if (!request.cookies.get(COOKIE)) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/app/:path*'] };
