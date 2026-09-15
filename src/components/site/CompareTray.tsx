'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { MAX_COMPARE, useCompare } from './CompareProvider'

/** Bandeja de comparação: acompanha o visitante enquanto ele seleciona. */
export function CompareTray() {
  const { entries, remove, clear } = useCompare()
  const pathname = usePathname()

  if (entries.length === 0 || pathname === '/comparador') return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-45 border-t border-ink-600/70 bg-ink-900/97 backdrop-blur-xl">
      <div className="container-page flex flex-col gap-3 py-3.5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="hidden shrink-0 text-2xs font-semibold tracking-[0.12em] text-ink-400 uppercase sm:inline">
            Comparando
          </span>
          <ul className="flex min-w-0 flex-1 flex-wrap gap-2">
            {entries.map((entry) => (
              <li
                key={entry.slug}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-ink-600/70 bg-ink-850 py-1 pr-1 pl-3 text-sm text-ink-100"
              >
                <span className="truncate">{entry.name}</span>
                <button
                  type="button"
                  onClick={() => remove(entry.slug)}
                  aria-label={`Remover ${entry.name} da comparação`}
                  className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-white/8 hover:text-white"
                >
                  <Icon name="close" className="size-3.5" />
                </button>
              </li>
            ))}
            {entries.length < MAX_COMPARE && (
              <li className="inline-flex items-center rounded-full border border-dashed border-ink-600/70 px-3 py-1 text-sm text-ink-400">
                {MAX_COMPARE - entries.length === 1
                  ? 'Você pode adicionar mais 1'
                  : `Você pode adicionar mais ${MAX_COMPARE - entries.length}`}
              </li>
            )}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="rounded-lg px-3 py-2 text-sm text-ink-300 transition-colors hover:text-white"
          >
            Limpar
          </button>
          <Link
            href="/comparador"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
          >
            <Icon name="compare" className="size-4" />
            Comparar {entries.length === 1 ? 'configuração' : `as ${entries.length} configurações`}
          </Link>
        </div>
      </div>
    </div>
  )
}
