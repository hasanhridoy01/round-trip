/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // <-- uncomment this if you're doing static hosting on Netlify
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // required for static export when using <Image>
  },
};

module.exports = nextConfig;