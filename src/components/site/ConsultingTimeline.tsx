import { Icon } from '@/components/ui/Icon'
import { ButtonLink } from '@/components/ui/Button'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { ConsultantPhoto } from '@/components/site/ConsultantPhoto'
import { consultingSteps } from '@/data/process'

/**
 * O processo como linha do tempo: um título por etapa, "Saiba mais" para
 * quem quiser o detalhe, e o botão de conversa no fim do caminho. Ao lado,
 * a mesma foto de alguém da equipe que a home usa — quem chega aqui quer
 * saber com quem vai falar.
 *
 * `details`/`summary` nativos: funciona sem JavaScript e o leitor de tela
 * anuncia como expansível.
 */
export function ConsultingTimeline() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <ConsultantPhoto className="mx-auto max-w-sm lg:max-w-none" />
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-300">
          Quem conversa com você é quem dimensiona, acompanha a montagem e atende depois da entrega.
        </p>
      </div>

      <div>
        <ol className="relative flex flex-col">
          {consultingSteps.map((step, index) => {
            const last = index === consultingSteps.length - 1
            return (
              <li key={step.title} className="relative flex gap-4 pb-6 sm:gap-5">
                {/* Linha vertical que liga os números; não desce depois do último. */}
                {!last && (
                  <span
                    aria-hidden="true"
                    className="absolute top-10 bottom-0 left-[1.1875rem] w-px bg-linear-to-b from-brand-500/60 to-ink-700"
                  />
                )}
                <span className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-500/40 bg-ink-900 text-sm font-semibold text-brand-300">
                  {index + 1}
                </span>

                <details className="group min-w-0 flex-1 rounded-xl border border-ink-700/70 bg-ink-880/60 open:border-brand-500/35">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                    <span className="text-[1.0625rem] leading-snug font-medium text-white">{step.title}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-flux-300">
                      <span className="group-open:hidden">Saiba mais</span>
                      <span className="hidden group-open:inline">Fechar</span>
                      <Icon name="chevronDown" className="size-4 transition-transform group-open:rotate-180" />
                    </span>
                  </summary>
                  <p className="border-t border-ink-700/60 px-4 py-3.5 text-sm leading-relaxed text-ink-300">
                    {step.description}
                  </p>
                </details>
              </li>
            )
          })}

          <li className="relative flex gap-4 sm:gap-5">
            <span className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-ink-950">
              <Icon name="whatsapp" className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-brand-500/35 bg-brand-500/8 p-5">
              <div>
                <p className="text-[1.0625rem] font-medium text-white">Tudo começa por uma conversa</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-300">
                  Sem formulário longo e sem compromisso de compra.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <WhatsAppCta context={{ kind: 'consultoria' }} size="lg" className="justify-center">
                  Iniciar conversa
                </WhatsAppCta>
                <ButtonLink href="/encontre-sua-configuracao" variant="secondary" size="lg" className="justify-center">
                  Fazer o diagnóstico
                </ButtonLink>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </div>
  )
}
