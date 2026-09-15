'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { responder, type EnvioState } from '../actions'

function Enviar() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="md" disabled={pending} className="self-start">
      {pending ? 'Enviando…' : 'Enviar'}
    </Button>
  )
}

export function Responder({ comparisonId }: { comparisonId: string }) {
  const [state, formAction] = useActionState<EnvioState, FormData>(responder, {})

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="comparisonId" value={comparisonId} />
      <label htmlFor="body" className="sr-only">
        Sua mensagem
      </label>
      <textarea
        id="body"
        name="body"
        rows={3}
        required
        placeholder="Escreva sua mensagem…"
        className="w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3.5 py-3 text-[0.9375rem] leading-relaxed text-ink-50 placeholder:text-ink-500 transition-colors hover:border-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/35 focus:outline-none"
      />
      {state.error && (
        <p role="alert" className="text-sm text-critical-500">
          {state.error}
        </p>
      )}
      <Enviar />
    </form>
  )
}
