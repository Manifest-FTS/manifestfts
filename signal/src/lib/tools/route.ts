import 'server-only';
import { NextResponse } from 'next/server';
import type { z } from 'zod';
import { clientInfo } from '@/lib/auth/session';
import { isSameOrigin } from '@/lib/same-origin';
import { rateLimit } from '@/lib/rate-limit';
import { UnsafeUrlError } from '@/lib/readiness/safe-fetch';

/** Thrown by tool handlers for user-facing errors (bad input, unreachable site). */
export class ToolError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/**
 * Wraps a public tool endpoint: same-origin only, per-IP rate limit in production, schema
 * validation, and JSON errors for every failure path.
 */
export function toolRoute<S extends z.ZodType>(name: string, schema: S, perHour: number, handler: (input: z.infer<S>) => Promise<unknown>) {
  return async function POST(request: Request) {
    try {
      if (!isSameOrigin(request)) return NextResponse.json({ error: 'Cross-origin requests are not allowed.' }, { status: 403 });
      const parsed = schema.safeParse(await request.json().catch(() => null));
      if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Check your input and try again.' }, { status: 400 });
      if (process.env.NODE_ENV === 'production') {
        const { ip } = await clientInfo();
        try {
          const limit = await rateLimit(`tool:${name}:${ip}`, perHour, 3600);
          if (!limit.ok) return NextResponse.json({ error: `You have used this tool several times recently. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.` }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
        } catch (error) {
          console.error(`[tool:${name}] rate limiter unavailable:`, error);
        }
      }
      return NextResponse.json(await handler(parsed.data), { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
      if (error instanceof ToolError) return NextResponse.json({ error: error.message }, { status: error.status });
      if (error instanceof UnsafeUrlError) return NextResponse.json({ error: error.message }, { status: 400 });
      if (error instanceof Error && /timeout|aborted|fetch failed|ENOTFOUND|ECONNREFUSED/i.test(`${error.message} ${(error.cause as Error | undefined)?.message ?? ''}`)) {
        return NextResponse.json({ error: 'We could not reach that site. Check the address and that it is publicly accessible.' }, { status: 502 });
      }
      console.error(`[tool:${name}] unexpected error:`, error);
      const detail = process.env.NODE_ENV !== 'production' && error instanceof Error ? ` (${error.message})` : '';
      return NextResponse.json({ error: `Something went wrong on our side. Please try again.${detail}` }, { status: 500 });
    }
  };
}
