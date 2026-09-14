'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { track } from '@/lib/analytics'

const STORAGE_KEY = 'upar.compare'
export const MAX_COMPARE = 3

export type CompareEntry = { slug: string; name: string }

type CompareContextValue = {
  slugs: string[]
  /** Nome dos produtos selecionados, na ordem de seleção. */
  entries: CompareEntry[]
  isSelected: (slug: string) => boolean
  toggle: (slug: string) => void
  remove: (slug: string) => void
  clear: () => void
  isFull: boolean
  ready: boolean
}

const CompareContext = createContext<CompareContextValue | null>(null)

export function CompareProvider({
  catalog,
  children,
}: {
  /** Índice mínimo slug → nome, para exibir a seleção sem nova requisição. */
  catalog: CompareEntry[]
  children: ReactNode
}) {
  const [slugs, setSlugs] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setSlugs(parsed.slice(0, MAX_COMPARE).filter((s) => typeof s === 'string'))
      }
    } catch {
      /* armazenamento indisponível */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
    } catch {
      /* armazenamento indisponível */
    }
  }, [slugs, ready])

  const toggle = useCallback((slug: string) => {
    setSlugs((current) => {
      if (current.includes(slug)) return current.filter((s) => s !== slug)
      if (current.length >= MAX_COMPARE) return current
      const next = [...current, slug]
      track('compare_products', { produtos: next.join(','), quantidade: next.length })
      return next
    })
  }, [])

  const remove = useCallback((slug: string) => {
    setSlugs((current) => current.filter((s) => s !== slug))
  }, [])

  const clear = useCallback(() => setSlugs([]), [])

  const value = useMemo<CompareContextValue>(
    () => ({
      slugs,
      entries: slugs
        .map((slug) => catalog.find((item) => item.slug === slug))
        .filter((item): item is CompareEntry => Boolean(item)),
      isSelected: (slug) => slugs.includes(slug),
      toggle,
      remove,
      clear,
      isFull: slugs.length >= MAX_COMPARE,
      ready,
    }),
    [slugs, catalog, toggle, remove, clear, ready],
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

export function useCompare(): CompareContextValue {
  const value = useContext(CompareContext)
  if (!value) throw new Error('useCompare precisa estar dentro de <CompareProvider>')
  return value
}
