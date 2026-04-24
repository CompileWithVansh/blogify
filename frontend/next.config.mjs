/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Strapi Cloud hosted images
      { protocol: 'https', hostname: '*.strapiapp.com' },
      { protocol: 'https', hostname: '*.media.strapiapp.com' },
      { protocol: 'http',  hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
