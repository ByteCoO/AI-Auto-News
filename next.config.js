/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // 如果您从外部域名加载图片，需要在这里添加
  },
  experimental: {
    serverActions: true,
  },
  serverExternalPackages: ['@remotion/renderer'],
}

module.exports = nextConfig