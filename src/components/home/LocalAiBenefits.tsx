import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { localAiBenefits } from '@/data/process'

export function LocalAiBenefits() {
  return (
    <Section id="ia-local">
      <div className="container-page">
        <SectionHeader
          eyebrow="IA local"
          title="Por que tantas operações estão trazendo a IA para dentro de casa"
          description="Executar localmente não substitui a nuvem em todos os casos — mas resolve problemas que a nuvem não resolve."
        />

        <ul className="mt-11 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {localAiBenefits.map((benefit) => (
            <li
              key={benefit.title}
              className="flex flex-col gap-3 rounded-xl border border-ink-700/70 bg-ink-880/60 p-6"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-flux-400/10 text-flux-300 ring-1 ring-flux-400/25 ring-inset">
                <Icon name={benefit.icon} className="size-5" />
              </span>
              <h3 className="text-[1.0625rem] leading-snug font-medium text-white">{benefit.title}</h3>
              <p className="text-sm leading-relaxed text-ink-300">{benefit.description}</p>
            </li>
          ))}
        </ul>

        <p className="mt-7 max-w-3xl text-sm leading-relaxed text-ink-400">
          A escolha entre local, nuvem ou um modelo híbrido depende do seu volume de uso, da sensibilidade
          dos dados e do horizonte de crescimento. Esse é um dos primeiros pontos que a consultoria ajuda a
          esclarecer.
        </p>
      </div>
    </Section>
  )
}
