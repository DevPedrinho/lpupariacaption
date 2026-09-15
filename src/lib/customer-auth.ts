import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { signPayload, verifyPayload } from './auth'

/* ============================================================================
   Sessão do cliente

   Mesma mecânica do painel — token assinado com HMAC em cookie httpOnly — mas
   com cookie e validade próprios. A senha é verificada pelo Supabase Auth; o
   cookie só carrega quem é, para não consultar o banco a cada navegação.

   O cadastro não exige confirmação por e-mail: essa foi uma decisão de projeto
   para o módulo funcionar sem contratar serviço de envio. Isso significa que um
   e-mail aqui não é um e-mail verificado — o canal de contato confiável é o
   WhatsApp, que a equipe usa para ligar.
   ========================================================================== */

export const CUSTOMER_COOKIE = 'upar_cliente_sessao'

/** Trinta dias: o cliente volta para acompanhar a conversa, não para trabalhar. */
const TTL_SECONDS = 60 * 60 * 24 * 30
export const CUSTOMER_SESSION_MAX_AGE = TTL_SECONDS

export type CustomerSession = {
  id: string
  name: string
  email: string
  exp: number
}

export async function createCustomerToken(payload: Omit<CustomerSession, 'exp'>): Promise<string> {
  return signPayload(payload, TTL_SECONDS)
}

/** Lê a sessão do cliente. Retorna null quando não há sessão válida. */
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const store = await cookies()
  return verifyPayload<CustomerSession>(store.get(CUSTOMER_COOKIE)?.value)
}

/** Garante cliente autenticado, devolvendo para o login com o destino original. */
export async function requireCustomer(next = '/comparativo'): Promise<CustomerSession> {
  const session = await getCustomerSession()
  if (!session) redirect(`/entrar?next=${encodeURIComponent(next)}`)
  return session
}
