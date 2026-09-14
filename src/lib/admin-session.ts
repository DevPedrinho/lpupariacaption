import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, can, verifySessionToken, type Capability, type Session } from './auth'

/** Lê a sessão no servidor. Retorna null quando não há sessão válida. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies()
  return verifySessionToken(store.get(SESSION_COOKIE)?.value)
}

/** Garante sessão válida e, opcionalmente, permissão para a área acessada. */
export async function requireSession(capability?: Capability): Promise<Session> {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (capability && !can(session.role, capability)) redirect('/admin')
  return session
}
