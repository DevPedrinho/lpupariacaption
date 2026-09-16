import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { supabaseAnonKey, supabaseServiceKey, supabaseUrl, hasServiceRole } from './config'

let admin: SupabaseClient | null = null
let anon: SupabaseClient | null = null
let avisou = false

/**
 * Cliente com service role — uso exclusivo no servidor (rotas /admin e API).
 *
 * Sem a chave de serviço, devolve o cliente público em vez de estourar.
 *
 * O motivo é concreto: `createClient` lança "supabaseKey is required" quando a
 * chave é vazia, e como esta função é chamada direto dentro de páginas e de
 * server actions, esse erro vira uma página 500 em branco — sem dizer qual
 * variável falta. Caindo para o cliente público, a leitura pública continua
 * funcionando e a escrita é recusada pelo RLS como um erro tratável, que cada
 * chamador já sabe reportar.
 */
export function getAdminClient(): SupabaseClient {
  if (!hasServiceRole) {
    if (!avisou) {
      avisou = true
      console.warn(
        '[supabase] SUPABASE_SERVICE_ROLE_KEY ausente ou inválida. ' +
          'Seguindo com a chave pública: leitura do conteúdo publicado funciona, ' +
          'mas gravação, painel administrativo e comparativos vão ser recusados pelo RLS.',
      )
    }
    return getPublicClient()
  }

  if (!admin) {
    admin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return admin
}

/** Cliente público para leitura do conteúdo publicado. */
export function getPublicClient(): SupabaseClient {
  if (!anon) {
    anon = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  }
  return anon
}
