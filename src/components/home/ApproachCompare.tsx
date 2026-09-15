import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { approachCompare } from '@/data/process'

type Column = {
  readonly title: string
  readonly subtitle: string
  readonly items: readonly { readonly title: string; readonly description: string }[]
}

function CompareColumn({ column, variant }: { column: Column; variant: 'wrong' | 'right' }) {
  const isRight = variant === 'right'

  return (
    <div
      className={
        isRight
          ? 'flex flex-col gap-6 rounded-2xl border border-brand-500/35 bg-brand-500/[0.06] p-6 md:p-8'
          : 'flex flex-col gap-6 rounded-2xl border border-ink-700/70 bg-ink-880/50 p-6 md:p-8'
      }
    >
      <div className="flex flex-col gap-1.5">
        <h3 className={isRight ? 'text-xl font-semibold text-white' : 'text-xl font-semibold text-ink-200'}>
          {column.title}
        </h3>
        <p className="text-sm leading-relaxed text-ink-400">{column.subtitle}</p>
      </div>

      <ul className="flex flex-col gap-5">
        {column.items.map((item) => (
          <li key={item.title} className="flex gap-3.5">
            <span
              aria-hidden="true"
              className={
                isRight
                  ? 'mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30 ring-inset'
                  : 'mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-critical-500/10 text-critical-500 ring-1 ring-critical-500/25 ring-inset'
              }
            >
              <Icon name={isRight ? 'check' : 'close'} className="size-3.5" />
            </span>
            <div className="flex flex-col gap-1.5">
              <h4 className={isRight ? 'font-medium text-white' : 'font-medium text-ink-200'}>{item.title}</h4>
              <p className="text-[0.9375rem] leading-relaxed text-ink-300">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Contraste lado a lado entre comprar por ficha técnica e dimensionar pela
 * aplicação. A coluna da esquerda descreve uma prática de mercado — nenhum
 * concorrente é citado nem caracterizado.
 */
export function ApproachCompare() {
  return (
    <Section id="como-dimensionamos">
      <div className="container-page">
        <SectionHeader
          align="center"
          title={
            <>
              Duas formas de comprar a mesma máquina —{' '}
              <span className="text-gradient">com resultados bem diferentes</span>
            </>
          }
          description="A diferença não está no catálogo de peças, que é praticamente o mesmo para todo mundo. Está na ordem das perguntas."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-5">
          <CompareColumn column={approachCompare.wrong} variant="wrong" />
          <CompareColumn column={approachCompare.right} variant="right" />
        </div>
      </div>
    </Section>
  )
}
