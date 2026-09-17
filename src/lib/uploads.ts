import 'server-only'
import { getAdminClient } from './supabase/server'
import { hasServiceRole, supabaseUrl } from './supabase/config'

/**
 * Envio direto do navegador para o Storage.
 *
 * O servidor só assina a URL; o arquivo vai do computador da pessoa direto
 * para o Supabase (São Paulo), sem passar pela função na Vercel. Isso tira
 * um salto de ida e volta, o limite de 4,5 MB do corpo da requisição e a
 * espera de subir o arquivo duas vezes.
 */
export const BUCKETS = {
  produtos: { capability: 'produtos', tipos: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] },
  conteudos: { capability: 'conteudos', tipos: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'] },
} as const

export type UploadBucket = keyof typeof BUCKETS

export const uploadDireto = hasServiceRole && Boolean(supabaseUrl)

export async function signUpload(
  bucket: UploadBucket,
  prefix: string,
  contentType: string,
): Promise<{ signedUrl: string; publicUrl: string } | { error: string }> {
  if (!uploadDireto) return { error: 'Envio de arquivo precisa da SUPABASE_SERVICE_ROLE_KEY.' }
  if (!(BUCKETS[bucket].tipos as readonly string[]).includes(contentType)) {
    return { error: 'Use JPG, PNG, WebP ou AVIF.' }
  }
  if (!/^[a-z0-9-]{1,80}$/.test(prefix)) return { error: 'Pasta inválida.' }

  const ext = contentType === 'image/jpeg' ? 'jpg' : contentType.replace('image/', '')
  const path = `${prefix}/${crypto.randomUUID()}.${ext}`
  const storage = getAdminClient().storage.from(bucket)
  const { data, error } = await storage.createSignedUploadUrl(path)
  if (error || !data) {
    console.error('[uploads] falha ao assinar URL', error)
    return { error: 'Não foi possível preparar o envio.' }
  }
  return { signedUrl: data.signedUrl, publicUrl: storage.getPublicUrl(path).data.publicUrl }
}
