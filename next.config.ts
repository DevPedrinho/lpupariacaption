import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Rede de segurança: o padrão é 1 MB e derrubava qualquer envio com anexo.
  // Arquivos grandes não passam mais por action (vão direto ao Storage), mas
  // um formulário com texto longo ou uma imagem pequena precisa de folga.
  experimental: { serverActions: { bodySizeLimit: '4mb' } },
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
