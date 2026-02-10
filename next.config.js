/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. ESLint (Code checking) की गलतियों को इग्नोर करो
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 2. TypeScript की गलतियों (Type errors) को इग्नोर करो
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3. वो 'undici' और 'firebase' वाला बड़ा एरर ठीक करने के लिए
  transpilePackages: ['undici', 'firebase', '@firebase/auth'],

  // 4. Google की फोटो दिखने के लिए परमिशन
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
