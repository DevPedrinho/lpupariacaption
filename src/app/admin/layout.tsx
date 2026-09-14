import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Painel UPAR AI', template: '%s | Painel UPAR AI' },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ink-950">{children}</div>
}
