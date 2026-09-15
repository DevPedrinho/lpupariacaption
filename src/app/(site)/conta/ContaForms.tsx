'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { login, signup, type ContaState } from './actions'

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full justify-center" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  )
}

function ErrorBox({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="rounded-lg border border-critical-500/30 bg-critical-500/8 px-4 py-3 text-sm text-critical-500"
    >
      {message}
    </p>
  )
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<ContaState, FormData>(login, {})

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next ?? '/comparativo'} />

      <Field label="E-mail" required error={state.fieldErrors?.email}>
        {(props) => <Input {...props} name="email" type="email" autoComplete="username" required />}
      </Field>

      <Field label="Senha" required error={state.fieldErrors?.password}>
        {(props) => (
          <Input {...props} name="password" type="password" autoComplete="current-password" required />
        )}
      </Field>

      <ErrorBox message={state.error} />
      <SubmitButton label="Entrar" pendingLabel="Entrando…" />

      <p className="text-center text-sm text-ink-400">
        Ainda não tem conta?{' '}
        <Link href="/criar-conta" className="font-medium text-brand-300 hover:text-brand-200">
          Criar agora
        </Link>
      </p>
    </form>
  )
}

export function SignupForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<ContaState, FormData>(signup, {})

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next ?? '/comparativo'} />

      <Field label="Nome completo" required error={state.fieldErrors?.name}>
        {(props) => <Input {...props} name="name" autoComplete="name" required />}
      </Field>

      <Field label="E-mail" required error={state.fieldErrors?.email}>
        {(props) => <Input {...props} name="email" type="email" autoComplete="email" required />}
      </Field>

      <Field
        label="WhatsApp com DDD"
        required
        hint="É por aqui que um consultor fala com você sobre o comparativo."
        error={state.fieldErrors?.whatsapp}
      >
        {(props) => (
          <Input {...props} name="whatsapp" type="tel" autoComplete="tel" required placeholder="(85) 99999-0000" />
        )}
      </Field>

      <Field label="Senha" required hint="Ao menos 8 caracteres." error={state.fieldErrors?.password}>
        {(props) => (
          <Input {...props} name="password" type="password" autoComplete="new-password" required minLength={8} />
        )}
      </Field>

      <ErrorBox message={state.error} />
      <SubmitButton label="Criar conta" pendingLabel="Criando…" />

      <p className="text-center text-sm text-ink-400">
        Já tem conta?{' '}
        <Link href="/entrar" className="font-medium text-brand-300 hover:text-brand-200">
          Entrar
        </Link>
      </p>
    </form>
  )
}
