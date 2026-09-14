import { NextResponse } from 'next/server'
import { getRepository } from '@/lib/repository'
import { leadSchema } from '@/lib/validation'

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

  try {
    const repo = getRepository()
    const lead = await repo.createLead({
      ...data,
      company: data.company || undefined,
      email: data.email || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
    })
    await repo.log({
      actor: 'site',
      action: 'lead.created',
      entity: `lead:${lead.id}`,
      detail: `Origem: ${lead.origin}`,
    })
    return NextResponse.json({ id: lead.id }, { status: 201 })
  } catch (error) {
    console.error('Falha ao registrar lead', error)
    return NextResponse.json(
      { error: 'Não foi possível registrar agora. Fale com um especialista pelo WhatsApp.' },
      { status: 500 },
    )
  }
}
