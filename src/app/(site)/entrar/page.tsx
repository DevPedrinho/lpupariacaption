import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginForm } from '../conta/ContaForms'
import { getCustomerSession } from '@/lib/customer-auth'

export const metadata: Metadata = {
  title: 'Entrar na sua conta',
  description: 'Acesse sua conta para acompanhar o comparativo com a equipe da UPAR.',
  robots: { index: false },
}

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  // Quem já está logado não precisa ver o formulário.
  if (await getCustomerSession()) redirect(next || '/comparativo')

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-[1.75rem] leading-tight font-semibold text-white">Entrar</h1>
          <p className="text-[0.9375rem] text-ink-300">
            Acompanhe seus comparativos e continue a conversa de onde parou.
          </p>
        </div>
        <div className="rounded-2xl border border-ink-700/70 bg-ink-880/60 p-6 md:p-7">
          <LoginForm next={next} />
        </div>
      </div>
    </section>
  )
}
