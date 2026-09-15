import { requireSession } from '@/lib/admin-session'
import { can } from '@/lib/auth'
import { AdminShell } from '@/components/admin/AdminShell'
import { ADMIN_NAV } from '@/lib/admin-nav'
import { countPending } from '@/lib/comparativos'
import { logout } from '../auth-actions'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()
  const pendentes = can(session.role, 'comparativos') ? await countPending() : 0
  const items = ADMIN_NAV.filter((item) => can(session.role, item.capability)).map((item) =>
    item.href === '/admin/comparativos' ? { ...item, badge: pendentes } : item,
  )

  return (
    <AdminShell
      items={items}
      user={{ name: session.name, email: session.email, role: session.role }}
      onLogout={logout}
    >
      {children}
    </AdminShell>
  )
}
