export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

/** O site só usa Supabase quando URL e chave pública estiverem presentes. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const hasServiceRole = Boolean(supabaseUrl && supabaseServiceKey)
