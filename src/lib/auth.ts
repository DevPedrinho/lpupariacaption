import type { AdminRole } from './types'

/* ============================================================================
   Sessão administrativa
   A sessão é um token assinado com HMAC-SHA256 guardado em cookie httpOnly.
   Usa Web Crypto para funcionar tanto no middleware quanto no servidor.

   Autenticação:
   - Com Supabase configurado, a verificação de senha acontece no Supabase Auth
     e o papel vem da tabela `admin_users`.
   - Sem Supabase, o acesso usa as credenciais de demonstração das variáveis
     ADMIN_DEMO_EMAIL / ADMIN_DEMO_PASSWORD (somente para homologação).
   ========================================================================== */

export const SESSION_COOKIE = 'upar_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 8

export type Session = {
  email: string
  name: string
  role: AdminRole
  exp: number
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || 'upar-ai-chave-de-desenvolvimento-trocar-em-producao'
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(new ArrayBuffer(binary.length))
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

function encode(value: string): Uint8Array<ArrayBuffer> {
  const source = new TextEncoder().encode(value)
  const bytes = new Uint8Array(new ArrayBuffer(source.byteLength))
  bytes.set(source)
  return bytes
}

async function key(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export async function createSessionToken(payload: Omit<Session, 'exp'>): Promise<string> {
  const session: Session = { ...payload, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(session)))
  const signature = await crypto.subtle.sign('HMAC', await key(), encode(body))
  return `${body}.${toBase64Url(new Uint8Array(signature))}`
}

export async function verifySessionToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null
  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  try {
    const valid = await crypto.subtle.verify(
      'HMAC',
      await key(),
      fromBase64Url(signature),
      encode(body),
    )
    if (!valid) return null

    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as Session
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null
    return session
  } catch {
    return null
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS

/* ------------------------------- Permissões -------------------------------- */

export type Capability =
  | 'dashboard'
  | 'produtos'
  | 'leads'
  | 'conteudos'
  | 'configuracoes'
  | 'usuarios'
  | 'logs'

const ROLE_CAPABILITIES: Record<AdminRole, Capability[]> = {
  administrador: ['dashboard', 'produtos', 'leads', 'conteudos', 'configuracoes', 'usuarios', 'logs'],
  gestor_comercial: ['dashboard', 'produtos', 'leads', 'logs'],
  editor_conteudo: ['dashboard', 'conteudos', 'produtos'],
  consultor_vendas: ['dashboard', 'leads'],
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  administrador: 'Administrador',
  gestor_comercial: 'Gestor comercial',
  editor_conteudo: 'Editor de conteúdo',
  consultor_vendas: 'Consultor de vendas',
}

export const ROLE_DESCRIPTION: Record<AdminRole, string> = {
  administrador: 'Acesso completo, incluindo configurações, usuários e registros de alteração.',
  gestor_comercial: 'Gerencia catálogo e leads, sem acesso a configurações do site.',
  editor_conteudo: 'Publica artigos, edita textos institucionais e conteúdo dos produtos.',
  consultor_vendas: 'Visualiza e atende os leads atribuídos, sem editar o catálogo.',
}

export function can(role: AdminRole, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role].includes(capability)
}
