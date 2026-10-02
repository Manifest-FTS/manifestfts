/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/signal/assets': ['./public/signal/**/*', './docs/STYLE_GUIDE.md', './signal.tailwind.js'],
    },
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
