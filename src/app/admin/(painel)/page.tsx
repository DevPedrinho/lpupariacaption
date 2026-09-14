import Link from 'next/link'
import { requireSession } from '@/lib/admin-session'
import { can } from '@/lib/auth'
import { getRepository } from '@/lib/repository'
import { AdminHeader, EmptyState, Panel, Stat, TableWrapper, Td, Th } from '@/components/admin/ui'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { formatDateTime, leadStatusLabel, leadStatusOrder } from '@/lib/format'

export default async function DashboardPage() {
  const session = await requireSession('dashboard')
  const repo = getRepository()

  const [leads, products, articles, settings, logs] = await Promise.all([
    can(session.role, 'leads') ? repo.listLeads() : Promise.resolve([]),
    repo.listProducts({ includeDrafts: true }),
    repo.listArticles(true),
    repo.getSettings(),
    can(session.role, 'logs') ? repo.listAuditLogs(6) : Promise.resolve([]),
  ])

  const now = Date.now()
  const last30 = leads.filter((lead) => now - new Date(lead.createdAt).getTime() < 30 * 864e5)
  const openLeads = leads.filter(
    (lead) => !['venda_concluida', 'perdido'].includes(lead.status),
  )
  const byStatus = leadStatusOrder.map((status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length,
  }))

  return (
    <>
      <AdminHeader
        title={`Olá, ${session.name.split(' ')[0]}`}
        description="Resumo da operação comercial e do conteúdo publicado."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {can(session.role, 'leads') && (
          <>
            <Stat label="Leads (30 dias)" value={last30.length} tone="brand" hint={`${leads.length} no total`} />
            <Stat label="Em aberto" value={openLeads.length} hint="Aguardando alguma ação comercial" />
          </>
        )}
        <Stat
          label="Produtos publicados"
          value={products.filter((product) => product.status === 'published').length}
          hint={`${products.filter((p) => p.status === 'draft').length} em rascunho`}
        />
        <Stat
          label="Artigos publicados"
          value={articles.filter((article) => article.status === 'published').length}
          hint={`${articles.filter((a) => a.status === 'draft').length} em rascunho`}
        />
      </div>

      {settings.pendingRealData.length > 0 && can(session.role, 'configuracoes') && (
        <Panel className="mt-5 border-caution-500/30 bg-caution-500/6">
          <div className="flex items-start gap-3">
            <Icon name="info" className="mt-0.5 size-5 shrink-0 text-[#F0C560]" />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-white">
                Dados reais pendentes ({settings.pendingRealData.length})
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
                O site está publicado com conteúdo demonstrativo nestes pontos. Cada item resolvido deixa a
                comunicação mais precisa — e alguns são obrigatórios antes de colocar o site no ar.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {settings.pendingRealData.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-200">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[#F0C560]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/admin/configuracoes"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-flux-300 hover:text-flux-400"
              >
                Ir para configurações
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          </div>
        </Panel>
      )}

      {can(session.role, 'leads') && (
        <div className="mt-5 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <Panel>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-white">Leads recentes</h2>
              <Link href="/admin/leads" className="text-sm text-flux-300 hover:text-flux-400">
                Ver todos
              </Link>
            </div>

            {leads.length === 0 ? (
              <EmptyState
                title="Nenhum lead registrado"
                description="Os contatos enviados pelo diagnóstico, pelo formulário e pelas páginas de produto aparecem aqui."
              />
            ) : (
              <TableWrapper>
                <thead>
                  <tr>
                    <Th>Contato</Th>
                    <Th className="hidden sm:table-cell">Origem</Th>
                    <Th>Status</Th>
                    <Th className="hidden md:table-cell">Data</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-700/50">
                  {leads.slice(0, 6).map((lead) => (
                    <tr key={lead.id}>
                      <Td>
                        <Link href={`/admin/leads?lead=${lead.id}`} className="font-medium text-white hover:text-flux-300">
                          {lead.name}
                        </Link>
                        {lead.company && <span className="block text-xs text-ink-400">{lead.company}</span>}
                      </Td>
                      <Td className="hidden sm:table-cell capitalize">{lead.origin}</Td>
                      <Td>
                        <Badge tone={lead.status === 'novo' ? 'brand' : 'neutral'}>
                          {leadStatusLabel[lead.status]}
                        </Badge>
                      </Td>
                      <Td className="hidden md:table-cell text-ink-400">{formatDateTime(lead.createdAt)}</Td>
                    </tr>
                  ))}
                </tbody>
              </TableWrapper>
            )}
          </Panel>

          <Panel>
            <h2 className="mb-4 text-base font-semibold text-white">Funil comercial</h2>
            <ul className="flex flex-col gap-2.5">
              {byStatus.map((entry) => {
                const percentage = leads.length > 0 ? (entry.count / leads.length) * 100 : 0
                return (
                  <li key={entry.status}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-ink-200">{leadStatusLabel[entry.status]}</span>
                      <span className="text-ink-400">{entry.count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-800">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-brand-500 to-flux-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>
      )}

      {logs.length > 0 && (
        <Panel className="mt-5">
          <h2 className="mb-4 text-base font-semibold text-white">Últimas alterações</h2>
          <ul className="flex flex-col gap-3">
            {logs.map((log) => (
              <li key={log.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                <span className="text-ink-400">{formatDateTime(log.at)}</span>
                <span className="font-medium text-white">{log.actor}</span>
                <span className="text-ink-200">{log.action}</span>
                <span className="text-ink-400">{log.entity}</span>
                {log.detail && <span className="text-ink-500">— {log.detail}</span>}
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  )
}
