import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para desarrollo móvil
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.60.11',
    '192.168.60.0/24' // Todo el rango de tu red
  ],
  
  // Configuración de imágenes actualizada
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite todas las imágenes remotas en desarrollo
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development', // Desactiva optimización en desarrollo para mayor velocidad
  },
  
  // Paquetes externos para server components (nueva sintaxis)
  serverExternalPackages: [],
  
  // Configuración CORS para desarrollo
  async headers() {
    return [
      {
        source: '/_next/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' ? '*' : '',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS, HEAD',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  
  // Configuración de webpack para desarrollo
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

export default nextConfig;
