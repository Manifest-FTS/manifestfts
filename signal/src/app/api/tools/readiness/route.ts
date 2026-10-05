import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runReadinessAudit, UnsafeUrlError } from '@/lib/readiness';
import { rateLimit } from '@/lib/rate-limit';
import { clientInfo } from '@/lib/auth/session';

const body = z.object({ url: z.string().trim().min(3).max(2048) });

export async function POST(request: Request) {
  // Same-origin only: this endpoint makes outbound requests on the caller's behalf.
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host && origin !== process.env.NEXT_PUBLIC_SITE_URL) {
    return NextResponse.json({ error: 'Cross-origin requests are not allowed.' }, { status: 403 });
  }
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter a website address to check.' }, { status: 400 });

  const { ip } = await clientInfo();
  const limit = await rateLimit(`readiness:${ip}`, 10, 3600);
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
