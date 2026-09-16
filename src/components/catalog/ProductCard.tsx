'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { MachineRender } from '@/components/site/MachineRender'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { cn } from '@/lib/cn'
import {
  availabilityLabel, formatCapacity, formFactorLabel, formatPrice, gpuSummary,
  tierLabel, vramSummary,
} from '@/lib/format'
import type { Application, Product } from '@/lib/types'

const availabilityTone = {
  in_stock: 'positive',
  made_to_order: 'brand',
  pre_order: 'caution',
  unavailable: 'neutral',
} as const

export function ProductCard({
  product,
  applications,
  className,
}: {
  product: Product
  applications: Pick<Application, 'slug' | 'name'>[]
  className?: string
}) {
  const appNames = product.applications
    .map((slug) => applications.find((a) => a.slug === slug)?.name)
    .filter(Boolean) as string[]

  const specs: { label: string; value: string }[] = [
    { label: 'Placa de vídeo', value: gpuSummary(product) },
    { label: 'VRAM', value: vramSummary(product) },
    { label: 'Memória', value: `${formatCapacity(product.ram.capacityGb)} ${product.ram.type}` },
  ]

  return (
    <article
      className={cn(
        'group relative isolate flex flex-col overflow-hidden rounded-xl border border-ink-700/70 bg-ink-880/70 transition-colors duration-300 hover:border-ink-500/80',
        // Consulta de contêiner: o rodapé se adapta à largura do card, não da tela.
        '@container',
        className,
      )}
    >
      <div className="relative isolate overflow-hidden border-b border-ink-700/60 bg-linear-to-b from-ink-850 to-ink-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-45 grid-mesh [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        />
        <div className="px-6 py-5">
          <div className="mx-auto h-44 w-36 transition-transform duration-500 group-hover:scale-[1.035]">
            <MachineRender
              variant={product.images[0]?.render ?? 'tower-glass'}
              gpuCount={product.gpu.quantity}
              compact
            />
          </div>
        </div>

        <div className="absolute top-3.5 left-3.5 flex flex-col items-start gap-1.5">
          <Badge tone="brand">{tierLabel[product.performanceTier]}</Badge>
          {product.isDemo && <Badge tone="demo">Dado demonstrativo</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-2xs tracking-[0.1em] text-ink-400 uppercase">
            <span>{formFactorLabel[product.formFactor]}</span>
            {product.customizable && (
              <>
                <span aria-hidden="true">·</span>
                <span>Personalizável</span>
              </>
            )}
          </div>
          <h3 className="text-lg leading-snug font-semibold">
            {/* Link esticado: um único link nomeado torna o card inteiro clicável
                sem criar destinos duplicados para leitores de tela. */}
            <Link
              href={`/produtos/${product.slug}`}
              className="transition-colors after:absolute after:inset-0 after:z-10 after:content-[''] hover:text-flux-300"
            >
              {product.name}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-ink-300">{product.tagline}</p>
        </div>

        {appNames.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {appNames.slice(0, 3).map((name) => (
              <li
                key={name}
                className="rounded-md bg-white/5 px-2 py-1 text-2xs text-ink-200 ring-1 ring-white/8 ring-inset"
              >
                {name}
              </li>
            ))}
            {appNames.length > 3 && (
              <li className="rounded-md px-2 py-1 text-2xs text-ink-400">+{appNames.length - 3}</li>
            )}
          </ul>
        )}

        <dl className="flex flex-col gap-1.5 border-t border-ink-700/60 pt-4 text-sm">
          {specs.map((spec) => (
            <div key={spec.label} className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-ink-400">{spec.label}</dt>
              <dd className="text-right text-ink-100">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-col gap-3.5 border-t border-ink-700/60 pt-4">
          <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
            <div>
              <p className="text-[1.0625rem] font-semibold text-white">
                {formatPrice(product.priceMode, product.priceBrl)}
              </p>
              <p className="mt-0.5 text-xs text-ink-400">
                {product.isDemo && product.priceMode !== 'on_request'
                  ? 'Valor demonstrativo — confirmado pelo especialista'
                  : 'Valor confirmado pelo especialista'}
              </p>
            </div>
            <Badge tone={availabilityTone[product.availability]}>
              {availabilityLabel[product.availability]}
            </Badge>
          </div>

          <div className="flex flex-col gap-2 @[22rem]:flex-row">
            <Link
              href={`/produtos/${product.slug}`}
              className="relative z-20 inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-ink-600/70 bg-ink-800/70 px-4 text-[0.9375rem] font-medium text-ink-50 transition-colors hover:border-ink-500 hover:bg-ink-700/80"
            >
              Analisar computador
              <Icon name="arrowRight" className="size-4" />
            </Link>
            <WhatsAppCta
              context={{ kind: 'produto', product, application: appNames[0] }}
              size="md"
              className="relative z-20 flex-1"
            >
              Solicitar orçamento
            </WhatsAppCta>
          </div>
        </div>
      </div>
    </article>
  )
}
