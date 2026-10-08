import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runReadinessAudit, UnsafeUrlError } from '@/lib/readiness';
import { rateLimit } from '@/lib/rate-limit';
import { clientInfo } from '@/lib/auth/session';
import { isSameOrigin } from '@/lib/same-origin';

const body = z.object({ url: z.string().trim().min(3).max(2048) });

export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch (error) {
    // Always answer in JSON so the checker can show a useful message instead of a generic failure.
    console.error('[readiness] unexpected error:', error);
    const detail = process.env.NODE_ENV !== 'production' && error instanceof Error ? ` (${error.message})` : '';
    return NextResponse.json({ error: `Something went wrong on our side while running the check. Please try again.${detail}` }, { status: 500 });
  }
}

async function handle(request: Request) {
  // Same-origin only: this endpoint makes outbound requests on the caller's behalf.
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Cross-origin requests are not allowed.' }, { status: 403 });
  }
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter a website address to check.' }, { status: 400 });

  const { ip } = await clientInfo();
  // Public, unauthenticated tool: limit per IP in production; unlimited locally so testing isn't blocked.
  let limit = { ok: true, retryAfter: 0 };
  if (process.env.NODE_ENV === 'production') {
    try {
      limit = await rateLimit(`readiness:${ip}`, 20, 3600);
    } catch (error) {
      // A rate-limit store outage should not take the free tool down; log it and continue.
      console.error('[readiness] rate limiter unavailable:', error);
    }
  }
  if (!limit.ok) {
    return NextResponse.json({ error: `You have run several checks recently. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes, or start a free trial for unlimited audits.` }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  }

  try {
    const report = await runReadinessAudit(parsed.data.url);
    return NextResponse.json(report, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof UnsafeUrlError) return NextResponse.json({ error: error.message }, { status: 400 });
    const message = error instanceof Error && /timeout|aborted/i.test(error.message)
      ? 'The site took too long to respond. Check the address and try again.'
      : 'We could not reach that site. Check the address and that it is publicly accessible.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
