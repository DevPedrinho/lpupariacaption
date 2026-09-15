import type { Metadata } from 'next'
import { getRepository } from '@/lib/repository'
import { ComparatorClient } from '@/components/compare/ComparatorClient'
import { ExternalCompare } from '@/components/compare/ExternalCompare'
import { PageHero } from '@/components/site/PageHero'
import { SectionHeader } from '@/components/ui/Section'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Comparativo: o que você achou × o que a UPAR entrega',
  description:
    'Mande o print do computador que você encontrou em outro site e receba o comparativo com o que muda na configuração dimensionada pela UPAR.',
  alternates: { canonical: '/comparador' },
}

export default async function ComparatorPage() {
  const repo = getRepository()
  const [products, applications, settings] = await Promise.all([
    repo.listProducts(),
    repo.listApplications(),
    repo.getSettings(),
  ])

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Comparador', path: '/comparador' },
        ])}
      />
      <PageHero
        eyebrow="Comparativo"
        title="Traga o computador que você encontrou. A gente compara."
        description="Não elegemos um vencedor por ficha técnica: o computador certo é o que atende o que você precisa executar, não o que tem o maior número em cada linha."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Comparador' }]}
      />
      <ExternalCompare />

      <div className="container-page pt-18 md:pt-24">
        <SectionHeader
          align="center"
          eyebrow="Ou compare por conta"
          title="Coloque até três configurações nossas lado a lado"
          description="Útil para enxergar a diferença entre categorias antes mesmo de falar com alguém."
        />
      </div>
      <div className="pt-10">
        <ComparatorClient products={products} applications={applications} settings={settings} />
      </div>
    </>
  )
}
