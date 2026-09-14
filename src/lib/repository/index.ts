import { isSupabaseConfigured } from '@/lib/supabase/config'
import { MemoryRepository } from './memory'
import { SupabaseRepository } from './supabase'
import type { Repository } from './types'

let instance: Repository | null = null

/**
 * Ponto único de acesso a dados.
 * Enquanto `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` não
 * estiverem definidos, o site roda com o catálogo demonstrativo em memória.
 */
export function getRepository(): Repository {
  if (!instance) {
    instance = isSupabaseConfigured ? new SupabaseRepository() : new MemoryRepository()
  }
  return instance
}

export type { Repository, ProductQuery } from './types'
