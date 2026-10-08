import 'server-only';
import { sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';

/**
 * Fixed-window rate limiter stored in Postgres so it holds across instances.
 * Returns { ok, retryAfter } where retryAfter is seconds until the window resets.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const db = await getDb();
  const result = await db.execute<{ count: number; reset_at: string | Date }>(sql`
    insert into rate_limits (key, count, reset_at)
    values (${key}, 1, now() + make_interval(secs => ${windowSeconds}))
    on conflict (key) do update set
      count = case when rate_limits.reset_at < now() then 1 else rate_limits.count + 1 end,
      reset_at = case when rate_limits.reset_at < now() then now() + make_interval(secs => ${windowSeconds}) else rate_limits.reset_at end
    returning count, reset_at
  `);
  const rows = (Array.isArray(result) ? result : (result as unknown as { rows: { count: number; reset_at: string | Date }[] }).rows);
  const row = rows[0]!;
  const retryAfter = Math.max(1, Math.ceil((new Date(row.reset_at).getTime() - Date.now()) / 1000));
  return { ok: Number(row.count) <= limit, retryAfter };
}
