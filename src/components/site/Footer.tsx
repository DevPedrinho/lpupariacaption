'use client'

import Link from 'next/link'
import { footerNav } from '@/lib/navigation'
import { Icon } from '@/components/ui/Icon'
import { Logo } from './Logo'
import { WhatsAppCta } from './WhatsAppCta'
import { useSiteConfig } from './SiteConfig'

/** 5585936180509 -> (85) 93618-0509. Só para exibir; o link usa o número cru. */
function formatarTelefone(digits: string): string {
  const n = digits.replace(/\D/g, '').replace(/^55/, '')
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
  return digits
}

export function Footer() {
  const settings = useSiteConfig()
  const year = new Date().getFullYear()

  const redes = (
    [
      { name: 'instagram', label: 'Instagram', href: settings.instagram },
      { name: 'facebook', label: 'Facebook', href: settings.facebook },
      { name: 'linkedin', label: 'LinkedIn', href: settings.linkedin },
      { name: 'youtube', label: 'YouTube', href: settings.youtube },
    ] as const
  ).filter((rede): rede is typeof rede & { href: string } => Boolean(rede.href))

  return (
    <footer className="border-t border-ink-700/60 bg-ink-950">
      <div className="container-page py-14 md:py-18">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-300">
              Computadores, workstations e servidores dimensionados para IA, com consultoria técnica antes da
              configuração.
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
              {settings.whatsappNumber ? (
                <div className="flex items-center gap-2">
                  <Icon name="whatsapp" className="size-4 text-ink-400" />
                  <dd>WhatsApp {formatarTelefone(settings.whatsappNumber)}</dd>
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

            {redes.length > 0 && (
              <ul className="mt-1 flex items-center gap-2.5" aria-label="Redes sociais">
                {redes.map((rede) => (
                  <li key={rede.name}>
                    <a
                      href={rede.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={rede.label}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-brand-500/45 text-brand-300 transition-colors hover:border-brand-400 hover:bg-brand-500/10 hover:text-brand-200"
                    >
                      <Icon name={rede.name} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
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

        {(settings.paymentMethods.length > 0 || settings.installmentNote) && (
          <div className="mt-10 flex flex-col gap-3 border-t border-ink-700/60 pt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <h2 className="text-2xs font-semibold tracking-[0.14em] text-ink-400 uppercase">Formas de pagamento</h2>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-200">
              {settings.paymentMethods.map((forma) => (
                <li key={forma} className="flex items-center gap-2">
                  <Icon name={/pix/i.test(forma) ? 'pix' : 'card'} className="size-4 text-brand-300" />
                  {forma}
                </li>
              ))}
            </ul>
            {settings.installmentNote && (
              <p className="rounded-lg border border-brand-500/30 bg-brand-500/8 px-3 py-1.5 text-sm text-brand-200">
                {settings.installmentNote}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-ink-700/60 pt-7 text-sm text-ink-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.legalName || settings.companyName}
            {settings.cnpj ? ` — CNPJ ${settings.cnpj}` : ''}
            {settings.stateRegistration ? ` — I.E. ${settings.stateRegistration}` : ''}. Todos os direitos
            reservados.
          </p>
          <p className="text-ink-500">
            Especificações podem variar conforme a aplicação e a disponibilidade de componentes.
          </p>
        </div>
      </div>
    </footer>
  )
}
