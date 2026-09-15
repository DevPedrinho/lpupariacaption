import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { approachCompare } from '@/data/process'

type Column = {
  readonly title: string
  readonly subtitle: string
  readonly items: readonly string[]
}

function CompareColumn({ column, variant }: { column: Column; variant: 'wrong' | 'right' }) {
  const isRight = variant === 'right'

  return (
    <div
      className={
        isRight
          ? 'flex flex-col gap-5 rounded-2xl border border-brand-500/40 bg-brand-500/[0.07] p-6 md:p-7'
          : 'flex flex-col gap-5 rounded-2xl border border-ink-700/70 bg-ink-880/50 p-6 md:p-7'
      }
    >
      <div className="flex flex-col gap-1">
        <h3 className={isRight ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-ink-200'}>
          {column.title}
        </h3>
        <p className="text-sm text-ink-400">{column.subtitle}</p>
      </div>

      <ul className="flex flex-col gap-3">
        {column.items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={
                isRight
                  ? 'inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-ink-950'
                  : 'inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-ink-700 text-ink-400'
              }
            >
              <Icon name={isRight ? 'check' : 'close'} className="size-3" />
            </span>
            <span className={isRight ? 'text-[0.9375rem] text-white' : 'text-[0.9375rem] text-ink-300'}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Contraste lado a lado, só com os títulos: a seção existe para ser escaneada
 * em segundos, não lida. A coluna da esquerda descreve uma prática de mercado
 * — nenhum concorrente é citado nem caracterizado.
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
              <span className="text-gradient">resultados bem diferentes</span>
            </>
          }
          description="A diferença não está no catálogo de peças. Está na ordem das perguntas."
        />

        <div className="mt-11 grid gap-4 lg:grid-cols-2">
          <CompareColumn column={approachCompare.wrong} variant="wrong" />
          <CompareColumn column={approachCompare.right} variant="right" />
        </div>
      </div>
    </Section>
  )
}
