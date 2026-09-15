'use client'

import { useEffect, useState } from 'react'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
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
        'bottom-0',
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
