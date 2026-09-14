'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { getPublicClient, getAdminClient } from '@/lib/supabase/server'
import { getRepository } from '@/lib/repository'
import type { AdminRole } from '@/lib/types'

export type LoginState = { error?: string }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '/admin')

  if (!email || !password) return { error: 'Informe e-mail e senha.' }

  let session: { email: string; name: string; role: AdminRole } | null = null

  if (isSupabaseConfigured) {
    const { data, error } = await getPublicClient().auth.signInWithPassword({ email, password })
    if (error || !data.user) return { error: 'E-mail ou senha inválidos.' }

    const { data: profile } = await getAdminClient()
      .from('admin_users')
      .select('email, role, active, payload')
      .eq('email', email)
      .maybeSingle()

    if (!profile || profile.active === false) {
      return { error: 'Este usuário não tem acesso ao painel.' }
    }

    session = {
      email,
      name: (profile.payload as { name?: string } | null)?.name ?? email,
      role: profile.role as AdminRole,
    }
  } else {
    const demoEmail = (process.env.ADMIN_DEMO_EMAIL ?? 'admin@uparai.com.br').toLowerCase()
    const demoPassword = process.env.ADMIN_DEMO_PASSWORD ?? 'upar-ai-demo'
    if (email !== demoEmail || password !== demoPassword) {
      return { error: 'E-mail ou senha inválidos.' }
    }
    const users = await getRepository().listUsers()
    const profile = users.find((user) => user.email.toLowerCase() === email)
    session = {
      email,
      name: profile?.name ?? 'Administrador UPAR',
      role: profile?.role ?? 'administrador',
    }
  }

  const token = await createSessionToken(session)
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  await getRepository().log({
    actor: session.email,
    action: 'auth.login',
    entity: 'painel',
    detail: `Perfil: ${session.role}`,
  })

  redirect(next.startsWith('/admin') ? next : '/admin')
}

export async function logout() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect('/admin/login')
}
