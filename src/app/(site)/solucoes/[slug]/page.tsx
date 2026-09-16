import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRepository } from '@/lib/repository'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { PageHero } from '@/components/site/PageHero'
import { JsonLd } from '@/components/site/JsonLd'
import { ProductCard } from '@/components/catalog/ProductCard'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { FinalCta } from '@/components/home/FinalCta'
import { ButtonLink } from '@/components/ui/Button'
import { breadcrumbSchema } from '@/lib/schema'
import { tierLabel } from '@/lib/format'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const applications = await getRepository().listApplications()
    return applications.map((application) => ({ slug: application.slug }))
  } catch (error) {
    console.warn('generateStaticParams (soluções) indisponível:', error)
    return []
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const application = await getRepository().getApplication(slug)
  if (!application) return { title: 'Solução não encontrada' }
  return {
    title: application.seoTitle ?? application.name,
    description: application.seoDescription ?? application.short,
    alternates: { canonical: `/solucoes/${application.slug}` },
  }
}

export default async function SolutionPage({ params }: Params) {
  const { slug } = await params
  const repo = getRepository()
  const application = await repo.getApplication(slug)
  if (!application || application.status !== 'published') notFound()

  const [products, applications] = await Promise.all([
    repo.listProducts({ application: application.slug }),
    repo.listApplications(),
  ])
  const appIndex = applications.map(({ slug: s, name }) => ({ slug: s, name }))
  const maxWeight = 5

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Soluções', path: '/solucoes' },
          { name: application.name, path: `/solucoes/${application.slug}` },
        ])}
      />

      <PageHero
        eyebrow="Solução por aplicação"
        title={application.name}
        description={application.intro}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: application.name },
        ]}
        actions={
          <>
            <WhatsAppCta context={{ kind: 'aplicacao', application: application.name }} size="lg">
              Falar com especialista
            </WhatsAppCta>
            <ButtonLink href="/encontre-sua-configuracao" variant="secondary" size="lg">
              Fazer o diagnóstico
            </ButtonLink>
          </>
        }
      />

      <Section>
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-7">
            <h2 className="flex items-center gap-2.5 text-xl font-semibold text-white">
              <Icon name="users" className="size-5 text-flux-400" />
              Para quem é indicada
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {application.whoFor.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-200">
                  <Icon name="check" className="mt-1 size-4 shrink-0 text-flux-400" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7 border-t border-ink-700/60 pt-5">
              <h3 className="text-sm font-medium text-white">Categorias indicadas</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {application.recommendedTiers.map((tier) => (
                  <li
                    key={tier}
                    className="rounded-full bg-brand-500/12 px-3 py-1 text-sm text-brand-200 ring-1 ring-brand-500/25 ring-inset"
                  >
                    {tierLabel[tier]}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-2.5 text-xl font-semibold text-white">
              <Icon name="info" className="size-5 text-flux-400" />
              Principais desafios de hardware
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {application.challenges.slice(0, 2).map((challenge) => (
                <li key={challenge.title} className="rounded-xl border border-ink-700/70 bg-ink-880/40 p-5">
                  <h3 className="text-[1.0625rem] font-medium text-white">{challenge.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{challenge.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <div className="container-page">
          <SectionHeader
            eyebrow="Prioridades técnicas"
            title="Onde o investimento faz mais diferença nesta aplicação"
            description="O peso de cada componente muda conforme o uso."
          />

          <ul className="mt-10 flex flex-col gap-4">
            {application.components.slice(0, 3).map((component) => (
              <li
                key={component.component}
                className="grid gap-3 rounded-xl border border-ink-700/70 bg-ink-880/50 p-5 md:grid-cols-[13rem_1fr] md:items-start md:gap-6"
              >
                <div>
                  <h3 className="text-[1.0625rem] font-medium text-white">{component.component}</h3>
                  <div
                    className="mt-2.5 flex gap-1"
                    role="img"
                    aria-label={`Importância ${component.weight} de ${maxWeight}`}
                  >
                    {Array.from({ length: maxWeight }).map((_, index) => (
                      <span
                        key={index}
                        className={
                          index < component.weight
                            ? 'h-1.5 w-8 rounded-full bg-linear-to-r from-brand-500 to-flux-400'
                            : 'h-1.5 w-8 rounded-full bg-ink-700'
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-ink-300">{component.why}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {products.length > 0 && (
        <Section>
          <div className="container-page">
            <SectionHeader
              eyebrow="Configurações recomendadas"
              title={`Computadores dimensionados para ${application.name.toLowerCase()}`}
              description="Pontos de partida do catálogo. Todos podem ser ajustados à sua realidade."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 2).map((product) => (
                <ProductCard key={product.id} product={product} applications={appIndex} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section tone="raised">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeader
            eyebrow="Crescimento"
            title="Possibilidades de expansão"
            description="Um bom projeto considera o próximo passo. Veja o que costuma ser ampliado nesta aplicação."
          />
          <ul className="flex flex-col gap-3">
            {application.expansion.slice(0, 3).map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-ink-700/70 bg-ink-880/50 px-5 py-4 text-[0.9375rem] text-ink-200"
              >
                <Icon name="upgrade" className="mt-0.5 size-4 shrink-0 text-flux-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta
        title={`Vamos dimensionar a sua máquina para ${application.name.toLowerCase()}?`}
        description="Conte quais programas e modelos você usa. A partir daí montamos uma configuração proporcional ao seu volume de trabalho."
        context={{ kind: 'aplicacao', application: application.name }}
      />
    </>
  )
}
