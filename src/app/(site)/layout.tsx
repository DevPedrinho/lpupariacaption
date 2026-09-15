import { getRepository } from '@/lib/repository'
import { Analytics } from '@/components/site/Analytics'
import { CookieConsent } from '@/components/site/CookieConsent'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { SiteConfigProvider } from '@/components/site/SiteConfig'
import { WhatsAppFab } from '@/components/site/WhatsAppFab'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getRepository().getSettings()

  return (
    <SiteConfigProvider value={settings}>
      <Header />
      <main id="conteudo" className="pt-16 lg:pt-18">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
      <CookieConsent />
      <Analytics settings={settings} />
    </SiteConfigProvider>
  )
}
