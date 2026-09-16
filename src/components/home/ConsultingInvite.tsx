'use client'

import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { useState } from 'react'
import { useSiteConfig } from '@/components/site/SiteConfig'

/**
 * Quatro razões para conversar antes de comprar.
 *
 * Todas se sustentam no que o site já afirma em outras páginas. Nenhuma promete
 * prazo de resposta, prazo de entrega ou ganho de desempenho: isso depende da
 * equipe e da configuração, e o briefing proíbe publicar número não medido.
 */
const BENEFITS = [
  {
    icon: 'search' as const,
    title: 'Descobre onde o investimento pesa',
    description: 'Qual componente muda o seu resultado — e qual não muda nada.',
  },
  {
    icon: 'chart' as const,
    title: 'Orçamento proporcional',
    description: 'Sem capacidade ociosa e sem falta que trave o projeto.',
  },
  {
    icon: 'info' as const,
    title: 'Entende o porquê de cada peça',
    description: 'A proposta vem com a justificativa técnica, não só a lista.',
  },
  {
    icon: 'shield' as const,
    title: 'Fala com quem monta',
    description: 'A mesma equipe dimensiona, testa e atende depois da entrega.',
  },
]

/**
 * Placeholder da foto.
 *
 * Enquanto a UPAR não fornecer a imagem real de alguém da equipe, esta seção
 * mostra a marca. Não entra foto de banco de imagens nem pessoa gerada: o
 * visitante entenderia como sendo um funcionário de verdade.
 */
function BrandPanel() {
  return (
    <div className="flex aspect-4/5 w-full items-center justify-center rounded-2xl border border-ink-700/70 bg-ink-850 sm:aspect-square lg:aspect-4/5">
      <img src="/marca/upar-negativo.svg" alt="" aria-hidden="true" className="w-1/2 opacity-25" />
    </div>
  )
}

export function ConsultingInvite() {
  const settings = useSiteConfig()
  // Se o arquivo apontado não existir, cai para a marca em vez de mostrar
  // imagem quebrada — o caminho pode ser cadastrado antes de o arquivo subir.
  const [falhou, setFalhou] = useState(false)
  const configurada = settings.consultantPhotoUrl?.trim()
  const photo = falhou ? '' : configurada

  return (
    <Section id="consultoria-gratuita">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-3xl border border-brand-500/30 bg-ink-880 p-6 md:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -right-32 -z-10 size-[32rem] rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle at center, rgba(55,219,154,0.2), rgba(130,208,228,0.06) 45%, transparent 70%)',
            }}
          />

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
            <figure className="m-0 flex flex-col gap-3">
              {photo ? (
                <img
                  src={photo}
                  alt={
                    settings.consultantName
                      ? `${settings.consultantName}, da equipe da UPAR`
                      : 'Especialista da equipe da UPAR'
                  }
                  onError={() => setFalhou(true)}
                  className="aspect-4/5 w-full rounded-2xl object-cover sm:aspect-square lg:aspect-4/5"
                />
              ) : (
                <BrandPanel />
              )}

              {photo && settings.consultantName ? (
                <figcaption className="flex flex-col gap-0.5">
                  <span className="font-medium text-white">{settings.consultantName}</span>
                  {settings.consultantRole ? (
                    <span className="text-sm text-ink-400">{settings.consultantRole}</span>
                  ) : null}
                </figcaption>
              ) : null}
            </figure>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3.5">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-500/35 bg-brand-500/10 px-3.5 py-1.5 text-2xs font-semibold tracking-[0.12em] text-brand-300 uppercase">
                  <Icon name="spark" className="size-3.5" />
                  Consultoria gratuita
                </span>
                <h2 className="text-[1.6rem] leading-[1.15] font-semibold text-white md:text-[2.1rem]">
                  Converse antes de comprar.{' '}
                  <span className="text-brand-400">É de graça e muda a conta.</span>
                </h2>
              </div>

              <ul className="grid gap-4 sm:grid-cols-2">
                {BENEFITS.map((benefit) => (
                  <li key={benefit.title} className="flex gap-3">
                    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
                      <Icon name={benefit.icon} className="size-4" />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-[0.9375rem] leading-snug font-medium text-white">{benefit.title}</h3>
                      <p className="text-sm leading-relaxed text-ink-300">{benefit.description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 sm:flex-row">
                <WhatsAppCta context={{ kind: 'geral' }} size="lg" className="justify-center">
                  Falar com um especialista
                </WhatsAppCta>
                <ButtonLink href="/encontre-sua-configuracao" variant="secondary" size="lg" className="justify-center">
                  Responder o diagnóstico
                  <Icon name="arrowRight" />
                </ButtonLink>
              </div>

              <p className="text-sm text-ink-400">Sem compromisso de compra.</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
