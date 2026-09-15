import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { differentials } from '@/data/process'

/**
 * Seis afirmações curtas, sem parágrafo. A seção serve para o visitante
 * confirmar rapidamente com quem está falando — quem quiser o detalhe tem a
 * página "Sobre a UPAR".
 */
export function Differentials() {
  return (
    <Section id="diferenciais">
      <div className="container-page">
        <SectionHeader
          align="center"
          eyebrow="Por que a UPAR"
          title="A diferença está na conversa antes da compra"
        />

        <ul className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map((item) => (
            <li
              key={item.title}
              className="flex items-center gap-3.5 rounded-xl border border-ink-700/70 bg-ink-880/60 p-5"
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
                <Icon name={item.icon} className="size-5" />
              </span>
              <h3 className="text-[0.9375rem] leading-snug font-medium text-white">{item.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
