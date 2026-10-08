import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

// A static CSP that works with Next's inline bootstrap scripts. Tighten to a nonce-based
// policy (see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md)
// if every route can be rendered dynamically.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"} https://plausible.io`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://plausible.io",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com https://billing.stripe.com",
  "object-src 'none'",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  // The parent repository has its own lockfile; pin the root to this app so tracing and
  // the standalone output stay self-contained (Coolify builds with base directory signal/).
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ['@electric-sql/pglite', 'postgres'],
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: { optimizePackageImports: ['lucide-react', 'radix-ui'], authInterrupts: true },
  async headers() {
    return [
      // Everything except embeddable widgets is unframeable.
      { source: '/((?!embed/).*)', headers: securityHeaders },
      {
        source: '/embed/:path*',
        headers: [
          ...securityHeaders.filter((h) => h.key !== 'X-Frame-Options' && h.key !== 'Content-Security-Policy' && h.key !== 'Cross-Origin-Opener-Policy'),
          { key: 'Content-Security-Policy', value: csp.replace("frame-ancestors 'none'", 'frame-ancestors *') },
        ],
      },
      { source: '/app/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/r/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  async redirects() {
    return [
      { source: '/signin', destination: '/login', permanent: true },
      { source: '/register', destination: '/signup', permanent: true },
      { source: '/features/:slug', destination: '/features#:slug', permanent: true },
    ];
  },
};

export default nextConfig;
