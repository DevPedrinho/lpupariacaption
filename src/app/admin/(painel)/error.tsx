'use client'

import { useEffect } from 'react'

/**
 * Barreira de erro do painel.
 *
 * Sem ela, qualquer falha de leitura vira a página branca de erro do servidor,
 * que não diz o que aconteceu — e o painel lê do Supabase em quase toda tela.
 * A causa mais comum é configuração: chave de serviço errada, RLS recusando ou
 * o projeto do Supabase pausado. Quem está olhando precisa da mensagem, não de
 * "A server error occurred".
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Falha no painel administrativo', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-critical-500/30 bg-critical-500/[0.06] p-6 md:p-8">
        <h1 className="text-xl font-semibold text-white">Esta tela não carregou</h1>

        <p className="mt-2.5 text-sm leading-relaxed text-ink-300">
          O painel não conseguiu ler os dados. Na maioria das vezes é configuração de ambiente, não defeito
          da tela: chave de serviço do Supabase ausente ou incorreta, ou o projeto do banco pausado.
        </p>

        <div className="mt-5 rounded-lg border border-ink-700/70 bg-ink-950/60 p-4">
          <p className="text-2xs font-semibold tracking-[0.1em] text-ink-400 uppercase">Detalhe técnico</p>
          <p className="mt-1.5 font-mono text-xs leading-relaxed break-words text-ink-200">
            {error.message || 'Sem mensagem.'}
          </p>
          {error.digest && <p className="mt-2 font-mono text-2xs text-ink-500">digest: {error.digest}</p>}
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
          >
            Tentar de novo
          </button>
          <a
            href="/admin/login"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-ink-600/70 px-5 text-sm font-medium text-ink-100 transition-colors hover:border-ink-500 hover:text-white"
          >
            Voltar ao login
          </a>
        </div>
      </div>
    </div>
  )
}
