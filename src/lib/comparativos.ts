import { getAdminClient } from '@/lib/supabase/server'
import { hasServiceRole } from '@/lib/supabase/config'

/* ============================================================================
   Acesso a dados do módulo de comparativos.

   Todas as consultas usam a chave de serviço, que ignora o RLS. Isso é
   deliberado — é o mesmo caminho do restante do site —, mas transfere para cá
   a responsabilidade de checar quem pode ver o quê. Por isso toda função que
   busca um comparativo do cliente recebe o `customerId` e filtra por ele, e o
   rascunho da IA tem função própria, chamada apenas pelo painel.
   ========================================================================== */

export const COMPARATIVOS_BUCKET = 'comparativos'

export type ComparisonStatus = 'novo' | 'em_analise' | 'respondido' | 'encerrado'

export const STATUS_LABEL: Record<ComparisonStatus, string> = {
  novo: 'Aguardando a UPAR',
  em_analise: 'Em análise',
  respondido: 'Respondido',
  encerrado: 'Encerrado',
}

export type Comparison = {
  id: string
  customerId: string
  status: ComparisonStatus
  sourceText: string
  imagePaths: string[]
  assignedTo: string | null
  createdAt: string
  updatedAt: string
}

export type ComparisonMessage = {
  id: string
  role: 'cliente' | 'upar'
  body: string
  authorEmail: string | null
  createdAt: string
}

export type ComparisonCustomer = {
  id: string
  name: string
  email: string
  whatsapp: string
}

export type ComparisonDraft = {
  body: string
  suggestedSlug: string | null
  status: 'pendente' | 'gerado' | 'indisponivel' | 'erro'
  model: string | null
  error: string | null
}

type Row = Record<string, unknown>

function toComparison(row: Row): Comparison {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    status: row.status as ComparisonStatus,
    sourceText: String(row.source_text ?? ''),
    imagePaths: (row.image_paths as string[]) ?? [],
    assignedTo: (row.assigned_to as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function toMessage(row: Row): ComparisonMessage {
  return {
    id: String(row.id),
    role: row.role as 'cliente' | 'upar',
    body: String(row.body),
    authorEmail: (row.author_email as string | null) ?? null,
    createdAt: String(row.created_at),
  }
}

/** O módulo inteiro depende da chave de serviço para gravar. */
export const comparativosDisponiveis = hasServiceRole

/* --------------------------------- Cliente --------------------------------- */

export async function createComparison(input: {
  customerId: string
  sourceText: string
  imagePaths: string[]
}): Promise<Comparison | null> {
  const { data, error } = await getAdminClient()
    .from('comparisons')
    .insert({
      customer_id: input.customerId,
      source_text: input.sourceText,
      image_paths: input.imagePaths,
    })
    .select()
    .single()

  if (error) {
    console.error('Falha ao criar comparativo', error)
    return null
  }
  return toComparison(data as Row)
}

export async function listCustomerComparisons(customerId: string): Promise<Comparison[]> {
  const { data, error } = await getAdminClient()
    .from('comparisons')
    .select()
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Falha ao listar comparativos do cliente', error)
    return []
  }
  return (data ?? []).map((row) => toComparison(row as Row))
}

/**
 * Busca um comparativo garantindo a posse.
 *
 * `customerId` é obrigatório aqui justamente porque a chave de serviço passa
 * por cima do RLS: sem esse filtro, trocar o id na URL leria a conversa de
 * outra pessoa.
 */
export async function getCustomerComparison(
  id: string,
  customerId: string,
): Promise<Comparison | null> {
  const { data } = await getAdminClient()
    .from('comparisons')
    .select()
    .eq('id', id)
    .eq('customer_id', customerId)
    .maybeSingle()

  return data ? toComparison(data as Row) : null
}

/* ---------------------------------- Equipe ---------------------------------- */

export async function getComparison(id: string): Promise<Comparison | null> {
  const { data } = await getAdminClient().from('comparisons').select().eq('id', id).maybeSingle()
  return data ? toComparison(data as Row) : null
}

export async function listInbox(): Promise<(Comparison & { customer: ComparisonCustomer | null })[]> {
  const { data, error } = await getAdminClient()
    .from('comparisons')
    .select('*, customers(id, name, email, whatsapp)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Falha ao listar a caixa de entrada', error)
    return []
  }

  return (data ?? []).map((row) => {
    const r = row as Row
    const c = r.customers as Row | null
    return {
      ...toComparison(r),
      customer: c
        ? {
            id: String(c.id),
            name: String(c.name),
            email: String(c.email),
            whatsapp: String(c.whatsapp),
          }
        : null,
    }
  })
}

