import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import type { Application } from '@/lib/types'

/**
 * Componentes de maior peso desta aplicação, a partir dos pesos já cadastrados
 * em `components`. Mostrar isso no card antecipa a informação que mais importa
 * na escolha — e sai do próprio modelo, não de estimativa.
 */
function decisive(application: Application): string {
  const weights = application.components
  if (weights.length === 0) return ''
  const top = Math.max(...weights.map((item) => item.weight))
  const names = weights.filter((item) => item.weight === top).map((item) => item.component)

  // "VRAM e GPU", "GPU, RAM, CPU e Armazenamento" — nunca "A e B e C".
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
}

export function ApplicationsGrid({ applications }: { applications: Application[] }) {
  return (
    <Section id="aplicacoes" tone="raised">
      <div className="container-page">
        <SectionHeader
          eyebrow="Aplicações atendidas"
          title="Cada aplicação exige um equilíbrio diferente de hardware"
          description="Um computador excelente para gerar imagens pode ser insuficiente para analisar dados. Comece pela sua aplicação — é ela que define onde o investimento faz diferença."
        />

        <ul className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => {
            const weights = decisive(application)

            return (
              <li key={application.slug}>
                <Link
                  href={`/solucoes/${application.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-xl border border-ink-700/70 bg-ink-880/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/45 hover:bg-ink-850"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset transition-colors group-hover:bg-brand-500/20">
                    <Icon name={application.icon as IconName} className="size-5" />
                  </span>
                  <h3 className="text-[1.0625rem] leading-snug font-medium text-white">{application.name}</h3>
                  <p className="text-sm leading-relaxed text-ink-300">{application.short}</p>

                  <div className="mt-auto flex flex-col gap-3.5 pt-1.5">
                    {weights ? (
                      <p className="flex flex-wrap items-baseline gap-x-1.5 border-t border-ink-700/60 pt-3.5 text-sm">
                        <span className="text-ink-400">O que mais pesa aqui:</span>
                        <span className="font-medium text-white">{weights}</span>
                      </p>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-flux-300">
                      Ver dimensionamento
                      <Icon
                        name="arrowRight"
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
