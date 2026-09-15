'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getCustomerSession } from '@/lib/customer-auth'
import {
  addMessage,
  comparativosDisponiveis,
  createComparison,
  getCustomerComparison,
  uploadPrint,
} from '@/lib/comparativos'
import { gerarRascunho } from '@/lib/ai/comparativo'

export type EnvioState = { error?: string }

const MAX_ARQUIVOS = 4
const MAX_BYTES = 8 * 1024 * 1024

const INDISPONIVEL =
  'O módulo ainda não está configurado neste ambiente. Fale com a UPAR pelo WhatsApp.'

/**
 * Recebe a configuração que o cliente encontrou: print, texto colado, ou os
 * dois. Um dos dois basta — exigir os dois só criaria atrito.
 */
export async function enviarConfiguracao(_prev: EnvioState, formData: FormData): Promise<EnvioState> {
  const session = await getCustomerSession()
  if (!session) redirect('/entrar?next=%2Fcomparativo')
  if (!comparativosDisponiveis) return { error: INDISPONIVEL }

  const sourceText = String(formData.get('sourceText') ?? '').trim()
  const arquivos = formData
    .getAll('prints')
    .filter((item): item is File => item instanceof File && item.size > 0)

  if (!sourceText && arquivos.length === 0) {
    return { error: 'Envie o print da configuração ou cole o texto dela.' }
  }
  if (arquivos.length > MAX_ARQUIVOS) {
    return { error: `Envie no máximo ${MAX_ARQUIVOS} imagens.` }
  }
  for (const arquivo of arquivos) {
    if (!arquivo.type.startsWith('image/')) {
      return { error: 'Os anexos precisam ser imagens.' }
    }
    if (arquivo.size > MAX_BYTES) {
      return { error: 'Cada imagem precisa ter no máximo 8 MB.' }
    }
  }

  const imagePaths: string[] = []
  for (const arquivo of arquivos) {
    const path = await uploadPrint(session.id, arquivo)
    if (!path) return { error: 'Não foi possível enviar a imagem. Tente novamente.' }
    imagePaths.push(path)
  }

  const comparativo = await createComparison({ customerId: session.id, sourceText, imagePaths })
  if (!comparativo) return { error: 'Não foi possível registrar agora. Tente novamente.' }

  // O rascunho é para a equipe: se a IA falhar, o comparativo continua de pé e
  // o vendedor escreve do zero. Por isso o erro é registrado, não propagado.
  try {
    await gerarRascunho(comparativo)
  } catch (error) {
    console.error('Falha ao gerar o rascunho da IA', error)
  }

  revalidatePath('/comparativo')
  redirect(`/comparativo/${comparativo.id}`)
}

/** Resposta do cliente dentro de uma conversa já aberta. */
export async function responder(_prev: EnvioState, formData: FormData): Promise<EnvioState> {
  const session = await getCustomerSession()
  if (!session) redirect('/entrar?next=%2Fcomparativo')
  if (!comparativosDisponiveis) return { error: INDISPONIVEL }

  const id = String(formData.get('comparisonId') ?? '')
  const body = String(formData.get('body') ?? '').trim()
  if (!body) return { error: 'Escreva a sua mensagem.' }

  // Confere a posse antes de gravar: o id vem do formulário, que é do cliente.
  const comparativo = await getCustomerComparison(id, session.id)
  if (!comparativo) return { error: 'Conversa não encontrada.' }

  const ok = await addMessage({ comparisonId: id, role: 'cliente', body })
  if (!ok) return { error: 'Não foi possível enviar agora. Tente novamente.' }

  revalidatePath(`/comparativo/${id}`)
  return {}
}
