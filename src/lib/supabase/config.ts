/**
 * Só entram aqui valores que podem ir para um cabeçalho HTTP.
 *
 * As chaves do Supabase viajam nos cabeçalhos `apikey` e `Authorization` de
 * toda requisição. Se o valor cadastrado no ambiente tiver espaço, acento ou
 * qualquer caractere fora do ASCII visível — o caso clássico é colar por engano
 * o caminho do painel ("Dashboard → Settings → API") em vez da chave —, o
 * `fetch` lança `Cannot convert argument to a ByteString` e derruba o build
 * inteiro, longe da causa.
 *
 * Preferimos ignorar a variável e seguir com o que resta: sem a chave de
 * serviço o site continua lendo pela chave pública; sem a pública, cai no
 * catálogo demonstrativo em memória. Em qualquer dos casos o aviso abaixo diz
 * exatamente o que corrigir.
 */
const HEADER_SAFE = /^[\x21-\x7E]+$/

function headerSafeEnv(name: string): string {
  const value = (process.env[name] ?? '').trim()
  if (!value) return ''
  if (!HEADER_SAFE.test(value)) {
    console.warn(
      `[supabase] ${name} ignorada: o valor não parece uma chave. ` +
        'Chaves do Supabase não têm espaço nem acento — confira se você não colou ' +
        'o caminho do painel no lugar da chave. Copie-a em Supabase → Project Settings → API.',
    )
    return ''
  }
  return value
}

export const supabaseUrl = headerSafeEnv('NEXT_PUBLIC_SUPABASE_URL')
export const supabaseAnonKey = headerSafeEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
export const supabaseServiceKey = headerSafeEnv('SUPABASE_SERVICE_ROLE_KEY')

/** O site só usa Supabase quando URL e chave pública estiverem presentes. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const hasServiceRole = Boolean(supabaseUrl && supabaseServiceKey)
