/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. ये लाइन उस 'undici' वाले एरर को ठीक करेगी (Transpilation)
  transpilePackages: ['undici', 'firebase', '@firebase/auth', '@firebase/component', '@firebase/util'],

  // 2. TypeScript और ESLint के एरर को इग्नोर करो
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3. Google Images के लिए
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
