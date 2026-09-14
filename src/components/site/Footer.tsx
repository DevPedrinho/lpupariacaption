'use client'

import Link from 'next/link'
import { footerNav } from '@/lib/navigation'
import { Icon } from '@/components/ui/Icon'
import { Logo } from './Logo'
import { WhatsAppCta } from './WhatsAppCta'
import { useSiteConfig } from './SiteConfig'

export function Footer() {
  const settings = useSiteConfig()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink-700/60 bg-ink-950">
      <div className="container-page py-14 md:py-18">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-300">
              Computadores, workstations e servidores dimensionados para inteligência artificial — com
              consultoria técnica antes da configuração.
            </p>
            <WhatsAppCta context={{ kind: 'geral' }} size="md" className="self-start">
              Falar com especialista
            </WhatsAppCta>

            <dl className="mt-2 flex flex-col gap-2 text-sm text-ink-300">
              {settings.email ? (
                <div className="flex items-center gap-2">
                  <Icon name="mail" className="size-4 text-ink-400" />
                  <dd>{settings.email}</dd>
                </div>
              ) : null}
              {settings.phone ? (
                <div className="flex items-center gap-2">
                  <Icon name="phone" className="size-4 text-ink-400" />
                  <dd>{settings.phone}</dd>
                </div>
              ) : null}
              {settings.addressLine || settings.city ? (
                <div className="flex items-center gap-2">
                  <Icon name="pin" className="size-4 text-ink-400" />
                  <dd>
                    {[settings.addressLine, settings.city, settings.state].filter(Boolean).join(' — ')}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <nav key={group.title} aria-labelledby={`footer-${group.title}`}>
                <h2
                  id={`footer-${group.title}`}
                  className="mb-3.5 text-2xs font-semibold tracking-[0.14em] text-ink-400 uppercase"
                >
                  {group.title}
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-700/60 pt-7 text-sm text-ink-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.legalName || settings.companyName}
            {settings.cnpj ? ` — CNPJ ${settings.cnpj}` : ''}. Todos os direitos reservados.
          </p>
          <p className="text-ink-500">
            As especificações podem ser ajustadas conforme a aplicação e a disponibilidade de componentes.
          </p>
        </div>
      </div>
    </footer>
  )
}
