import 'server-only';
import { lookup } from 'node:dns';
import { isIP } from 'node:net';
import { Agent, fetch as undiciFetch } from 'undici';

// Guards server-side fetches of user-supplied URLs against SSRF: only public http(s) hosts on
// standard ports, every resolved address re-checked at connect time (defeats DNS rebinding),
// redirects followed manually and re-validated, with tight time and size limits.

export class UnsafeUrlError extends Error {}

function ipv4ToInt(ip: string) {
  return ip.split('.').reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
}

const BLOCKED_V4: [string, number][] = [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16],
  ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15],
  ['198.51.100.0', 24], ['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4],
];

export function isPrivateAddress(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) {
    const value = ipv4ToInt(ip);
    return BLOCKED_V4.some(([base, bits]) => {
      const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
      return (value & mask) === (ipv4ToInt(base) & mask);
    });
  }
  if (version === 6) {
    const lower = ip.toLowerCase();
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateAddress(mapped[1]!);
    return lower === '::' || lower === '::1' || /^f[cd]/.test(lower) || /^fe[89ab]/.test(lower) || lower.startsWith('ff') || lower.startsWith('2001:db8') || lower.startsWith('64:ff9b');
  }
  return true;
}

export function assertSafeUrl(input: string) {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new UnsafeUrlError('Enter a valid URL, for example https://example.com');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new UnsafeUrlError('Only http and https URLs can be checked.');
  if (url.username || url.password) throw new UnsafeUrlError('URLs with credentials are not supported.');
  if (url.port && url.port !== '80' && url.port !== '443') throw new UnsafeUrlError('Only standard web ports (80 and 443) can be checked.');
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (isIP(host) || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal') || !host.includes('.')) {
    throw new UnsafeUrlError('Enter a public domain name rather than an IP address or internal host.');
  }
  return url;
}

const agent = new Agent({
  connect: {
    lookup(hostname, options, callback) {
      lookup(hostname, { ...options, all: true }, (error, addresses) => {
        if (error) return callback(error, '', 0);
        const list = (Array.isArray(addresses) ? addresses : [addresses]) as { address: string; family: number }[];
        const unsafe = list.find((a) => isPrivateAddress(a.address));
        if (!list.length || unsafe) return callback(new UnsafeUrlError('That host resolves to a private or reserved network address.'), '', 0);
        if ((options as { all?: boolean }).all) return (callback as unknown as (e: null, a: typeof list) => void)(null, list);
        callback(null, list[0]!.address, list[0]!.family);
      });
    },
  },
  headersTimeout: 15_000,
  bodyTimeout: 15_000,
});

export interface SafeResponse {
  url: string;
  status: number;
  headers: Headers;
  body: string;
  ms: number;
  redirects: number;
}

const USER_AGENT = 'ManifestSignalBot/1.0 (+https://signal.manifestfts.com/docs/readiness-checks)';

export async function safeFetch(input: string, { maxBytes = 1_500_000, maxRedirects = 4, timeoutMs = 15_000, accept = 'text/html,*/*;q=0.8' } = {}): Promise<SafeResponse> {
  let url = assertSafeUrl(input);
  const started = Date.now();
  for (let redirects = 0; ; redirects++) {
    const response = await undiciFetch(url, {
      dispatcher: agent,
      redirect: 'manual',
      headers: { 'user-agent': USER_AGENT, accept },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
      await response.body?.cancel();
      if (redirects >= maxRedirects) throw new UnsafeUrlError('Too many redirects.');
      url = assertSafeUrl(new URL(response.headers.get('location')!, url).toString());
      continue;
    }
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) {
          await reader.cancel();
          break;
        }
        chunks.push(value);
      }
    }
    return {
      url: url.toString(),
      status: response.status,
      headers: response.headers as unknown as Headers,
      body: Buffer.concat(chunks).toString('utf8'),
      ms: Date.now() - started,
      redirects,
    };
  }
}

/** POSTs JSON to a user-supplied public URL with the same SSRF protections. Redirects are not followed. */
export async function safePostJson(input: string, body: unknown, headers: Record<string, string> = {}, timeoutMs = 8000) {
  const url = assertSafeUrl(input);
  if (url.protocol !== 'https:') throw new UnsafeUrlError('Webhook URLs must use https.');
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  const response = await undiciFetch(url, {
    dispatcher: agent,
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': 'application/json', 'user-agent': USER_AGENT, ...headers },
    body: payload,
    signal: AbortSignal.timeout(timeoutMs),
  });
  await response.body?.cancel();
  return { status: response.status, ok: response.status >= 200 && response.status < 300 };
}
