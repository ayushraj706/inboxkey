/** @type {import('next').NextConfig} */
const nextConfig = {
  // अगर undici का एरर आए तो यह लाइन उसे शांत कर देगी
  transpilePackages: ['undici', 'firebase'],
  images: {
    domains: ['lh3.googleusercontent.com'], // Google Profile Pic के लिए
  },
};

module.exports = nextConfig;

