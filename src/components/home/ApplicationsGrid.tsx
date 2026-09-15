import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import type { Application } from '@/lib/types'

/** Quantas aplicações a home destaca. O resto fica na página de soluções. */
const EM_FOCO = 6

/**
 * Componentes de maior peso desta aplicação, a partir dos pesos já cadastrados
 * em `components`. É a informação que mais importa na escolha, e sai do próprio
 * modelo — não de estimativa.
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
  const restantes = applications.length - EM_FOCO

  return (
    <Section id="aplicacoes" tone="raised">
      <div className="container-page">
        <SectionHeader
          align="center"
          eyebrow="Aplicações atendidas"
          title="Cada aplicação pesa em um componente diferente"
          description="Comece pela sua — é ela que define onde o investimento faz diferença."
        />

        <ul className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {applications.slice(0, EM_FOCO).map((application) => {
            const weights = decisive(application)

            return (
              <li key={application.slug}>
                <Link
                  href={`/solucoes/${application.slug}`}
                  className="group flex h-full flex-col gap-4 rounded-xl border border-ink-700/70 bg-ink-880/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/45 hover:bg-ink-850"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset transition-colors group-hover:bg-brand-500/20">
                      <Icon name={application.icon as IconName} className="size-5" />
                    </span>
                    <Icon
                      name="arrowRight"
                      className="size-4 shrink-0 text-ink-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-400"
                    />
                  </div>

                  <h3 className="text-[1.0625rem] leading-snug font-medium text-white">{application.name}</h3>

                  {weights ? (
                    <p className="mt-auto flex flex-wrap items-baseline gap-x-1.5 text-sm">
                      <span className="text-ink-400">Mais pesa:</span>
                      <span className="font-medium text-brand-300">{weights}</span>
                    </p>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>

        {restantes > 0 && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/solucoes"
              className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-brand-300 transition-colors hover:text-brand-200"
            >
              Ver as outras {restantes} aplicações
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </Section>
  )
}
