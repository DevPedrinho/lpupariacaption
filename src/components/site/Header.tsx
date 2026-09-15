'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { mainNav } from '@/lib/navigation'
import { Icon } from '@/components/ui/Icon'
import { ButtonLink } from '@/components/ui/Button'
import { Logo } from './Logo'
import { WhatsAppCta } from './WhatsAppCta'
import { useCompare } from './CompareProvider'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { slugs } = useCompare()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Ir para o conteúdo
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled || open
            ? 'border-b border-ink-700/60 bg-ink-950/88 backdrop-blur-xl'
            : 'border-b border-transparent',
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-18">
          <Logo />

          <nav aria-label="Navegação principal" className="hidden items-center gap-0.5 lg:flex">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-[0.9375rem] transition-colors',
                    active ? 'text-white' : 'text-ink-300 hover:text-white',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            {slugs.length > 0 && (
              <Link
                href="/comparador"
                className="hidden items-center gap-1.5 rounded-lg border border-ink-600/70 px-3 py-2 text-sm text-ink-200 transition-colors hover:border-ink-500 hover:text-white md:inline-flex"
              >
                <Icon name="compare" className="size-4" />
                Comparar
                <span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-brand-500 text-2xs font-semibold text-ink-950">
                  {slugs.length}
                </span>
              </Link>
            )}

            {/* Os invólucros controlam a visibilidade: aplicar `hidden` direto no
                botão conflita com o `inline-flex` da sua classe base. */}
            <span className="hidden md:inline-flex">
              <ButtonLink href="/encontre-sua-configuracao" variant="secondary" size="sm">
                Encontrar configuração
              </ButtonLink>
            </span>

            {/* Em telas estreitas o CTA vira apenas o ícone, para não competir
                com o botão de menu. */}
            <span className="sm:hidden">
              <WhatsAppCta
                context={{ kind: 'header' }}
                size="sm"
                className="w-10 px-0"
                hideIcon
              >
                <Icon name="whatsapp" className="size-4" />
                <span className="sr-only">Falar com um especialista pelo WhatsApp</span>
              </WhatsAppCta>
            </span>

            <span className="hidden sm:inline-flex">
              <WhatsAppCta context={{ kind: 'header' }} size="sm">
                WhatsApp
              </WhatsAppCta>
            </span>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-ink-600/70 text-ink-100 lg:hidden"
            >
              <Icon name={open ? 'close' : 'menu'} className="size-5" />
            </button>
          </div>
        </div>

        <div
          id="menu-mobile"
          hidden={!open}
          className="border-t border-ink-700/60 bg-ink-950/97 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Navegação principal (celular)" className="container-page flex flex-col gap-1 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base text-ink-100 transition-colors hover:bg-white/6 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2.5">
              <ButtonLink href="/encontre-sua-configuracao" variant="primary" size="md">
                Encontrar minha configuração
              </ButtonLink>
              <WhatsAppCta context={{ kind: 'header' }} size="md">
                Falar com especialista
              </WhatsAppCta>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
