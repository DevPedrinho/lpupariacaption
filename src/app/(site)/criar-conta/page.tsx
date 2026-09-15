import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SignupForm } from '../conta/ContaForms'
import { getCustomerSession } from '@/lib/customer-auth'

export const metadata: Metadata = {
  title: 'Criar conta',
  description: 'Crie sua conta para enviar a configuração que encontrou e receber o comparativo da UPAR.',
  robots: { index: false },
}

export default async function CriarContaPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  if (await getCustomerSession()) redirect(next || '/comparativo')

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-[1.75rem] leading-tight font-semibold text-white">Criar conta</h1>
          <p className="text-[0.9375rem] text-ink-300">
            É o que permite guardar a conversa e o consultor retomar de onde parou.
          </p>
        </div>

        <div className="rounded-2xl border border-ink-700/70 bg-ink-880/60 p-6 md:p-7">
          <SignupForm next={next} />
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-ink-400">
          Ao criar a conta você concorda com os{' '}
          <Link href="/termos-de-uso" className="underline hover:text-ink-200">
            Termos de Uso
          </Link>{' '}
          e com a{' '}
          <Link href="/politica-de-privacidade" className="underline hover:text-ink-200">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
