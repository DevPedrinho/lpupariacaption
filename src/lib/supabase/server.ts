import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { supabaseAnonKey, supabaseServiceKey, supabaseUrl } from './config'

let admin: SupabaseClient | null = null
let anon: SupabaseClient | null = null

/** Cliente com service role — uso exclusivo no servidor (rotas /admin e API). */
export function getAdminClient(): SupabaseClient {
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
