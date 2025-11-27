/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.redd.it', 
      'preview.redd.it', 
      'external-preview.redd.it',
      'a.thumbs.redditmedia.com',
      'b.thumbs.redditmedia.com'
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig
