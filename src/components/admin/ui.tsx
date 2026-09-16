import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui/Icon'

export function AdminHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-300">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-ink-700/70 bg-ink-880/60 p-5 md:p-6', className)}>
      {children}
    </div>
  )
}

export function Stat({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string | number
  hint?: string
  tone?: 'default' | 'brand' | 'positive' | 'caution'
}) {
  const toneClass = {
    default: 'text-white',
    brand: 'text-brand-300',
    positive: 'text-[#5FD9A4]',
    caution: 'text-[#F0C560]',
  }[tone]

  return (
    <div className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-5">
      <p className="text-xs tracking-[0.08em] text-ink-400 uppercase">{label}</p>
      <p className={cn('mt-2 text-3xl font-semibold', toneClass)}>{value}</p>
      {hint && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>}
    </div>
  )
}

export function TableWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-700/70">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  )
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn('border-b border-ink-700/60 bg-ink-850 px-4 py-3 font-semibold text-white', className)}
    >
      {children}
    </th>
  )
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3 align-top text-ink-200', className)}>{children}</td>
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-ink-600/70 p-10 text-center">
      <p className="text-base font-medium text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-400">{description}</p>
    </div>
  )
}

/**
 * Aviso de leitura parcial. Recebe os rótulos que `carregar()` devolveu em
 * `falhas`; sem falhas, não renderiza nada.
 */
export function AvisoCarregamento({ falhas, className }: { falhas: string[]; className?: string }) {
  if (falhas.length === 0) return null
  return (
    <Panel className={cn('border-critical-500/30 bg-critical-500/[0.06]', className)}>
      <div className="flex items-start gap-3">
        <Icon name="info" className="mt-0.5 size-5 shrink-0 text-critical-500" />
        <div>
          <h2 className="text-base font-semibold text-white">Nem tudo carregou: {falhas.join(', ')}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
            O que falta aparece vazio até a leitura voltar. Costuma ser a chave de serviço do Supabase
            (SUPABASE_SERVICE_ROLE_KEY) ausente ou incorreta na Vercel, ou o projeto do banco pausado.
          </p>
        </div>
      </div>
    </Panel>
  )
}

/** Aviso de gravação recusada. Recebe o `?erro=` que as actions devolvem. */
export function AvisoGravacao({ erro, className }: { erro?: string; className?: string }) {
  if (!erro) return null
  return (
    <Panel className={cn('border-critical-500/30 bg-critical-500/[0.06]', className)}>
      <div className="flex items-start gap-3">
        <Icon name="info" className="mt-0.5 size-5 shrink-0 text-critical-500" />
        <div>
          <h2 className="text-base font-semibold text-white">Não foi possível salvar</h2>
          <p className="mt-1.5 text-sm leading-relaxed break-words text-ink-300">{erro}</p>
        </div>
      </div>
    </Panel>
  )
}
