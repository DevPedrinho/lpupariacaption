import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { AdminHeader, EmptyState, TableWrapper, Td, Th } from '@/components/admin/ui'
import { formatDateTime } from '@/lib/format'

export default async function LogsPage() {
  await requireSession('logs')
  const logs = await getRepository().listAuditLogs(120)

  return (
    <>
      <AdminHeader
        title="Registros de alteração"
        description="Histórico das ações administrativas: quem alterou, o que alterou e quando."
      />

      {logs.length === 0 ? (
        <EmptyState title="Nenhum registro ainda" description="As ações realizadas no painel aparecem aqui." />
      ) : (
        <TableWrapper>
          <thead>
            <tr>
              <Th>Quando</Th>
              <Th>Quem</Th>
              <Th>Ação</Th>
              <Th className="hidden md:table-cell">Item</Th>
              <Th className="hidden lg:table-cell">Detalhe</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700/50">
            {logs.map((log) => (
              <tr key={log.id}>
                <Td className="whitespace-nowrap text-ink-400">{formatDateTime(log.at)}</Td>
                <Td className="text-white">{log.actor}</Td>
                <Td>{log.action}</Td>
                <Td className="hidden md:table-cell text-ink-300">{log.entity}</Td>
                <Td className="hidden lg:table-cell text-ink-400">{log.detail}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      )}
    </>
  )
}
