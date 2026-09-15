import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { painPoints } from '@/data/process'

/**
 * Abre a página nomeando o problema antes de oferecer a solução.
 *
 * Os quatro itens são erros de dimensionamento explicados tecnicamente — sem
 * percentual, estudo ou estatística, que o briefing proíbe inventar.
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
              Quase todo projeto de IA que trava no hardware{' '}
              <span className="text-critical-500">erra em um destes quatro pontos</span>
            </>
          }
          description="Nenhum deles aparece na ficha técnica, e todos custam caro depois. É por isso que a conversa com a UPAR começa pela sua aplicação, e não pela lista de peças."
        />

        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {painPoints.map((point) => (
            <li
              key={point.title}
              className="flex flex-col gap-4 rounded-2xl border border-ink-700/70 bg-ink-880/60 p-6 md:p-7"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-critical-500/10 text-critical-500 ring-1 ring-critical-500/25 ring-inset">
                <Icon name={point.icon} className="size-5" />
              </span>
              <h3 className="text-[1.125rem] leading-snug font-semibold text-white">{point.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-ink-300">{point.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
