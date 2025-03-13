import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  devIndicators: {
    autoPrerender: false,
    middleware: true,
  },

  images: {
    unoptimized: true,  
    disableStaticImages: true, 
    domains: ['example.com', 'fonts.gstatic.com'], 
  },
  
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ]
  },

  webpack: (config, { isServer }) => {
    config.cache = {
      type: 'filesystem',
    };

    config.module.rules.push(
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '/_next/static/fonts/',
            outputPath: 'static/fonts/',
          },
        },
      }
    );

    if (!isServer) {
      config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
        fs: false,
        path: false,
        canvas: false,
        encoding: false,
        bufferutil: false,
        'utf-8-validate': false,

        process: require.resolve('process/browser'),
        util: require.resolve('util/'),
        buffer: require.resolve('buffer/'),
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url/'),
      };

      const webpack = require('webpack');
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.REACT_PDF_CONTAINER': JSON.stringify('div'),
        })
      );
    }

    config.resolve.extensions.push('.ts', '.tsx');

    config.resolve.alias = {
      ...config.resolve.alias,
      fs: false,
      path: false,
    };

    return config;
  },

  images: {
    domains: ['example.com', 'fonts.gstatic.com'], 
  },

  env: {
    CUSTOM_API_KEY: process.env.CUSTOM_API_KEY,
  },
};

export default nextConfig;