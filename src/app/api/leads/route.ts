import { NextResponse } from 'next/server'
import { getRepository } from '@/lib/repository'
import { leadSchema } from '@/lib/validation'
import { enviarLeadKlip, klipConfigurado } from '@/lib/klip'

export const runtime = 'nodejs'

/**
 * Registro de leads. Os dados nunca são expostos publicamente: a leitura
 * acontece apenas no painel administrativo autenticado.
 */
export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido.' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(payload)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || 'form'
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return NextResponse.json({ error: 'Verifique os campos destacados.', fieldErrors }, { status: 422 })
  }

  const { consent: _consent, ...data } = parsed.data

  // O lead vai para o banco do site e para o Klip; basta um dos dois funcionar.
  const limpo = {
    ...data,
    company: data.company || undefined,
    email: data.email || undefined,
    city: data.city || undefined,
    state: data.state || undefined,
  }
  const [banco, klip] = await Promise.allSettled([
    (async () => {
      const repo = getRepository()
      const lead = await repo.createLead(limpo)
      await repo.log({
        actor: 'site',
        action: 'lead.created',
        entity: `lead:${lead.id}`,
        detail: `Origem: ${lead.origin}`,
      })
      return lead.id
    })(),
    enviarLeadKlip(limpo),
  ])
  if (banco.status === 'rejected') console.error('Falha ao registrar lead no banco', banco.reason)
  if (klip.status === 'rejected') console.error('Falha ao mandar lead pro Klip', klip.reason)
  const okBanco = banco.status === 'fulfilled'
  const okKlip = klip.status === 'fulfilled' && klipConfigurado()
  if (okBanco || okKlip) {
    return NextResponse.json({ id: okBanco ? banco.value : null, klip: okKlip ? klip.value : null }, { status: 201 })
  }
  return NextResponse.json(
    { error: 'Não foi possível registrar agora. Fale com um especialista pelo WhatsApp.' },
    { status: 500 },
  )
}
