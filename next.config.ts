/** @type {import('next').NextConfig} */

import dotenv from 'dotenv'
dotenv.config()

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', // Leave empty for default HTTPS port (443)
        pathname: '/**', // Allow all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '', 
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;