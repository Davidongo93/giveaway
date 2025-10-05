import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
                {/* Preload crítico */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" as="style" />
        {/* Preconnect para fuentes y APIs externas */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Meta tags esenciales para SEO */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="description" content="Plataforma de apoyo mutuo online - Participa en actividades emocionantes y gana premios." />
        
        {/* Favicon y Apple Touch Icon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Open Graph básico */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rifas Online" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Una manito",
              "description": "Plataforma de apoyo mutuo online - Participa en actividades y sorteos emocionantes",
              "url": "https://unamanu.space",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://unamanu.space/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}