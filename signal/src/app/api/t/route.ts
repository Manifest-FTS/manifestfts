import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/lib/db';
import { clientInfo } from '@/lib/auth/session';
import { sha256 } from '@/lib/auth/tokens';
import { classifyLanding } from '@/lib/traffic';
import { newId } from '@/lib/utils';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type' };
const body = z.object({ k: z.string().regex(/^sg_[A-Za-z0-9_-]{16,40}$/), r: z.string().max(2048), p: z.string().max(1024), u: z.string().max(200).nullish(), h: z.string().max(253) });

// Small in-process caches: workspace lookup by key and a per-IP burst limit.
const keys = new Map<string, { id: string; domain: string; at: number } | null>();
const bursts = new Map<string, { n: number; reset: number }>();

async function workspaceFor(key: string) {
  const hit = keys.get(key);
  if (hit !== undefined && (!hit || Date.now() - hit.at < 300_000)) return hit;
  const db = await getDb();
  const [ws] = await db.select({ id: schema.workspaces.id, domain: schema.workspaces.domain }).from(schema.workspaces).where(eq(schema.workspaces.trackingKey, key)).limit(1);
  const value = ws ? { ...ws, at: Date.now() } : null;
  if (keys.size > 5000) keys.clear();
  keys.set(key, value);
  return value;
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request: Request) {
  const done = new Response(null, { status: 204, headers: CORS });
  try {
    const parsed = body.safeParse(JSON.parse(await request.text()));
    if (!parsed.success) return done;
    const { k, r, p, u, h } = parsed.data;
    const { ip, userAgent } = await clientInfo();
    if (/bot|crawler|spider|headless/i.test(userAgent ?? '')) return done;

    const now = Date.now();
    const b = bursts.get(ip);
    if (b && b.reset > now && b.n >= 60) return done;
    bursts.set(ip, b && b.reset > now ? { n: b.n + 1, reset: b.reset } : { n: 1, reset: now + 60_000 });
    if (bursts.size > 20_000) bursts.clear();

    const ws = await workspaceFor(k);
    if (!ws) return done;
    // Only count landings on the workspace's own domain, so a copied key cannot pollute data.
    const host = h.toLowerCase().replace(/^www\./, '');
    if (host !== ws.domain && !host.endsWith(`.${ws.domain}`)) return done;

    const landing = classifyLanding(r, u, ws.domain);
    if (!landing) return done;
    const day = new Date().toISOString().slice(0, 10);
    const db = await getDb();
    await db.insert(schema.trafficEvents).values({
      id: newId('trf'), workspaceId: ws.id, source: landing.source, referrerHost: landing.host,
      landingPath: p.split('?')[0]!.slice(0, 300) || '/', visitorHash: sha256(`${day}|${ws.id}|${ip}|${userAgent ?? ''}|${process.env.AUTH_SECRET ?? 'dev'}`).slice(0, 32),
      dataSource: 'live',
    });
  } catch {
    // Never surface errors to third-party pages.
  }
  return done;
}
