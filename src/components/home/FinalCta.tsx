'use client'

import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import type { WhatsAppContext } from '@/lib/whatsapp'

export function FinalCta({
  title = 'Converse com quem entende sua aplicação',
  description = 'Descreva o que você precisa executar. A partir daí, indicamos a configuração proporcional à sua operação — sem sobra desnecessária e sem falta que trave o projeto.',
  context = { kind: 'geral' },
  showDiagnostic = true,
}: {
  title?: string
  description?: string
  context?: WhatsAppContext
  showDiagnostic?: boolean
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-ink-700/60 py-18 md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 grid-mesh opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-1/2 -z-10 h-[34rem] w-[64rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(55,219,154,0.3), rgba(130,208,228,0.1) 45%, transparent 70%)',
        }}
      />

      <div className="container-page flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-[1.85rem] leading-[1.14] font-semibold md:text-[2.5rem]">{title}</h2>
        <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-ink-300">{description}</p>

        <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <WhatsAppCta context={context} size="lg">
            Falar no WhatsApp agora
          </WhatsAppCta>
          {showDiagnostic && (
            <ButtonLink href="/encontre-sua-configuracao" variant="secondary" size="lg">
              Responder o diagnóstico
              <Icon name="arrowRight" />
            </ButtonLink>
          )}
        </div>

        <p className="text-sm text-ink-400">
          Atendimento consultivo, sem compromisso de compra.
        </p>
      </div>
    </section>
  )
}
