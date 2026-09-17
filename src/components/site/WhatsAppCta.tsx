'use client'

import { usePathname } from 'next/navigation'
import { track } from '@/lib/analytics'
import { buildWhatsAppMessage, whatsappUrl, type WhatsAppContext } from '@/lib/whatsapp'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'
import { useSiteConfig } from './SiteConfig'

type Props = {
  context: WhatsAppContext
  children?: React.ReactNode
  className?: string
  variant?: 'whatsapp' | 'secondary' | 'ghost' | 'light'
  size?: 'sm' | 'md' | 'lg'
  hideIcon?: boolean
  'aria-label'?: string
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 ' +
  'whitespace-nowrap select-none active:translate-y-px [&_svg]:shrink-0'

const variants = {
  whatsapp: 'bg-[#1FA855] text-white hover:bg-[#199247] shadow-[0_10px_30px_-14px_rgb(31_168_85/0.9)]',
  secondary: 'bg-ink-800/70 text-ink-50 border border-ink-600/70 hover:bg-ink-700/80 hover:border-ink-500',
  ghost: 'text-ink-200 hover:text-white hover:bg-white/6',
  light: 'bg-ink-900 text-white hover:bg-ink-800',
}

const sizes = {
  sm: 'h-9 px-3.5 text-sm [&_svg]:size-4',
  md: 'h-11 px-5 text-[0.9375rem] [&_svg]:size-[1.05rem]',
  lg: 'h-13 px-6 text-base [&_svg]:size-5',
}

/**
 * Único componente de conversão por WhatsApp do site.
 * A mensagem é montada a partir do contexto da página, e o clique é
 * registrado na camada de mensuração.
 */
export function WhatsAppCta({
  context,
  children = 'Falar com especialista',
  className,
  variant = 'whatsapp',
  size = 'md',
  hideIcon = false,
  'aria-label': ariaLabel,
}: Props) {
  const settings = useSiteConfig()
  const pathname = usePathname()
  const message = buildWhatsAppMessage(context, settings.whatsappGreeting)
  const href = whatsappUrl(settings.whatsappNumber, message)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(base, variants[variant], sizes[size], className)}
      onClick={() =>
        track('whatsapp_click', {
          origem: context.kind,
          pagina: pathname,
          produto: context.kind === 'produto' ? context.product.name : undefined,
        })
      }
    >
      {!hideIcon && <Icon name="whatsapp" />}
      {children}
    </a>
  )
}
