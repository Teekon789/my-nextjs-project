// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  devIndicators: {
    autoPrerender: false,
    middleware: true,
  },
  
  // เพิ่ม headers สำหรับการเข้าถึงฟอนต์
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
    // คงการตั้งค่า cache เดิม
    config.cache = {
      type: 'filesystem',
    };

    // เพิ่ม rules สำหรับ .mjs
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // เพิ่ม rules สำหรับไฟล์ฟอนต์
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/_next/static/fonts/',
          outputPath: 'static/fonts/'
        }
      }
    });

    // ตั้งค่า fallback สำหรับ client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        fs: false,
        path: false,
        canvas: false,
        encoding: false,
        bufferutil: false,
        'utf-8-validate': false,
      };
    }

    // เพิ่ม extensions
    config.resolve.extensions.push('.ts', '.tsx');

    // เพิ่ม alias สำหรับ react-pdf
    config.resolve.alias = {
      ...config.resolve.alias,
      'fs': false,
      'path': false,
    };

    return config;
  },

  // อนุญาตให้โหลดฟอนต์จากโดเมนภายนอก
  images: {
    domains: ['example.com', 'fonts.gstatic.com'], // เพิ่ม fonts.gstatic.com สำหรับ Google Fonts
  },

  env: {
    CUSTOM_API_KEY: process.env.CUSTOM_API_KEY,
  },
};

export default nextConfig;