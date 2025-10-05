import type { AppProps } from 'next/app';
import Head from 'next/head';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';
import '../styles/globals.css';

// Google Analytics (opcional)
// const GA_TRACKING_ID = 'G-XXXXXXXXXX';

function MyApp({ Component, pageProps }: AppProps) {
 //  const router = useRouter();

  // useEffect(() => {
  //   const handleRouteChange = (url: string) => {
  //     // Google Analytics pageview
  //     if (typeof window.gtag === 'function') {
  //       window.gtag('config', GA_TRACKING_ID, {
  //         page_path: url,
  //       });
  //     }
  //   };

  //   router.events.on('routeChangeComplete', handleRouteChange);
  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange);
  //   };
  // }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        

      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;