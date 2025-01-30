/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // เปิดใช้งาน Strict Mode
  productionBrowserSourceMaps: false, // ปิดการสร้าง source map ใน production

  // การตั้งค่า Dev Indicators เพื่อป้องกันปัญหา HMR
  devIndicators: {
    autoPrerender: false, // ปิดการแสดงผล prerender อัตโนมัติ
  },

  webpack(config) {
    // เปิดใช้งาน caching แบบ filesystem
    config.cache = {
      type: 'filesystem',
    };

    // รองรับไฟล์ .mjs ใน node_modules
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // เพิ่มส่วนขยายไฟล์ที่ webpack รองรับ
    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },

  images: {
    domains: ['example.com'], // ตั้งค่าโดเมนที่อนุญาตให้โหลดรูปภาพ
  },

  env: {
    CUSTOM_API_KEY: process.env.CUSTOM_API_KEY, // ใช้ Environment Variables
  },
};

export default nextConfig;
