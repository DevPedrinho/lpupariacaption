import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { differentials } from '@/data/process'

export function Differentials() {
  return (
    <Section id="diferenciais">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeader
            eyebrow="Por que a UPAR"
            title="A diferença está na conversa que acontece antes da compra"
            description="Vender um computador é simples. Entregar o computador certo exige entender a operação de quem vai usar — e é nisso que a UPAR se especializou."
            className="lg:sticky lg:top-28 lg:self-start"
          />

          <ul className="grid gap-3 sm:grid-cols-2">
            {differentials.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-3 rounded-xl border border-ink-700/70 bg-ink-880/60 p-5"
              >
                <Icon name={item.icon} className="size-5 text-brand-300" />
                <h3 className="text-[1.0625rem] leading-snug font-medium text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-300">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
