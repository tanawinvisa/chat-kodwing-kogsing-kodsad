import "@/styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>INCOGNITOTALK</title>
        <link rel="icon" href="/logo1.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
