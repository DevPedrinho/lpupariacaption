import { getSession } from '@/lib/admin-session'
import { can } from '@/lib/auth'
import { getRepository } from '@/lib/repository'
import { leadStatusLabel } from '@/lib/format'
import { questions } from '@/lib/diagnostic'

export const runtime = 'nodejs'

function escape(value: unknown): string {
  const text = value === undefined || value === null ? '' : String(value)
  return `"${text.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
}

/** Exportação de leads em CSV, restrita a perfis com acesso a leads. */
export async function GET(request: Request) {
  const session = await getSession()
  if (!session || !can(session.role, 'leads')) {
    return new Response('Não autorizado', { status: 401 })
  }

  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const origin = url.searchParams.get('origem')
  const term = url.searchParams.get('busca')?.toLowerCase()

  const repo = getRepository()
  const leads = (await repo.listLeads()).filter((lead) => {
    if (status && lead.status !== status) return false
    if (origin && lead.origin !== origin) return false
    if (term) {
      const haystack = [lead.name, lead.company, lead.email, lead.phone, lead.city]
        .filter(Boolean).join(' ').toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })

  const diagnosticColumns = questions.map((question) => question.title)
  const header = [
    'ID', 'Data', 'Nome', 'Empresa', 'Telefone', 'E-mail', 'Cidade', 'Estado',
    'Aplicação', 'Produto visualizado', 'Configurações comparadas', 'Categoria indicada',
    'Faixa de investimento', 'Prazo de compra', 'Origem', 'Página de origem', 'UTM',
    'Status', 'Consultor', 'Anotações', ...diagnosticColumns,
  ]

  const rows = leads.map((lead) => [
    lead.id,
    lead.createdAt,
    lead.name,
    lead.company,
    lead.phone,
    lead.email,
    lead.city,
    lead.state,
    lead.application,
    lead.productSlug,
    lead.comparedSlugs?.join(' | '),
    lead.recommendedTier,
    lead.budgetRange,
    lead.purchaseWindow,
    lead.origin,
    lead.originPath,
    lead.utm ? Object.entries(lead.utm).map(([key, value]) => `${key}=${value}`).join(' | ') : '',
    leadStatusLabel[lead.status],
    lead.owner,
    lead.notes,
    ...questions.map((question) => lead.diagnostic?.[question.key] ?? ''),
  ])

  // BOM para o Excel reconhecer acentuação corretamente.
  const csv = '﻿' + [header, ...rows].map((row) => row.map(escape).join(';')).join('\r\n')
  const today = new Date().toISOString().slice(0, 10)

  await repo.log({
    actor: session.email,
    action: 'leads.exportados',
    entity: 'leads',
    detail: `${leads.length} registros`,
  })

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-upar-ai-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
