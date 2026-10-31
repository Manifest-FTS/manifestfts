/**
 * @type {import('next').NextConfig}
 */

// /public assets are not content-hashed, so keep the browser TTL short and let
// Cloudflare hold them longer (purge the zone/path after replacing a file).
const ASSET_CACHE = 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400'

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: ASSET_CACHE }],
      },
      {
        source: '/assets/:path*.mp4',
        headers: [
          { key: 'Cache-Control', value: ASSET_CACHE },
          { key: 'Accept-Ranges', value: 'bytes' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/wp-hosting', // New URL
        destination: '/wordpress-hosting',   // Existing URL path
      },
    ]
  },
}

module.exports = nextConfig
