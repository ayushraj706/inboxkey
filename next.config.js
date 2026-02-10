/** @type {import('next').NextConfig} */
const nextConfig = {
  // यह लाइन उस undici वाले एरर को ठीक करेगी
  transpilePackages: ['undici', 'firebase', '@firebase/auth'],
  
  // अगर फ्यूचर में इमेज का एरर आए तो यह काम आएगा
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
