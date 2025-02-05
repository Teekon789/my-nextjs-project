/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  devIndicators: {
    autoPrerender: false,
    middleware: true,
  },
  webpack: (config, { isServer }) => {
    config.cache = {
      type: 'filesystem',
    };

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    if (!isServer) {
      config.resolve.fallback = {
        crypto: false,
        stream: false,
      };
    }

    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
  images: {
    domains: ['example.com'],
  },
  env: {
    CUSTOM_API_KEY: process.env.CUSTOM_API_KEY,
  },
};

export default nextConfig;