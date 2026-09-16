import 'server-only'
import { getAdminClient } from './supabase/server'
import { hasServiceRole } from './supabase/config'

export const PRODUTOS_BUCKET = 'produtos'

/** Envio de arquivo exige a chave de serviço; sem ela, só dá para apontar URL. */
export const uploadDisponivel = hasServiceRole

export const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
export const TAMANHO_MAXIMO = 8 * 1024 * 1024

/**
 * Sobe uma foto para o bucket público e devolve a URL direta, ou `null` com
 * o motivo no log. O nome do arquivo não entra no caminho: evita colisão e
 * caractere estranho na URL.
 */
export async function uploadProductImage(productId: string, file: File): Promise<string | null> {
  if (!TIPOS_ACEITOS.includes(file.type)) {
    console.error(`[produtos] tipo de imagem recusado: ${file.type}`)
    return null
  }
  if (file.size > TAMANHO_MAXIMO) {
    console.error(`[produtos] imagem acima de 8 MB: ${file.size} bytes`)
    return null
  }

  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.replace('image/', '')
  const path = `${productId}/${crypto.randomUUID()}.${ext}`
  const storage = getAdminClient().storage.from(PRODUTOS_BUCKET)

  const { error } = await storage.upload(path, file, { contentType: file.type, upsert: false })
  if (error) {
    console.error('[produtos] falha ao enviar imagem', error)
    return null
  }
  return storage.getPublicUrl(path).data.publicUrl
}
