'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import {
  availabilityLabel, formatCapacity, formatPrice, formFactorLabel, gpuSummary, storageSummary,
  tierLabel, vramSummary,
} from '@/lib/format'
import type { Product } from '@/lib/types'

const availabilityTone = {
  in_stock: 'positive',
  made_to_order: 'brand',
  pre_order: 'caution',
  unavailable: 'neutral',
} as const

export function ProductBuyBox({
  product,
  applicationName,
}: {
  product: Product
  applicationName?: string
}) {

  useEffect(() => {
    track('view_item', {
      produto: product.name,
      slug: product.slug,
      categoria: tierLabel[product.performanceTier],
      formato: formFactorLabel[product.formFactor],
    })
  }, [product.name, product.slug, product.performanceTier, product.formFactor])

  const quickSpecs = [
    { label: 'Processador', value: `${product.cpu.model} · ${product.cpu.cores}C/${product.cpu.threads}T` },
    { label: 'Placa de vídeo', value: gpuSummary(product) },
    { label: 'VRAM', value: vramSummary(product), emphasis: true },
    { label: 'Memória RAM', value: `${formatCapacity(product.ram.capacityGb)} ${product.ram.type}` },
    { label: 'Armazenamento', value: storageSummary(product) },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">{tierLabel[product.performanceTier]}</Badge>
        <Badge tone="neutral">{formFactorLabel[product.formFactor]}</Badge>
        <Badge tone={availabilityTone[product.availability]}>{availabilityLabel[product.availability]}</Badge>
        {product.customizable && <Badge tone="flux">Personalizável</Badge>}
      </div>

      <div>
        <p className="text-[1.0625rem] leading-relaxed text-ink-200">{product.tagline}</p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-300">{product.summary}</p>
      </div>

      <dl className="flex flex-col gap-2.5 rounded-xl border border-ink-700/70 bg-ink-880/60 p-5 text-sm">
        {quickSpecs.map((spec) => (
          <div key={spec.label} className="flex items-baseline justify-between gap-4">
            <dt className="shrink-0 text-ink-400">{spec.label}</dt>
            <dd className={cn('text-right', spec.emphasis ? 'font-medium text-flux-300' : 'text-ink-100')}>
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-4 rounded-xl border border-ink-700/70 bg-linear-to-br from-ink-880 to-ink-900 p-5">
        <div>
          <p className="text-2xl font-semibold text-white">
            {formatPrice(product.priceMode, product.priceBrl)}
          </p>
          <p className="mt-1 text-sm text-ink-400">
            {product.isDemo && product.priceMode !== 'on_request'
              ? 'Valor demonstrativo. O investimento final depende da configuração definida com o especialista.'
              : 'O investimento final depende da configuração definida com o especialista.'}
          </p>
          {product.leadTime && <p className="mt-2 text-sm text-ink-300">{product.leadTime}</p>}
        </div>

        <div className="flex flex-col gap-2.5">
          <WhatsAppCta
            context={{ kind: 'produto', product, application: applicationName }}
            size="lg"
            className="w-full"
          >
            {/* O rótulo longo não cabe em telas estreitas e o botão não quebra linha. */}
            <span className="sm:hidden">Validar com especialista</span>
            <span className="hidden sm:inline">Validar esta configuração no WhatsApp</span>
          </WhatsAppCta>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/comparativo"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-ink-600/70 bg-ink-800/60 px-4 text-[0.9375rem] font-medium text-ink-50 transition-colors hover:border-ink-500"
            >
              <Icon name="compare" className="size-4" />
              Comparar com outro
            </Link>
            <Link
              href="/encontre-sua-configuracao"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-ink-600/70 bg-ink-800/60 px-4 text-[0.9375rem] font-medium text-ink-50 transition-colors hover:border-ink-500"
            >
              <Icon name="spark" className="size-4" />
              Ver se é para mim
            </Link>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-ink-400">
          Atendimento consultivo. Um especialista confere se esta configuração atende a sua aplicação antes
          de qualquer proposta.
        </p>
      </div>
    </div>
  )
}
