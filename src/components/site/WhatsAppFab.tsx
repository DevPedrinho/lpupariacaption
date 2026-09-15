'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { track } from '@/lib/analytics'
import { buildWhatsAppMessage, whatsappUrl } from '@/lib/whatsapp'
import { Icon } from '@/components/ui/Icon'
import { useSiteConfig } from './SiteConfig'

/** Botão flutuante discreto, presente em todas as páginas públicas. */
export function WhatsAppFab() {
  const settings = useSiteConfig()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const href = whatsappUrl(
    settings.whatsappNumber,
    buildWhatsAppMessage({ kind: 'geral' }, settings.whatsappGreeting),
  )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click', { origem: 'flutuante', pagina: pathname })}
      aria-label="Falar com um especialista da UPAR pelo WhatsApp"
      className={[
        'fixed right-4 bottom-4 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#1FA855] py-3 pr-4 pl-3.5',
        'text-sm font-medium text-white shadow-[0_12px_32px_-10px_rgb(0_0_0/0.65)] transition-all duration-300',
        'hover:bg-[#199247] md:right-6',
        // Sobe quando a bandeja de comparação está aberta, para não sobrepô-la.
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      ].join(' ')}
    >
      <Icon name="whatsapp" className="size-5" />
      <span className="hidden sm:inline">Falar com especialista</span>
    </a>
  )
}
