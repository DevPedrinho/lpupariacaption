import Link from 'next/link'
import { getRepository } from '@/lib/repository'
import { Analytics } from '@/components/site/Analytics'
import { CookieConsent } from '@/components/site/CookieConsent'
import { Logo } from '@/components/site/Logo'
import { SiteConfigProvider } from '@/components/site/SiteConfig'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'

/**
 * Casca das páginas de destino: sem menu, sem rodapé de navegação. Quem chega
 * por anúncio tem dois caminhos, WhatsApp ou formulário, e nada que o tire da
 * página. Mensuração e banner de cookies são os mesmos do site.
 */
export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  const settings = await getRepository().getSettings()
  const year = new Date().getFullYear()

  return (
    <SiteConfigProvider value={settings}>
      <header className="border-b border-ink-700/60 bg-ink-950/90 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <WhatsAppCta context={{ kind: 'lp', page: 'cabeçalho' }} size="sm">
            Falar no WhatsApp
          </WhatsAppCta>
        </div>
      </header>

      <main id="conteudo">{children}</main>

      <footer className="border-t border-ink-700/60 bg-ink-950">
        <div className="container-page flex flex-col gap-3 py-8 text-sm text-ink-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.legalName || settings.companyName}
            {settings.cnpj ? ` — CNPJ ${settings.cnpj}` : ''}
            {settings.addressLine ? ` — ${settings.addressLine}` : ''}
            {settings.city ? `, ${settings.city}${settings.state ? `/${settings.state}` : ''}` : ''}.
          </p>
          <nav aria-label="Páginas legais" className="flex flex-wrap gap-4">
            <Link href="/garantia" className="hover:text-white">Política de Garantia</Link>
            <Link href="/politica-de-privacidade" className="hover:text-white">Privacidade</Link>
            <Link href="/" className="hover:text-white">Site completo</Link>
          </nav>
        </div>
      </footer>

      <CookieConsent />
      <Analytics settings={settings} />
    </SiteConfigProvider>
  )
}
