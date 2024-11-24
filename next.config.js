/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
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
