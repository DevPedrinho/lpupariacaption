'use client'

import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { homeSummary } from '@/data/process'

/**
 * Recapitulação antes das perguntas frequentes, para quem chegou rolando até
 * aqui sem ler as seções intermediárias. Só repete o que já foi afirmado na
 * página: nenhum item promete prazo, resultado ou número.
 */
export function HomeSummary() {
  return (
    <Section id="resumo" tone="raised">
      <div className="container-page">
        <SectionHeader
          align="center"
          eyebrow="Resumindo"
          title="Tudo o que você precisa saber, em um só lugar"
          description="Se você chegou direto até aqui, este bloco recapitula a página inteira."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {homeSummary.map((block) => (
            <div
              key={block.title}
              className="flex flex-col gap-4 rounded-2xl border border-ink-700/70 bg-ink-880/60 p-6"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
                <Icon name={block.icon} className="size-5" />
              </span>
              <h3 className="text-[1.0625rem] leading-snug font-semibold text-white">{block.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-300">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-flux-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-4 rounded-2xl border border-brand-500/40 bg-brand-500/[0.08] p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-500/20 text-brand-200 ring-1 ring-brand-500/35 ring-inset">
              <Icon name="whatsapp" className="size-5" />
            </span>
            <h3 className="text-[1.0625rem] leading-snug font-semibold text-white">O próximo passo</h3>
            <p className="text-sm leading-relaxed text-ink-300">
              Descreva o que você precisa executar. A partir daí, indicamos a configuração proporcional à sua
              operação — sem compromisso de compra.
            </p>
            <div className="mt-auto flex flex-col gap-2.5 pt-2">
              <WhatsAppCta context={{ kind: 'geral' }} size="md" className="w-full">
                Falar no WhatsApp
              </WhatsAppCta>
              <ButtonLink href="/encontre-sua-configuracao" variant="secondary" size="md" className="w-full">
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
