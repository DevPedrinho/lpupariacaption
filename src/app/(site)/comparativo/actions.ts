'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getCustomerSession } from '@/lib/customer-auth'
import {
  addMessage,
  comparativosDisponiveis,
  createComparison,
  getCustomerComparison,
  signPrintUpload,
} from '@/lib/comparativos'
import { gerarRascunho } from '@/lib/ai/comparativo'

export type EnvioState = { error?: string }

const MAX_ARQUIVOS = 4

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

  const sourceText = String(formData.get('sourceText') ?? '').trim().slice(0, 6000)

  /*
   * Os prints já subiram direto do navegador para o Storage; aqui chegam só
   * os caminhos. Aceitamos apenas os que estão na pasta deste cliente e com
   * o formato que o servidor assinou — caminho inventado não passa.
   */
  const padrao = new RegExp(`^${session.id}/[0-9a-f-]{36}\\.(jpg|png|webp|avif|gif)$`)
  const imagePaths = formData
    .getAll('imagePaths')
    .map((item) => String(item))
    .filter((path) => padrao.test(path))
    .slice(0, MAX_ARQUIVOS)

  if (!sourceText && imagePaths.length === 0) {
    return { error: 'Envie o print da configuração ou cole o texto dela.' }
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

/** Assina o envio de um print. O navegador chama antes de submeter o formulário. */
export async function prepararPrint(contentType: string): Promise<{ signedUrl: string; path: string } | { error: string }> {
  const session = await getCustomerSession()
  if (!session) return { error: 'Sessão expirada. Entre de novo.' }
  if (!comparativosDisponiveis) return { error: INDISPONIVEL }
  const assinatura = await signPrintUpload(session.id, String(contentType))
  return assinatura ?? { error: 'Formato de imagem não aceito. Use JPG, PNG ou WebP.' }
}
