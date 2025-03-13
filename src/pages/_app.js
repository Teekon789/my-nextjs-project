// _app.js
import "@/styles/globals.css";
import 'tailwindcss/tailwind.css';
import Head from "next/head";

import dynamic from 'next/dynamic';

const ClientOnlyProvider = dynamic(
  () => import('../components/ClientOnlyProvider'),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Approval & Gov Service</title>
        {/* โลโก้ในแท็บเบราว์เซอร์ */}
        <link rel="icon" href="/logo/mn_2.png" type="image/png" />
      </Head>
      <ClientOnlyProvider>
      <Component {...pageProps} />
      </ClientOnlyProvider>
    </>
  );
}
