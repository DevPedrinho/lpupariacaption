/**
 * Erro do Supabase com a operação e o código do Postgres preservados.
 *
 * O objeto cru que o cliente devolve não é `Error`: não tem stack, some no
 * log e a barreira de erro do Next não o reconhece. Aqui ele vira um erro
 * nomeado, e o código fica disponível para a tela explicar o que houve.
 */
export class SupabaseError extends Error {
  readonly code?: string

  constructor(operacao: string, detalhe: { message?: string; code?: string; hint?: string }) {
    const texto = [detalhe?.message, detalhe?.hint].filter(Boolean).join(' — ')
    super(`Supabase falhou em ${operacao}: ${texto || 'erro desconhecido'}`)
    this.name = 'SupabaseError'
    this.code = detalhe?.code
  }
}

/**
 * Mensagem para a pessoa que tentou gravar, ou `null` se o erro não veio do
 * Supabase (aí não é para esconder: deixa subir).
 *
 * `42501` é o RLS recusando a escrita. No painel isso quase sempre significa
 * que a chave de serviço não está configurada e a gravação foi com a chave
 * pública — o aviso aponta direto para a causa.
 */
export function mensagemDeGravacao(erro: unknown): string | null {
  if (!(erro instanceof Error) || erro.name !== 'SupabaseError') return null
  const code = (erro as SupabaseError).code
  if (code === '42501') {
    return 'O banco recusou a gravação (política RLS). Quase sempre é a SUPABASE_SERVICE_ROLE_KEY ausente ou incorreta na Vercel.'
  }
  return erro.message
}
