import type { Metadata } from 'next'
import { getRepository } from '@/lib/repository'
import { ComparatorClient } from '@/components/compare/ComparatorClient'
import { PageHero } from '@/components/site/PageHero'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Comparador de computadores para IA',
  description:
    'Compare até três configurações lado a lado: processador, VRAM, memória, armazenamento, expansão e aplicações recomendadas.',
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
        eyebrow="Comparador"
        title="Compare configurações sem perder de vista a sua aplicação"
        description="Colocamos as diferenças em evidência, mas não elegemos um vencedor: o computador certo é o que atende o que você precisa executar, não o que tem o maior número em cada linha."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Comparador' }]}
      />
      <div className="pt-10">
        <ComparatorClient products={products} applications={applications} settings={settings} />
      </div>
    </>
  )
}
