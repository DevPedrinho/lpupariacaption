import 'server-only'
import { getAdminClient } from './supabase/server'
import { hasServiceRole } from './supabase/config'

export const CONTEUDOS_BUCKET = 'conteudos'
export const midiaDisponivel = hasServiceRole

export type ArticleMedia = { name: string; url: string; createdAt?: string }

/** Imagens já enviadas para este artigo, mais recentes primeiro. */
export async function listArticleImages(slug: string): Promise<ArticleMedia[]> {
  if (!midiaDisponivel) return []
  const storage = getAdminClient().storage.from(CONTEUDOS_BUCKET)
  const { data, error } = await storage.list(slug, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
  if (error || !data) return []
  return data
    .filter((item) => item.name && !item.name.startsWith('.'))
    .map((item) => ({
      name: item.name,
      url: storage.getPublicUrl(`${slug}/${item.name}`).data.publicUrl,
      createdAt: item.created_at ?? undefined,
    }))
}

export async function removeArticleImage(slug: string, name: string): Promise<boolean> {
  if (!midiaDisponivel || name.includes('/') || name.includes('..')) return false
  const { error } = await getAdminClient().storage.from(CONTEUDOS_BUCKET).remove([`${slug}/${name}`])
  return !error
}
