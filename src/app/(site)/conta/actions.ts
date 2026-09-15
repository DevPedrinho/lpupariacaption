'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { CUSTOMER_COOKIE, CUSTOMER_SESSION_MAX_AGE, createCustomerToken } from '@/lib/customer-auth'
import { hasServiceRole, isSupabaseConfigured } from '@/lib/supabase/config'
import { getAdminClient, getPublicClient } from '@/lib/supabase/server'

export type ContaState = { error?: string; fieldErrors?: Record<string, string> }

const INDISPONIVEL =
  'A área do cliente ainda não está configurada neste ambiente. ' +
  'Fale com a UPAR pelo WhatsApp enquanto isso.'

/** Normaliza para dígitos: é o formato que o vendedor cola no discador. */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

const signupSchema = z.object({
  name: z.string().trim().min(3, 'Informe seu nome completo.'),
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  whatsapp: z
    .string()
    .transform(onlyDigits)
    .refine((v) => v.length >= 10 && v.length <= 13, 'Informe o WhatsApp com DDD.'),
  password: z.string().min(8, 'A senha precisa de ao menos 8 caracteres.'),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  password: z.string().min(1, 'Informe a senha.'),
})

function collectErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form'
    if (!fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return fieldErrors
}

async function setSession(payload: { id: string; name: string; email: string }): Promise<void> {
  const token = await createCustomerToken(payload)
  const store = await cookies()
  store.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: CUSTOMER_SESSION_MAX_AGE,
  })
}

/* ---------------------------------- Cadastro -------------------------------- */

export async function signup(_prev: ContaState, formData: FormData): Promise<ContaState> {
  if (!isSupabaseConfigured || !hasServiceRole) return { error: INDISPONIVEL }

  const parsed = signupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    whatsapp: formData.get('whatsapp'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: 'Confira os campos destacados.', fieldErrors: collectErrors(parsed.error) }
  }
  const { name, email, whatsapp, password } = parsed.data

  const { data, error } = await getPublicClient().auth.signUp({ email, password })
  if (error || !data.user) {
    // A mensagem do Supabase vem em inglês e às vezes expõe detalhe interno.
    const duplicada = error?.message?.toLowerCase().includes('already')
    return {
      error: duplicada
        ? 'Já existe uma conta com este e-mail. Entre com a sua senha.'
        : 'Não foi possível criar a conta agora. Tente novamente em instantes.',
    }
  }

  const { error: perfilError } = await getAdminClient()
    .from('customers')
    .upsert({ id: data.user.id, name, email, whatsapp }, { onConflict: 'id' })

  if (perfilError) {
    console.error('Falha ao gravar o cadastro do cliente', perfilError)
    return { error: 'Conta criada, mas o cadastro não foi salvo. Fale com a UPAR pelo WhatsApp.' }
  }

  await setSession({ id: data.user.id, name, email })
  redirect(String(formData.get('next') || '/comparativo'))
}

/* ----------------------------------- Login ---------------------------------- */

export async function login(_prev: ContaState, formData: FormData): Promise<ContaState> {
  if (!isSupabaseConfigured || !hasServiceRole) return { error: INDISPONIVEL }

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: 'Confira os campos destacados.', fieldErrors: collectErrors(parsed.error) }
  }
  const { email, password } = parsed.data

  const { data, error } = await getPublicClient().auth.signInWithPassword({ email, password })
  if (error || !data.user) return { error: 'E-mail ou senha inválidos.' }

  const { data: perfil } = await getAdminClient()
    .from('customers')
    .select('name, email')
    .eq('id', data.user.id)
    .maybeSingle()

  await setSession({
    id: data.user.id,
    name: perfil?.name ?? email,
    email: perfil?.email ?? email,
  })
  redirect(String(formData.get('next') || '/comparativo'))
}

/* ----------------------------------- Sair ----------------------------------- */

export async function logout(): Promise<void> {
  const store = await cookies()
  store.delete(CUSTOMER_COOKIE)
  redirect('/')
}
