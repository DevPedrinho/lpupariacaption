import type { Metadata } from 'next'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { isSessionSecretConfigured } from '@/lib/auth'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Acesso administrativo',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ proximo?: string }>
}) {
  const { proximo } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 grid-mesh opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(31,107,255,0.24), transparent 70%)',
        }}
      />

      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-brand-500 to-flux-500">
            <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" aria-hidden="true">
              <path d="M6 5.5v7.2A6 6 0 0 0 18 12.7V5.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
              <circle cx="6" cy="18.5" r="1.9" fill="currentColor" />
              <circle cx="18" cy="18.5" r="1.9" fill="currentColor" />
            </svg>
          </span>
          <span className="font-display text-[1.15rem] leading-none font-semibold text-white">
            UPAR<span className="ml-1 text-flux-400">AI</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-ink-700/70 bg-ink-880/80 p-7 backdrop-blur-xl md:p-9">
          {!isSessionSecretConfigured() && (
            <div className="mb-6 rounded-lg border border-critical-500/30 bg-critical-500/8 px-4 py-3.5 text-sm text-critical-500">
              <p className="font-medium">Painel indisponível</p>
              <p className="mt-1.5 leading-relaxed">
                A variável <code className="rounded bg-black/25 px-1 py-0.5 text-xs">ADMIN_SESSION_SECRET</code>{' '}
                não está definida neste ambiente, então nenhuma sessão pode ser criada. Configure-a para
                habilitar o acesso.
              </p>
            </div>
          )}
          <h1 className="text-2xl font-semibold text-white">Acesso administrativo</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-300">
            Área restrita para gestão de catálogo, leads e conteúdo.
          </p>

          <LoginForm next={proximo} />

          {!isSupabaseConfigured && process.env.NODE_ENV !== 'production' && (
            <div className="mt-7 rounded-lg border border-caution-500/30 bg-caution-500/8 px-4 py-3.5 text-sm text-[#F0C560]">
              <p className="font-medium">Modo de demonstração</p>
              <p className="mt-1.5 leading-relaxed">
                O Supabase ainda não está configurado. Use as credenciais definidas em{' '}
                <code className="rounded bg-black/25 px-1 py-0.5 text-xs">ADMIN_DEMO_EMAIL</code> e{' '}
                <code className="rounded bg-black/25 px-1 py-0.5 text-xs">ADMIN_DEMO_PASSWORD</code>. O padrão
                do repositório é <strong>admin@uparai.com.br</strong> / <strong>upar-ai-demo</strong>.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-ink-400">
          <Link href="/" className="transition-colors hover:text-ink-200">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </main>
  )
}
