import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { AdminHeader, Panel, TableWrapper, Td, Th } from '@/components/admin/ui'
import { Badge } from '@/components/ui/Badge'
import { ROLE_DESCRIPTION, ROLE_LABEL } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { formatDate } from '@/lib/format'
import type { AdminRole } from '@/lib/types'

const ROLES: AdminRole[] = ['administrador', 'gestor_comercial', 'editor_conteudo', 'consultor_vendas']

export default async function UsersPage() {
  await requireSession('usuarios')
  const users = await getRepository().listUsers()

  return (
    <>
      <AdminHeader
        title="Usuários e permissões"
        description="Quatro perfis com escopos distintos de acesso ao painel."
      />

      {!isSupabaseConfigured && (
        <Panel className="mb-5 border-caution-500/30 bg-caution-500/6">
          <p className="text-sm leading-relaxed text-[#F0C560]">
            O Supabase ainda não está configurado. Enquanto isso, o acesso ao painel usa as credenciais de
            demonstração e a lista abaixo é apenas ilustrativa. Após conectar o Supabase, os usuários passam a
            ser criados no <strong>Supabase Auth</strong> e vinculados a um perfil na tabela{' '}
            <code className="rounded bg-black/25 px-1 py-0.5 text-xs">admin_users</code>.
          </p>
        </Panel>
      )}

      <TableWrapper>
        <thead>
          <tr>
            <Th>Usuário</Th>
            <Th className="hidden sm:table-cell">Perfil</Th>
            <Th className="hidden lg:table-cell">Criado em</Th>
            <Th>Situação</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-700/50">
          {users.map((user) => (
            <tr key={user.id}>
              <Td>
                <span className="font-medium text-white">{user.name}</span>
                <span className="block text-xs text-ink-400">{user.email}</span>
              </Td>
              <Td className="hidden sm:table-cell">{ROLE_LABEL[user.role]}</Td>
              <Td className="hidden lg:table-cell text-ink-400">{formatDate(user.createdAt)}</Td>
              <Td>
                <Badge tone={user.active ? 'positive' : 'neutral'}>{user.active ? 'Ativo' : 'Inativo'}</Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {ROLES.map((role) => (
          <Panel key={role}>
            <h2 className="text-base font-semibold text-white">{ROLE_LABEL[role]}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">{ROLE_DESCRIPTION[role]}</p>
          </Panel>
        ))}
      </div>
    </>
  )
}
