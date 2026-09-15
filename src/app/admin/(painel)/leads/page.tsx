import Link from 'next/link'
import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { AdminHeader, EmptyState, Panel, TableWrapper, Td, Th } from '@/components/admin/ui'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { formatDateTime, leadStatusLabel, leadStatusOrder } from '@/lib/format'
import { questions } from '@/lib/diagnostic'
import { updateLead } from '../../actions'
import type { Lead, LeadStatus } from '@/lib/types'

const ORIGINS = ['diagnostico', 'produto', 'comparativo', 'contato', 'consultoria', 'catalogo'] as const

const control =
  'h-10 rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/35 focus:outline-none'

function statusTone(status: LeadStatus) {
  if (status === 'novo') return 'brand' as const
  if (status === 'venda_concluida') return 'positive' as const
  if (status === 'perdido') return 'neutral' as const
  return 'flux' as const
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; origem?: string; busca?: string; lead?: string }>
}) {
  const session = await requireSession('leads')
  const params = await searchParams
  const repo = getRepository()
  const [all, users] = await Promise.all([repo.listLeads(), repo.listUsers()])

  const filtered = all.filter((lead) => {
    if (params.status && lead.status !== params.status) return false
    if (params.origem && lead.origin !== params.origem) return false
    if (params.busca) {
      const term = params.busca.toLowerCase()
      const haystack = [lead.name, lead.company, lead.email, lead.phone, lead.city, lead.application]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })

  const selected = params.lead ? all.find((lead) => lead.id === params.lead) : undefined
  const csvQuery = new URLSearchParams(
    Object.entries(params).filter(([key, value]) => key !== 'lead' && value) as [string, string][],
  ).toString()

  return (
    <>
      <AdminHeader
        title="Leads"
        description="Contatos captados pelo diagnóstico, pelas páginas de produto, pelo comparativo e pelos formulários."
        actions={
          <a
            href={`/api/admin/leads/csv${csvQuery ? `?${csvQuery}` : ''}`}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-ink-600/70 bg-ink-800/70 px-4 text-sm font-medium text-ink-50 transition-colors hover:border-ink-500"
          >
            <Icon name="download" className="size-4" />
            Exportar CSV
          </a>
        }
      />

      <Panel className="mb-5">
        <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="busca" className="mb-1.5 block text-xs text-ink-400">Buscar</label>
            <input
              id="busca"
              name="busca"
              defaultValue={params.busca ?? ''}
              placeholder="Nome, empresa, telefone, e-mail ou cidade"
              className={`${control} w-full`}
            />
          </div>
          <div>
            <label htmlFor="status" className="mb-1.5 block text-xs text-ink-400">Status</label>
            <select id="status" name="status" defaultValue={params.status ?? ''} className={control}>
              <option value="">Todos</option>
              {leadStatusOrder.map((status) => (
                <option key={status} value={status}>{leadStatusLabel[status]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="origem" className="mb-1.5 block text-xs text-ink-400">Origem</label>
            <select id="origem" name="origem" defaultValue={params.origem ?? ''} className={control}>
              <option value="">Todas</option>
              {ORIGINS.map((origin) => (
                <option key={origin} value={origin} className="capitalize">{origin}</option>
              ))}
            </select>
          </div>
          <Button type="submit" size="md">Filtrar</Button>
          {(params.status || params.origem || params.busca) && (
            <Link
              href="/admin/leads"
              className="inline-flex h-11 items-center px-3 text-sm text-ink-300 hover:text-white"
            >
              Limpar
            </Link>
          )}
        </form>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="mb-3 text-sm text-ink-400">
            {filtered.length} {filtered.length === 1 ? 'lead' : 'leads'}
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              title="Nenhum lead com esses filtros"
              description="Ajuste os filtros ou aguarde novos contatos. Todo envio do site cai automaticamente nesta lista."
            />
          ) : (
            <TableWrapper>
              <thead>
                <tr>
                  <Th>Contato</Th>
                  <Th className="hidden md:table-cell">Origem</Th>
                  <Th>Status</Th>
                  <Th className="hidden lg:table-cell">Recebido em</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700/50">
                {filtered.map((lead) => (
                  <tr key={lead.id} className={lead.id === params.lead ? 'bg-brand-500/8' : undefined}>
                    <Td>
                      <Link
                        href={`/admin/leads?${new URLSearchParams({ ...params, lead: lead.id } as Record<string, string>).toString()}`}
                        className="font-medium text-white hover:text-flux-300"
                      >
                        {lead.name}
                      </Link>
                      <span className="block text-xs text-ink-400">
                        {[lead.company, lead.phone].filter(Boolean).join(' · ')}
                      </span>
                    </Td>
                    <Td className="hidden md:table-cell capitalize">{lead.origin}</Td>
                    <Td>
                      <Badge tone={statusTone(lead.status)}>{leadStatusLabel[lead.status]}</Badge>
                    </Td>
                    <Td className="hidden lg:table-cell text-ink-400">{formatDateTime(lead.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
          )}
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          {selected ? (
            <LeadDetail lead={selected} consultants={users.map((user) => user.email)} />
          ) : (
            <Panel>
              <p className="text-sm text-ink-400">
                Selecione um lead na lista para ver o diagnóstico completo, a origem e atualizar o status
                comercial.
              </p>
            </Panel>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-ink-500">
        Acesso registrado como {session.email}. Toda alteração de status fica gravada nos registros.
      </p>
    </>
  )
}

function LeadDetail({ lead, consultants }: { lead: Lead; consultants: string[] }) {
  const info: { label: string; value?: string }[] = [
    { label: 'Empresa', value: lead.company },
    { label: 'Telefone', value: lead.phone },
    { label: 'E-mail', value: lead.email },
    { label: 'Cidade / UF', value: [lead.city, lead.state].filter(Boolean).join(' / ') },
    { label: 'Aplicação pretendida', value: lead.application },
    { label: 'Produto visualizado', value: lead.productSlug },
    { label: 'Configurações comparadas', value: lead.comparedSlugs?.join(', ') },
    { label: 'Categoria indicada', value: lead.recommendedTier },
    { label: 'Faixa de investimento', value: lead.budgetRange },
    { label: 'Prazo de compra', value: lead.purchaseWindow },
    { label: 'Página de origem', value: lead.originPath },
    { label: 'Campanha (UTM)', value: lead.utm ? Object.entries(lead.utm).map(([k, v]) => `${k}=${v}`).join(' · ') : undefined },
    { label: 'Recebido em', value: formatDateTime(lead.createdAt) },
  ].filter((item) => item.value)

  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{lead.name}</h2>
          <p className="mt-0.5 text-sm text-ink-400 capitalize">Origem: {lead.origin}</p>
        </div>
        <Link href="/admin/leads" className="text-ink-400 transition-colors hover:text-white" aria-label="Fechar detalhe">
          <Icon name="close" className="size-4" />
        </Link>
      </div>

      <dl className="mt-5 flex flex-col gap-3 border-t border-ink-700/60 pt-5">
        {info.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-ink-400">{item.label}</dt>
            <dd className="text-sm break-words text-ink-100">{item.value}</dd>
          </div>
        ))}
      </dl>

      {lead.message && (
        <div className="mt-5 border-t border-ink-700/60 pt-5">
          <h3 className="text-xs text-ink-400">Mensagem</h3>
          <p className="mt-1 text-sm leading-relaxed whitespace-pre-line text-ink-100">{lead.message}</p>
        </div>
      )}

      {lead.diagnostic && (
        <div className="mt-5 border-t border-ink-700/60 pt-5">
          <h3 className="text-sm font-medium text-white">Respostas do diagnóstico</h3>
          <dl className="mt-3 flex flex-col gap-2.5">
            {questions.map((question) =>
              lead.diagnostic?.[question.key] ? (
                <div key={question.key}>
                  <dt className="text-xs text-ink-400">{question.title}</dt>
                  <dd className="text-sm text-ink-100">{lead.diagnostic[question.key]}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </div>
      )}

      <form action={updateLead} className="mt-6 flex flex-col gap-4 border-t border-ink-700/60 pt-5">
        <input type="hidden" name="id" value={lead.id} />

        <div>
          <label htmlFor={`status-${lead.id}`} className="mb-1.5 block text-xs text-ink-400">
            Status comercial
          </label>
          <select
            id={`status-${lead.id}`}
            name="status"
            defaultValue={lead.status}
            className="h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
          >
            {leadStatusOrder.map((status) => (
              <option key={status} value={status}>{leadStatusLabel[status]}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`owner-${lead.id}`} className="mb-1.5 block text-xs text-ink-400">
            Consultor responsável
          </label>
          <select
            id={`owner-${lead.id}`}
            name="owner"
            defaultValue={lead.owner ?? ''}
            className="h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
          >
            <option value="">Sem responsável</option>
            {consultants.map((email) => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`notes-${lead.id}`} className="mb-1.5 block text-xs text-ink-400">
            Anotações internas
          </label>
          <textarea
            id={`notes-${lead.id}`}
            name="notes"
            defaultValue={lead.notes ?? ''}
            rows={3}
            className="w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 py-2.5 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <Button type="submit" size="md">Salvar alterações</Button>
      </form>
    </Panel>
  )
}
