'use client'

import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'

const PROMISES = [
  'Sem compromisso de compra',
  'Você fala direto com quem dimensiona',
  'Atendemos pessoa física, empresa e instituição',
]

/**
 * Faixa de conversão no meio da página.
 *
 * Existe porque o visitante entende o problema logo no começo da home e, nesse
 * momento, já está pronto para conversar — esperar o CTA do rodapé perde gente
 * no caminho. A promessa é só a consultoria: nada de prazo de resposta ou de
 * entrega, que dependem da equipe e não podem ser prometidos aqui.
 */
export function ConsultingCta() {
  return (
    <Section>
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-3xl border border-brand-500/30 bg-ink-880 px-6 py-10 md:px-12 md:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-24 -z-10 size-[28rem] rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle at center, rgba(55,219,154,0.22), rgba(130,208,228,0.07) 45%, transparent 70%)',
            }}
          />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-500/35 bg-brand-500/10 px-3.5 py-1.5 text-2xs font-semibold tracking-[0.12em] text-brand-300 uppercase">
                <Icon name="spark" className="size-3.5" />
                Consultoria gratuita
              </span>

              <h2 className="max-w-xl text-[1.6rem] leading-[1.15] font-semibold text-white md:text-[2.1rem]">
                Descreva o que você precisa executar.{' '}
                <span className="text-brand-400">A configuração certa sai da conversa.</span>
              </h2>

              <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
                {PROMISES.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink-300">
                    <Icon name="check" className="size-4 shrink-0 text-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
              <WhatsAppCta context={{ kind: 'geral' }} size="lg" className="w-full justify-center">
                Falar no WhatsApp
              </WhatsAppCta>
              <ButtonLink
                href="/encontre-sua-configuracao"
                variant="secondary"
                size="lg"
                className="w-full justify-center"
              >
                Responder o diagnóstico
                <Icon name="arrowRight" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
