import Link from 'next/link'
import { requireSession } from '@/lib/admin-session'
import { AdminHeader, EmptyState, Panel, TableWrapper, Td, Th } from '@/components/admin/ui'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { formatDateTime } from '@/lib/format'
import { STATUS_LABEL, comparativosDisponiveis, listInbox, type ComparisonStatus } from '@/lib/comparativos'

function tone(status: ComparisonStatus) {
  if (status === 'novo') return 'brand' as const
  if (status === 'respondido') return 'positive' as const
  if (status === 'encerrado') return 'neutral' as const
  return 'flux' as const
}

export default async function ComparativosPage() {
  await requireSession('comparativos')

  if (!comparativosDisponiveis) {
    return (
      <>
        <AdminHeader title="Comparativos" description="Configurações que os clientes mandaram para análise." />
        <Panel>
          <EmptyState
            title="Módulo não configurado neste ambiente"
            description="Defina SUPABASE_SERVICE_ROLE_KEY para que os comparativos sejam gravados e lidos."
          />
        </Panel>
      </>
    )
  }

  const itens = await listInbox()
  const aguardando = itens.filter((i) => i.status === 'novo' || i.status === 'em_analise').length

  return (
    <>
      <AdminHeader
        title="Comparativos"
        description={
          aguardando > 0
            ? `${aguardando} aguardando resposta de um consultor.`
            : 'Nenhum comparativo aguardando resposta.'
        }
      />

      <Panel>
        {itens.length === 0 ? (
          <EmptyState
            title="Nenhum comparativo ainda"
            description="Quando um cliente enviar a configuração que encontrou, ela aparece aqui."
          />
        ) : (
          <TableWrapper>
            <thead>
              <tr>
                <Th>Cliente</Th>
                <Th className="hidden md:table-cell">WhatsApp</Th>
                <Th>Enviado</Th>
                <Th>Situação</Th>
                <Th className="text-right">Abrir</Th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id} className="align-top">
                  <Td>
                    <span className="font-medium text-white">{item.customer?.name ?? 'Cliente removido'}</span>
                    <span className="mt-0.5 block text-xs text-ink-400">{item.customer?.email}</span>
                    <span className="mt-1.5 block max-w-md truncate text-xs text-ink-400">
                      {item.sourceText || `${item.imagePaths.length} imagem(ns)`}
                    </span>
                  </Td>
                  <Td className="hidden md:table-cell text-ink-300">{item.customer?.whatsapp ?? '—'}</Td>
                  <Td className="text-ink-300">{formatDateTime(item.createdAt)}</Td>
                  <Td>
                    <Badge tone={tone(item.status)}>{STATUS_LABEL[item.status]}</Badge>
                  </Td>
                  <Td className="text-right">
                    <Link
                      href={`/admin/comparativos/${item.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 hover:text-brand-200"
                    >
                      Abrir
                      <Icon name="arrowRight" className="size-4" />
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}
      </Panel>
    </>
  )
}
