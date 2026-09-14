import { Badge } from '@/components/ui/Badge'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import type { Testimonial } from '@/lib/types'

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null
  const hasDemo = testimonials.some((item) => item.isDemo)

  return (
    <Section id="depoimentos" tone="raised">
      <div className="container-page">
        <SectionHeader
          eyebrow="Provas sociais"
          title="O que muda quando o dimensionamento vem antes da venda"
        />

        {hasDemo && (
          <DemoNotice className="mt-6 max-w-2xl">
            Os depoimentos abaixo são <strong>demonstrativos</strong> e existem apenas para validar o
            layout. Serão substituídos por depoimentos reais coletados pela UPAR, com autorização de uso.
          </DemoNotice>
        )}

        <ul className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-ink-700/70 bg-ink-880/60 p-6"
            >
              <Icon name="quote" className="size-6 text-brand-500/60" />
              <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-ink-200">
                {item.quote}
              </blockquote>
              <footer className="flex items-end justify-between gap-3 border-t border-ink-700/60 pt-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{item.author}</p>
                  <p className="truncate text-xs text-ink-400">
                    {[item.role, item.organization].filter(Boolean).join(' — ')}
                  </p>
                </div>
                {item.isDemo ? <Badge tone="demo">Demonstrativo</Badge> : <Badge tone="neutral">{item.segment}</Badge>}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
