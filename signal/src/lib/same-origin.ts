/**
 * True when a request comes from this site's own pages. Uses the browser's Sec-Fetch-Site
 * header when present, otherwise compares the Origin host with the host the client actually
 * addressed (X-Forwarded-Host / Host, which survive reverse proxies) or the configured site URL.
 * Requests without an Origin header (non-browser clients) are allowed; rate limits still apply.
 */
export function isSameOrigin(request: Request) {
  const site = request.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin' || site === 'none';
  const origin = request.headers.get('origin');
  if (!origin) return true;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const hosts = new Set<string>();
  for (const value of [request.headers.get('x-forwarded-host'), request.headers.get('host')]) {
    for (const h of value?.split(',') ?? []) if (h.trim()) hosts.add(h.trim());
  }
  try {
    if (process.env.NEXT_PUBLIC_SITE_URL) hosts.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).host);
  } catch {}
  return hosts.has(originHost);
}
