import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import { siteUrl } from '@/lib/site-url'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-sora',
})

export const viewport: Viewport = {
  themeColor: '#05070E',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'UPAR AI — Computadores de alta performance para Inteligência Artificial',
    template: '%s | UPAR AI',
  },
  description:
    'Workstations, computadores e servidores dimensionados para IA. Consultoria técnica para encontrar a configuração certa.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'UPAR AI',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  )
}
