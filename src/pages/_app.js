// _app.js
import "@/styles/globals.css"; // ถ้ามีไฟล์ CSS ที่ต้องใช้ทุกหน้า ควรคงไว้
import 'tailwindcss/tailwind.css';
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
