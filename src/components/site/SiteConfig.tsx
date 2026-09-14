'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { SiteSettings } from '@/lib/types'

const SiteConfigContext = createContext<SiteSettings | null>(null)

export function SiteConfigProvider({ value, children }: { value: SiteSettings; children: ReactNode }) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig(): SiteSettings {
  const value = useContext(SiteConfigContext)
  if (!value) throw new Error('useSiteConfig precisa estar dentro de <SiteConfigProvider>')
  return value
}
