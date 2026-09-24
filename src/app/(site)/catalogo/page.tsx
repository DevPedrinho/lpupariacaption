import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getRepository } from '@/lib/repository'
import { CatalogBrowser } from '@/components/catalog/CatalogBrowser'
import { PageHero } from '@/components/site/PageHero'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'
import { FinalCta } from '@/components/home/FinalCta'

export const metadata: Metadata = {
  title: 'Catálogo de computadores para IA',
  description:
    'Workstations, desktops e servidores para IA. Filtre por aplicação, VRAM, placa de vídeo, memória e formato.',
  alternates: { canonical: '/catalogo' },
}

export default async function CatalogPage() {
  const repo = getRepository()
  const [products, applications] = await Promise.all([repo.listProducts(), repo.listApplications()])

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Catálogo', path: '/catalogo' },
        ])}
      />
      <PageHero
        eyebrow="Catálogo"
        title="Configurações prontas para começar a conversa"
        description="Estas são composições que atendem os cenários mais comuns."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Catálogo' }]}
      />

      <div className="pt-10">
        <Suspense fallback={<div className="container-page py-16 text-ink-400">Carregando catálogo…</div>}>
          <CatalogBrowser products={products} applications={applications} />
        </Suspense>
      </div>

      <FinalCta
        title="Não encontrou exatamente o que precisa?"
        description="A maior parte das máquinas que a UPAR entrega é montada sob medida."
        context={{ kind: 'catalogo' }}
      />
    </>
  )
}
