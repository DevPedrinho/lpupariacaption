'use server'

import { revalidatePath } from 'next/cache'
import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { addMessage, getComparison, setStatus, type ComparisonStatus } from '@/lib/comparativos'
import { gerarRascunho } from '@/lib/ai/comparativo'

/**
 * Envia a resposta ao cliente.
 *
 * O texto que chega aqui é o que estiver na caixa no momento do envio — seja o
 * rascunho da IA intocado ou reescrito pelo vendedor. É sempre uma pessoa que
 * aperta o botão: o cliente nunca recebe nada que não tenha passado por
 * revisão humana.
 */
export async function responderCliente(formData: FormData): Promise<void> {
  const session = await requireSession('comparativos')
  const id = String(formData.get('comparisonId') ?? '')
  const body = String(formData.get('body') ?? '').trim()
  if (!id || !body) return

  const ok = await addMessage({
    comparisonId: id,
    role: 'upar',
    body,
    authorEmail: session.email,
  })
  if (!ok) return

  await getRepository().log({
    actor: session.email,
    action: 'comparativo.respondido',
    entity: `comparativo:${id}`,
    detail: `${body.length} caracteres`,
  })

  revalidatePath('/admin/comparativos')
  revalidatePath(`/admin/comparativos/${id}`)
}

/** Refaz o rascunho — útil depois que o cliente manda mais informação. */
export async function regenerarRascunho(formData: FormData): Promise<void> {
  await requireSession('comparativos')
  const id = String(formData.get('comparisonId') ?? '')
  if (!id) return

  const comparativo = await getComparison(id)
  if (!comparativo) return

  await gerarRascunho(comparativo)
  revalidatePath(`/admin/comparativos/${id}`)
}

export async function alterarStatus(formData: FormData): Promise<void> {
  const session = await requireSession('comparativos')
  const id = String(formData.get('comparisonId') ?? '')
  const status = String(formData.get('status') ?? '') as ComparisonStatus
  if (!id || !status) return

  await setStatus(id, status, status === 'em_analise' ? session.email : undefined)

  await getRepository().log({
    actor: session.email,
    action: 'comparativo.status',
    entity: `comparativo:${id}`,
    detail: status,
  })

  revalidatePath('/admin/comparativos')
  revalidatePath(`/admin/comparativos/${id}`)
}
