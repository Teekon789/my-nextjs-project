// _app.js

import "@/styles/globals.css"; // โหลดไฟล์ CSS อื่น ๆ (ถ้ามี)
import Image from "next/image";
import Head from "next/head";

// กำหนด Image ให้เป็นตัวแปร Global
if (typeof global !== "undefined") {
  global.Image = Image;
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* เพิ่ม meta tag สำหรับ viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}