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

/** Segredo mínimo aceitável para a assinatura HMAC da sessão. */
const MIN_SECRET_LENGTH = 32

/**
 * Em produção o segredo é obrigatório: sem ele não há sessão possível.
 * O valor padrão de desenvolvimento é público no repositório — se valesse em
 * produção, qualquer pessoa conseguiria forjar um cookie de administrador.
 */
function secret(): string | null {
  const configured = process.env.ADMIN_SESSION_SECRET
  if (configured && configured.length >= MIN_SECRET_LENGTH) return configured
  if (process.env.NODE_ENV === 'production') return null
  return 'upar-ai-chave-de-desenvolvimento-nao-usar-em-producao'
}

/** Indica se o ambiente tem segredo de sessão utilizável. */
export function isSessionSecretConfigured(): boolean {
  return secret() !== null
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

async function key(): Promise<CryptoKey | null> {
  const value = secret()
  if (!value) return null
  return crypto.subtle.importKey(
    'raw',
    encode(value),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

/**
 * Assina qualquer carga com o mesmo segredo e acrescenta a expiração.
 *
 * A sessão do cliente (`customer-auth.ts`) usa esta mesma função, com cookie e
 * tempo de vida próprios. O segredo é um só: se ele faltar, nem o painel nem a
 * área do cliente abrem — as duas falham fechadas juntas.
 */
export async function signPayload<T extends object>(payload: T, ttlSeconds: number): Promise<string> {
  const signingKey = await key()
  if (!signingKey) {
    throw new Error(
      'ADMIN_SESSION_SECRET ausente ou muito curto. Defina uma chave de ao menos ' +
        `${MIN_SECRET_LENGTH} caracteres para habilitar as áreas autenticadas.`,
    )
  }
  const withExpiry = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds }
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(withExpiry)))
  const signature = await crypto.subtle.sign('HMAC', signingKey, encode(body))
  return `${body}.${toBase64Url(new Uint8Array(signature))}`
}

/** Verifica a assinatura e a validade. Retorna null em qualquer falha. */
export async function verifyPayload<T extends { exp: number }>(token: string | undefined): Promise<T | null> {
  if (!token) return null
  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  try {
    const signingKey = await key()
    // Sem segredo configurado nenhuma sessão é aceita: falha fechada.
    if (!signingKey) return null

    const valid = await crypto.subtle.verify('HMAC', signingKey, fromBase64Url(signature), encode(body))
    if (!valid) return null

    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as T
    if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null
    return parsed
  } catch {
    return null
  }
}

export async function createSessionToken(payload: Omit<Session, 'exp'>): Promise<string> {
  return signPayload(payload, SESSION_TTL_SECONDS)
}

export async function verifySessionToken(token: string | undefined): Promise<Session | null> {
  return verifyPayload<Session>(token)
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS

/* ------------------------------- Permissões -------------------------------- */

export type Capability =
  | 'dashboard'
  | 'produtos'
  | 'leads'
  | 'comparativos'
  | 'conteudos'
  | 'configuracoes'
  | 'usuarios'
  | 'logs'

const ROLE_CAPABILITIES: Record<AdminRole, Capability[]> = {
  administrador: ['dashboard', 'produtos', 'leads', 'comparativos', 'conteudos', 'configuracoes', 'usuarios', 'logs'],
  gestor_comercial: ['dashboard', 'produtos', 'leads', 'comparativos', 'logs'],
  editor_conteudo: ['dashboard', 'conteudos', 'produtos'],
  consultor_vendas: ['dashboard', 'leads', 'comparativos'],
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
