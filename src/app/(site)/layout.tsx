import { getRepository } from '@/lib/repository'
import { Analytics } from '@/components/site/Analytics'
import { CompareProvider } from '@/components/site/CompareProvider'
import { CompareTray } from '@/components/site/CompareTray'
import { CookieConsent } from '@/components/site/CookieConsent'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { SiteConfigProvider } from '@/components/site/SiteConfig'
import { WhatsAppFab } from '@/components/site/WhatsAppFab'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const repo = getRepository()
  const [settings, products] = await Promise.all([repo.getSettings(), repo.listProducts()])
  const catalog = products.map((product) => ({ slug: product.slug, name: product.name }))

  return (
    <SiteConfigProvider value={settings}>
      <CompareProvider catalog={catalog}>
        <Header />
        <main id="conteudo" className="pt-16 lg:pt-18">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
        <CompareTray />
        <CookieConsent />
        <Analytics settings={settings} />
      </CompareProvider>
    </SiteConfigProvider>
  )
}
