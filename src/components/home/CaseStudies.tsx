import { Badge } from '@/components/ui/Badge'
import { Section, SectionHeader } from '@/components/ui/Section'
import type { CaseStudy } from '@/lib/types'

/**
 * Casos atendidos, cadastrados no painel. Só aparece quando há pelo menos um
 * caso — e cada caso entra apenas com a autorização do cliente. Sem número
 * inventado: o texto é o que a UPAR escreveu.
 */
export function CaseStudies({ cases, title = 'Quem a UPAR já atendeu' }: { cases: CaseStudy[]; title?: string }) {
  if (cases.length === 0) return null

  return (
    <Section id="casos" tone="raised">
      <div className="container-page">
        <SectionHeader eyebrow="Casos atendidos" title={title} />
        <ul className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((item) => (
            <li
              key={`${item.segment}-${item.title}`}
              className="flex flex-col gap-3 rounded-xl border border-ink-700/70 bg-ink-880/60 p-6"
            >
              <Badge tone="neutral">{item.segment}</Badge>
              <h3 className="text-lg leading-snug font-semibold text-white">{item.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-ink-300">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
