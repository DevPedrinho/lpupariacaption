import 'server-only'
import { getAdminClient } from './supabase/server'
import { hasServiceRole } from './supabase/config'

export const CONTEUDOS_BUCKET = 'conteudos'
export const midiaDisponivel = hasServiceRole
export const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
export const TAMANHO_MAXIMO = 8 * 1024 * 1024

export type ArticleMedia = { name: string; url: string; createdAt?: string }

/** Sobe uma imagem para a pasta do artigo e devolve a URL pública. */
export async function uploadArticleImage(slug: string, file: File): Promise<string | null> {
  if (!TIPOS_ACEITOS.includes(file.type) || file.size > TAMANHO_MAXIMO) return null
  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.replace('image/', '')
  const path = `${slug}/${crypto.randomUUID()}.${ext}`
  const storage = getAdminClient().storage.from(CONTEUDOS_BUCKET)
  const { error } = await storage.upload(path, file, { contentType: file.type, upsert: false })
  if (error) {
    console.error('[conteudos] falha ao enviar imagem', error)
    return null
  }
  return storage.getPublicUrl(path).data.publicUrl
}

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
