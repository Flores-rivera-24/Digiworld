/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'digimon-api.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'digimon.shadowsmith.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.digimoncard.io',
        port: '',
        pathname: '/**',
      },
      // Permitir cualquier dominio HTTPS 
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
}

module.exports = nextConfig