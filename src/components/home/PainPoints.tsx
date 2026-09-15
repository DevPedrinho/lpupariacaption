import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { painPoints } from '@/data/process'

/**
 * Nomeia o problema antes de oferecer a solução, em quatro blocos de leitura
 * rápida. O ritmo vem da numeração e do ícone, não de parágrafo: quem rola a
 * página precisa entender os quatro pontos em poucos segundos.
 */
export function PainPoints() {
  return (
    <Section id="onde-erra" tone="raised">
      <div className="container-page">
        <SectionHeader
          align="center"
          eyebrow="Antes de escolher"
          title={
            <>
              Quatro erros que <span className="text-gradient">custam caro</span> em projeto de IA
            </>
          }
          description="Nenhum deles aparece na ficha técnica."
        />

        <ul className="mt-11 grid gap-px overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-700/70 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((point, index) => (
            <li
              key={point.title}
              className="group flex flex-col gap-3.5 bg-ink-880 p-6 transition-colors duration-300 hover:bg-ink-850"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset transition-colors group-hover:bg-brand-500/20">
                  <Icon name={point.icon} className="size-[1.15rem]" />
                </span>
                <span
                  aria-hidden="true"
                  className="font-display text-2xl font-semibold text-ink-600 transition-colors group-hover:text-brand-500/60"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-[1.0625rem] leading-snug font-semibold text-white">{point.title}</h3>
              <p className="text-sm leading-relaxed text-ink-300">{point.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
