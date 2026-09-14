'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { login, type LoginState } from '../auth-actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Entrando…' : 'Entrar'}
    </Button>
  )
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {})

  return (
    <form action={formAction} className="mt-7 flex flex-col gap-5">
      <input type="hidden" name="next" value={next ?? '/admin'} />

      <Field label="E-mail" required>
        {(props) => (
          <Input {...props} name="email" type="email" autoComplete="username" required placeholder="voce@uparai.com.br" />
        )}
      </Field>

      <Field label="Senha" required>
        {(props) => (
          <Input {...props} name="password" type="password" autoComplete="current-password" required />
        )}
      </Field>

      {state.error && (
        <p className="rounded-lg border border-critical-500/30 bg-critical-500/8 px-4 py-3 text-sm text-critical-500" role="alert">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
