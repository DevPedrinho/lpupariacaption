import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRepository } from '@/lib/repository'
import { LANDING_LABELS, LANDING_SLUGS, defaultLandingPages } from '@/data/landing'
import { consultingSteps } from '@/data/process'
import type { LandingSlug } from '@/lib/types'
import { Icon } from '@/components/ui/Icon'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CaseStudies } from '@/components/home/CaseStudies'
import { FaqSection } from '@/components/home/FaqSection'
import { LeadForm } from '@/components/forms/LeadForm'

type Params = { params: Promise<{ slug: string }> }

function isLandingSlug(slug: string): slug is LandingSlug {
  return (LANDING_SLUGS as string[]).includes(slug)
}

export function generateStaticParams() {
  return LANDING_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  if (!isLandingSlug(slug)) return { title: 'Página não encontrada' }
  const settings = await getRepository().getSettings()
  const copy = settings.landingPages?.[slug] ?? defaultLandingPages[slug]
  return {
    title: copy.title,
    description: copy.subtitle,
    alternates: { canonical: `/lp/${slug}` },
    openGraph: { title: copy.title, description: copy.subtitle, url: `/lp/${slug}` },
  }
}

/** Etapas que cabem numa página de destino: entender, dimensionar, montar e testar. */
const ETAPAS = [consultingSteps[0], consultingSteps[2], consultingSteps[5]]

export default async function LandingPage({ params }: Params) {
  const { slug } = await params
  if (!isLandingSlug(slug)) notFound()

  const repo = getRepository()
  const [settings, products, applications, faqs] = await Promise.all([
    repo.getSettings(),
    repo.listProducts(),
    repo.listApplications(),
    repo.listFaqs('home'),
  ])
  const copy = settings.landingPages?.[slug] ?? defaultLandingPages[slug]
  const appIndex = applications.map(({ slug, name }) => ({ slug, name }))
  const pagina = LANDING_LABELS[slug]

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-ink-700/60">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 grid-mesh opacity-40" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-56 left-1/2 -z-10 h-[32rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(55,219,154,0.26), rgba(130,208,228,0.09) 45%, transparent 70%)',
          }}
        />
        <div className="container-page grid gap-10 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="text-2xs font-semibold tracking-[0.16em] text-flux-300 uppercase">{copy.eyebrow}</span>
            <h1 className="mt-4 text-[2rem] leading-[1.1] font-semibold text-white md:text-[2.75rem]">{copy.title}</h1>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300">{copy.subtitle}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppCta context={{ kind: 'lp', page: pagina }} size="lg">
                {copy.ctaLabel}
              </WhatsAppCta>
              <ButtonLink href="#formulario" variant="secondary" size="lg">
                Pedir contato por formulário
              </ButtonLink>
            </div>
            {copy.note && <p className="mt-4 text-sm text-ink-400">{copy.note}</p>}
          </div>

          <ul className="flex flex-col gap-2.5 rounded-2xl border border-ink-700/70 bg-ink-880/60 p-6">
            {copy.bullets.map((item) => (
              <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-100">
                <Icon name="check" className="mt-1 size-4 shrink-0 text-brand-400" />
                <span>{item}</span>
              </li>
            ))}
            {settings.installmentNote && !copy.bullets.some((b) => b.toLowerCase().includes('sem juros')) && (
              <li className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-100">
                <Icon name="card" className="mt-1 size-4 shrink-0 text-brand-400" />
                <span>{settings.installmentNote}</span>
              </li>
            )}
          </ul>
        </div>
      </section>

      {products.length > 0 && (
        <Section id="configuracoes">
          <div className="container-page">
            <SectionHeader
              eyebrow="Configurações"
              title="Pontos de partida. Qualquer uma é ajustada à sua aplicação."
              description="Preço sob consulta: a proposta sai depois da conversa, com a justificativa de cada componente."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} applications={appIndex} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section tone="raised" id="como-funciona">
        <div className="container-page">
          <SectionHeader eyebrow="Como funciona" title="Três passos até a máquina certa" />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {ETAPAS.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-6">
                <span className="inline-flex size-9 items-center justify-center rounded-full border border-brand-500/40 text-sm font-semibold text-brand-300">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-300">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <CaseStudies cases={settings.caseStudies} />

      <Section id="formulario">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeader
            eyebrow="Fale com um especialista"
            title="Diga o que você precisa rodar. A UPAR responde com a configuração."
            description="Sem compromisso. Se preferir, o WhatsApp é o caminho mais rápido."
          />
          <LeadForm
            applications={appIndex}
            origin="landing"
            compact
            title="Peça o contato de um especialista"
            description="Nome, telefone e a aplicação já bastam para começar."
          />
        </div>
      </Section>

      {faqs.length > 0 && <FaqSection faqs={faqs.slice(0, 4)} />}
    </>
  )
}
