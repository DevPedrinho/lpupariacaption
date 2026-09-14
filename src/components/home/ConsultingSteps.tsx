import { Section, SectionHeader } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { consultingSteps } from '@/data/process'

export function ConsultingSteps() {
  return (
    <Section id="consultoria" tone="light">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              tone="light"
              eyebrow="Como funciona"
              title="A consultoria acontece antes da proposta, não depois"
              description="Nenhuma configuração é sugerida sem entender o que você precisa executar. O processo é curto, objetivo e não gera compromisso."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/encontre-sua-configuracao" variant="light" size="md">
                Começar pelo diagnóstico
                <Icon name="arrowRight" />
              </ButtonLink>
              <ButtonLink href="/consultoria" variant="ghost" size="md" className="text-ink-700 hover:bg-ink-900/6 hover:text-ink-900">
                Ver o processo completo
              </ButtonLink>
            </div>
          </div>

          <ol className="relative flex flex-col gap-6 border-l border-ink-200 pl-8">
            {consultingSteps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-0.5 -left-[2.28rem] inline-flex size-7 items-center justify-center rounded-full border border-ink-200 bg-white text-xs font-semibold text-brand-600"
                >
                  {index + 1}
                </span>
                <h3 className="text-[1.0625rem] font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
