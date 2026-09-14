'use client'

import { useEffect, useState } from 'react'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { useCompare } from '@/components/site/CompareProvider'
import { Icon } from '@/components/ui/Icon'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { Product } from '@/lib/types'

/** Barra fixa com o CTA principal, visível depois que o topo da página sai da tela. */
export function ProductStickyCta({
  product,
  applicationName,
}: {
  product: Product
  applicationName?: string
}) {
  const [visible, setVisible] = useState(false)
  const { isSelected, toggle, isFull, entries } = useCompare()
  const selected = isSelected(product.slug)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 620)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 z-45 border-t border-ink-600/70 bg-ink-900/97 backdrop-blur-xl transition-transform duration-300',
        entries.length > 0 ? 'bottom-[4.5rem]' : 'bottom-0',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{product.name}</p>
          <p className="truncate text-xs text-ink-400">
            {formatPrice(product.priceMode, product.priceBrl)}
            {product.isDemo && product.priceMode !== 'on_request' ? ' · valor demonstrativo' : ''}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => toggle(product.slug)}
            disabled={!selected && isFull}
            aria-pressed={selected}
            className={cn(
              'hidden h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors sm:inline-flex',
              selected
                ? 'border-brand-500 bg-brand-500/15 text-brand-200'
                : 'border-ink-600/70 text-ink-100 hover:border-ink-500',
              !selected && isFull && 'cursor-not-allowed opacity-40',
            )}
          >
            <Icon name={selected ? 'check' : 'compare'} className="size-4" />
            {selected ? 'Na comparação' : 'Comparar'}
          </button>
          <WhatsAppCta
            context={{ kind: 'produto', product, application: applicationName }}
            size="md"
          >
            <span className="hidden sm:inline">Validar com um especialista</span>
            <span className="sm:hidden">Falar agora</span>
          </WhatsAppCta>
        </div>
      </div>
    </div>
  )
}
