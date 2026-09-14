import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 grid-mesh opacity-35" />
      <div className="max-w-lg text-center">
        <p className="text-2xs font-semibold tracking-[0.16em] text-flux-300 uppercase">Erro 404</p>
        <h1 className="mt-4 text-3xl leading-tight font-semibold md:text-4xl">
          Esta página não existe — ou mudou de endereço
        </h1>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-300">
          Se você estava procurando uma configuração específica, o catálogo e o diagnóstico são os caminhos
          mais rápidos para chegar lá.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/catalogo"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-500 px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-brand-400"
          >
            Ver o catálogo
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-ink-600/70 px-5 text-[0.9375rem] font-medium text-ink-100 transition-colors hover:border-ink-500 hover:text-white"
          >
            Voltar para a home
          </Link>
        </div>
      </div>
    </main>
  )
}
