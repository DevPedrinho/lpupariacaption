'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Icon, type IconName } from '@/components/ui/Icon'
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

  /*
   * Quatro números, não uma ficha. O detalhe fica nas seções abaixo; aqui é o
   * que decide compra de IA num olhar: placa, VRAM, memória e disco.
   */
  const resumo: { icon: IconName; label: string; value: string; destaque?: boolean }[] = [
    { icon: 'gpu', label: 'Placa de vídeo', value: gpuSummary(product) },
    { icon: 'memory', label: 'VRAM', value: vramSummary(product), destaque: true },
    { icon: 'cpu', label: 'Memória RAM', value: `${formatCapacity(product.ram.capacityGb)} ${product.ram.type}` },
    { icon: 'storage', label: 'Armazenamento', value: storageSummary(product) },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">{tierLabel[product.performanceTier]}</Badge>
        <Badge tone="neutral">{formFactorLabel[product.formFactor]}</Badge>
        <Badge tone={availabilityTone[product.availability]}>{availabilityLabel[product.availability]}</Badge>
        {product.customizable && <Badge tone="flux">Personalizável</Badge>}
      </div>

      <p className="text-[1.125rem] leading-relaxed text-ink-100">{product.tagline}</p>

      <ul className="grid grid-cols-2 gap-2.5">
        {resumo.map((item) => (
          <li
            key={item.label}
            className={cn(
              'flex flex-col gap-1.5 rounded-xl border p-4',
              item.destaque ? 'border-brand-500/35 bg-brand-500/8' : 'border-ink-700/70 bg-ink-880/60',
            )}
          >
            <span className="flex items-center gap-2 text-xs text-ink-400">
              <Icon name={item.icon} className={cn('size-4', item.destaque ? 'text-brand-300' : 'text-flux-400')} />
              {item.label}
            </span>
            <span className={cn('text-[0.9375rem] leading-snug font-medium', item.destaque ? 'text-brand-200' : 'text-white')}>
              {item.value}
            </span>
          </li>
        ))}
      </ul>

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
