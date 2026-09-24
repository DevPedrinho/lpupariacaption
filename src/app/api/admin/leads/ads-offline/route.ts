import { getSession } from '@/lib/admin-session'
import { can } from '@/lib/auth'
import { getRepository } from '@/lib/repository'

export const runtime = 'nodejs'

/** Nome da ação de conversão no Google Ads. O gestor cria uma ação "importada" com este nome. */
const ADS_OFFLINE_CONVERSION = 'Venda fechada'
const FUSO = 'America/Fortaleza'

/** Data no formato que a importação do Google Ads aceita: yyyy-MM-dd HH:mm:ss. */
function formatoAds(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSO,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(new Date(iso))
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`
}

function escape(value: unknown): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

/**
 * Conversões offline para o Google Ads: cada lead marcado como "venda
 * concluída" que chegou por um clique de anúncio (gclid) vira uma linha no
 * formato de importação do Ads. É o que fecha o ciclo — o Ads passa a otimizar
 * para quem compra, não só para quem clica.
 */
export async function GET() {
  const session = await getSession()
  if (!session || !can(session.role, 'leads')) {
    return new Response('Não autorizado', { status: 401 })
  }

  const repo = getRepository()
  const vendas = (await repo.listLeads()).filter(
    (lead) => lead.status === 'venda_concluida' && lead.utm?.gclid,
  )

  const header = ['Google Click ID', 'Conversion Name', 'Conversion Time', 'Conversion Value', 'Conversion Currency']
  const rows = vendas.map((lead) => [
    lead.utm?.gclid,
    ADS_OFFLINE_CONVERSION,
    formatoAds(lead.closedAt ?? lead.createdAt),
    '',
    'BRL',
  ])

  // A primeira linha informa o fuso das datas, como o Google pede.
  const csv = [`Parameters:TimeZone=${FUSO};`, header.map(escape).join(','), ...rows.map((row) => row.map(escape).join(','))].join('\r\n')
  const today = new Date().toISOString().slice(0, 10)

  await repo.log({
    actor: session.email,
    action: 'leads.conversoes_exportadas',
    entity: 'leads',
    detail: `${vendas.length} vendas com gclid`,
  })

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="conversoes-google-ads-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
