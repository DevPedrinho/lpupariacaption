'use client'

import { useActionState, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { enviarConfiguracao, type EnvioState } from './actions'

function Enviar() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending} className="justify-center">
      {pending ? 'Enviando…' : 'Enviar para análise'}
      {!pending && <Icon name="arrowRight" />}
    </Button>
  )
}

/**
 * Formulário de envio.
 *
 * São dois caminhos para a mesma coisa, e qualquer um basta: anexar o print ou
 * colar o texto. Exigir os dois criaria atrito num momento em que o visitante
 * ainda está decidindo se vale a pena falar com a gente.
 */
export function NovoComparativo() {
  const [state, formAction] = useActionState<EnvioState, FormData>(enviarConfiguracao, {})
  const [nomes, setNomes] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Anexo */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink-200">Print da configuração</span>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-ink-600 bg-ink-900/50 px-5 py-8 text-center transition-colors hover:border-brand-500/60 hover:bg-ink-880/60">
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
            <Icon name="image" className="size-5" />
          </span>
          <span className="text-[0.9375rem] font-medium text-white">
            Clique para escolher ou arraste as imagens
          </span>
          <span className="text-xs text-ink-400">Até 4 imagens, 8 MB cada</span>
          <input
            ref={inputRef}
            type="file"
            name="prints"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => setNomes(Array.from(event.target.files ?? []).map((f) => f.name))}
          />
        </label>

        {nomes.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {nomes.map((nome) => (
              <li key={nome} className="flex items-center gap-2 text-sm text-ink-300">
                <Icon name="check" className="size-4 shrink-0 text-brand-400" />
                <span className="truncate">{nome}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-ink-700/70" />
        <span className="text-xs tracking-[0.1em] text-ink-500 uppercase">ou</span>
        <span className="h-px flex-1 bg-ink-700/70" />
      </div>

      {/* Texto colado */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sourceText" className="text-sm font-medium text-ink-200">
          Cole a configuração
        </label>
        <textarea
          id="sourceText"
          name="sourceText"
          rows={6}
          placeholder={
            'Cole aqui a ficha técnica que você copiou do anúncio.\n\n' +
            'Ex.: Ryzen 9 7950X, RTX 4090 24GB, 64GB DDR5, SSD 2TB NVMe…'
          }
          className="w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3.5 py-3 text-[0.9375rem] leading-relaxed text-ink-50 placeholder:text-ink-500 transition-colors hover:border-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/35 focus:outline-none"
        />
        <p className="text-xs text-ink-400">
          Se puder, diga também o que você pretende executar na máquina — é o que mais muda a indicação.
        </p>
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-critical-500/30 bg-critical-500/8 px-4 py-3 text-sm text-critical-500"
        >
          {state.error}
        </p>
      )}

      <Enviar />
    </form>
  )
}
