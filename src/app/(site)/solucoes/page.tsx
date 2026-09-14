import type { Metadata } from 'next'
import Link from 'next/link'
import { getRepository } from '@/lib/repository'
import { Icon, type IconName } from '@/components/ui/Icon'
import { PageHero } from '@/components/site/PageHero'
import { JsonLd } from '@/components/site/JsonLd'
import { FinalCta } from '@/components/home/FinalCta'
import { Section, SectionHeader } from '@/components/ui/Section'
import { breadcrumbSchema } from '@/lib/schema'
import { tierLabel } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Soluções por aplicação',
  description:
    'LLMs locais, machine learning, deep learning, ciência de dados, geração de imagens e vídeo, visão computacional, renderização, engenharia e mais. Veja o dimensionamento indicado para cada aplicação.',
  alternates: { canonical: '/solucoes' },
}

export default async function SolutionsPage() {
  const repo = getRepository()
  const [applications, products] = await Promise.all([repo.listApplications(), repo.listProducts()])

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Soluções', path: '/solucoes' },
        ])}
      />
      <PageHero
        eyebrow="Soluções por aplicação"
        title="O hardware certo depende do que você precisa executar"
        description="Cada aplicação carrega o computador de um jeito diferente. Escolha a sua para entender quais componentes realmente importam, quais são os desafios comuns e quais configurações atendem."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Soluções' }]}
      />

      <Section>
        <div className="container-page">
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => {
              const count = products.filter((product) => product.applications.includes(application.slug)).length
              return (
                <li key={application.slug}>
                  <Link
                    href={`/solucoes/${application.slug}`}
                    className="group flex h-full flex-col gap-3.5 rounded-xl border border-ink-700/70 bg-ink-880/60 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/45"
                  >
                    <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
                      <Icon name={application.icon as IconName} className="size-5" />
                    </span>
                    <h2 className="text-[1.125rem] leading-snug font-medium text-white">{application.name}</h2>
                    <p className="text-sm leading-relaxed text-ink-300">{application.short}</p>

                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-ink-700/60 pt-4 text-xs text-ink-400">
                      <span>
                        {count} {count === 1 ? 'configuração' : 'configurações'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{application.recommendedTiers.map((tier) => tierLabel[tier]).join(' · ')}</span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-flux-300">
                      Ver dimensionamento
                      <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </Section>

      <Section tone="raised">
        <div className="container-page">
          <SectionHeader
            align="center"
            eyebrow="Não encontrou a sua aplicação?"
            title="A lista acima cobre os casos mais comuns, não todos"
            description="Se o seu uso é específico, a conversa direta resolve mais rápido do que qualquer página. Descreva o que você precisa executar."
          />
        </div>
      </Section>

      <FinalCta context={{ kind: 'consultoria' }} />
    </>
  )
}
