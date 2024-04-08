/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // https://github.com/puppeteer/puppeteer/issues/11052#issuecomment-1738988091
    serverComponentsExternalPackages: ['puppeteer-core'],
  }
};

export default nextConfig;
