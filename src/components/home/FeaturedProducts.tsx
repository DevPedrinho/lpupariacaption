import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ProductCard } from '@/components/catalog/ProductCard'
import type { Application, Product } from '@/lib/types'

export function FeaturedProducts({
  products,
  applications,
}: {
  products: Product[]
  applications: Pick<Application, 'slug' | 'name'>[]
}) {
  if (products.length === 0) return null

  return (
    <Section id="destaques">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Computadores em destaque"
            title="Configurações que resolvem os cenários mais comuns"
            description="Pontos de partida. Qualquer uma é ajustada à sua aplicação."
          />
          <Link
            href="/catalogo"
            className="inline-flex shrink-0 items-center gap-2 text-[0.9375rem] font-medium text-brand-300 transition-colors hover:text-brand-200"
          >
            Ver catálogo completo
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>

        <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} applications={applications} />
          ))}
        </div>
      </div>
    </Section>
  )
}