/** Quantos aguardam a equipe. Alimenta o contador do menu do painel. */
export async function countPending(): Promise<number> {
  if (!hasServiceRole) return 0
  const { count, error } = await getAdminClient()
    .from('comparisons')
    .select('id', { count: 'exact', head: true })
    .in('status', ['novo', 'em_analise'])

  if (error) return 0
  return count ?? 0
}

export async function getCustomer(id: string): Promise<ComparisonCustomer | null> {
  const { data } = await getAdminClient()
    .from('customers')
    .select('id, name, email, whatsapp')
    .eq('id', id)
    .maybeSingle()

  if (!data) return null
  const r = data as Row
  return {
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    whatsapp: String(r.whatsapp),
  }
}

/* -------------------------------- Mensagens -------------------------------- */

export async function listMessages(comparisonId: string): Promise<ComparisonMessage[]> {
  const { data, error } = await getAdminClient()
    .from('comparison_messages')
    .select()
    .eq('comparison_id', comparisonId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Falha ao listar mensagens', error)
    return []
  }
  return (data ?? []).map((row) => toMessage(row as Row))
}

export async function addMessage(input: {
  comparisonId: string
  role: 'cliente' | 'upar'
  body: string
  authorEmail?: string
}): Promise<boolean> {
  const client = getAdminClient()
  const { error } = await client.from('comparison_messages').insert({
    comparison_id: input.comparisonId,
    role: input.role,
    body: input.body,
    author_email: input.authorEmail ?? null,
  })
  if (error) {
    console.error('Falha ao gravar mensagem', error)
    return false
  }

  // Quem falou por último define o estado: resposta da equipe fecha o ciclo,
  // resposta do cliente reabre.
  await client
    .from('comparisons')
    .update({
      status: input.role === 'upar' ? 'respondido' : 'novo',
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.comparisonId)

  return true
}

export async function setStatus(id: string, status: ComparisonStatus, assignedTo?: string) {
  await getAdminClient()
    .from('comparisons')
    .update({ status, assigned_to: assignedTo ?? null, updated_at: new Date().toISOString() })
    .eq('id', id)
}

/* --------------------------------- Rascunho -------------------------------- */

export async function getDraft(comparisonId: string): Promise<ComparisonDraft | null> {
  const { data } = await getAdminClient()
    .from('comparison_drafts')
    .select()
    .eq('comparison_id', comparisonId)
    .maybeSingle()

  if (!data) return null
  const r = data as Row
  return {
    body: String(r.body ?? ''),
    suggestedSlug: (r.suggested_slug as string | null) ?? null,
    status: r.status as ComparisonDraft['status'],
    model: (r.model as string | null) ?? null,
    error: (r.error as string | null) ?? null,
  }
}

export async function saveDraft(comparisonId: string, draft: Partial<ComparisonDraft>) {
  await getAdminClient().from('comparison_drafts').upsert(
    {
      comparison_id: comparisonId,
      body: draft.body ?? '',
      suggested_slug: draft.suggestedSlug ?? null,
      status: draft.status ?? 'pendente',
      model: draft.model ?? null,
      error: draft.error ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'comparison_id' },
  )
}

/* -------------------------------- Anexos ----------------------------------- */

/**
 * Assina a URL para o navegador subir o print direto no bucket privado.
 * O caminho fica sob a pasta do cliente, e é isso que `enviarConfiguracao`
 * confere depois: só aceita caminhos da própria pessoa.
 */
export async function signPrintUpload(
  customerId: string,
  contentType: string,
): Promise<{ signedUrl: string; path: string } | null> {
  const tipos = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
  if (!tipos.includes(contentType)) return null
  const ext = contentType === 'image/jpeg' ? 'jpg' : contentType.replace('image/', '')
  const path = `${customerId}/${crypto.randomUUID()}.${ext}`
  const { data, error } = await getAdminClient().storage.from(COMPARATIVOS_BUCKET).createSignedUploadUrl(path)
  if (error || !data) {
    console.error('Falha ao assinar envio do print', error)
    return null
  }
  return { signedUrl: data.signedUrl, path }
}

export async function uploadPrint(customerId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
  const path = `${customerId}/${crypto.randomUUID()}.${ext}`

  const { error } = await getAdminClient()
    .storage.from(COMPARATIVOS_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) {
    console.error('Falha ao enviar o print', error)
    return null
  }
  return path
}

/**
 * URL temporária para exibir o print. O bucket é privado, então nem o cliente
 * nem a equipe acessam o arquivo por link direto.
 */
export async function signedUrl(path: string, seconds = 60 * 10): Promise<string | null> {
  const { data } = await getAdminClient()
    .storage.from(COMPARATIVOS_BUCKET)
    .createSignedUrl(path, seconds)
  return data?.signedUrl ?? null
}
