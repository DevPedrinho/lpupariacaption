'use client'

import { useActionState, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { reduzirImagem } from '@/lib/imagem-cliente'
import { enviarConfiguracao, prepararPrint, type EnvioState } from './actions'

const MAX_ARQUIVOS = 4

type Anexo = { nome: string; estado: 'enviando' | 'ok' | 'erro'; path?: string; detalhe?: string }

function Enviar({ bloqueado }: { bloqueado: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending || bloqueado} className="justify-center">
      {pending ? 'Enviando…' : bloqueado ? 'Aguarde as imagens…' : 'Enviar para análise'}
      {!pending && !bloqueado && <Icon name="arrowRight" />}
    </Button>
  )
}

/**
 * Formulário de envio.
 *
 * São dois caminhos para a mesma coisa, e qualquer um basta: anexar o print ou
 * colar o texto. Exigir os dois criaria atrito num momento em que o visitante
 * ainda está decidindo se vale a pena falar com a gente.
 *
 * O print sobe direto do navegador para o Storage assim que é escolhido
 * (reduzido antes, para não demorar); o formulário só envia os caminhos.
 * Passar o arquivo pela action estourava o limite de 1 MB do servidor.
 */
export function NovoComparativo() {
  const [state, formAction] = useActionState<EnvioState, FormData>(enviarConfiguracao, {})
  const [anexos, setAnexos] = useState<Anexo[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const enviando = anexos.some((a) => a.estado === 'enviando')
  const prontos = anexos.filter((a) => a.estado === 'ok' && a.path)

  const atualizar = (indice: number, patch: Partial<Anexo>) =>
    setAnexos((atual) => atual.map((a, i) => (i === indice ? { ...a, ...patch } : a)))

  const escolher = async (files: FileList | null) => {
    const lista = Array.from(files ?? []).filter((f) => f.type.startsWith('image/'))
    if (lista.length === 0) return
    const base = anexos.length
    const aceitos = lista.slice(0, Math.max(0, MAX_ARQUIVOS - base))
    setAnexos((atual) => [...atual, ...aceitos.map((f) => ({ nome: f.name, estado: 'enviando' as const }))])

    await Promise.all(
      aceitos.map(async (file, i) => {
        const indice = base + i
        try {
          const { blob, type } = await reduzirImagem(file)
          const assinatura = await prepararPrint(type)
          if ('error' in assinatura) {
            atualizar(indice, { estado: 'erro', detalhe: assinatura.error })
            return
          }
          const resposta = await fetch(assinatura.signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': type, 'x-upsert': 'false' },
            body: blob,
          })
          if (!resposta.ok) {
            atualizar(indice, { estado: 'erro', detalhe: 'não foi possível enviar; tente de novo' })
            return
          }
          atualizar(indice, { estado: 'ok', path: assinatura.path })
        } catch {
          atualizar(indice, { estado: 'erro', detalhe: 'falha de conexão' })
        }
      }),
    )
    if (inputRef.current) inputRef.current.value = ''
  }

  const remover = (indice: number) => setAnexos((atual) => atual.filter((_, i) => i !== indice))

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {prontos.map((a) => (
        <input key={a.path} type="hidden" name="imagePaths" value={a.path} />
      ))}

      {/* Anexo */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink-200">Print da configuração</span>
        <label
          className={cn(
            'flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-ink-600 bg-ink-900/50 px-5 py-8 text-center transition-colors',
            anexos.length >= MAX_ARQUIVOS ? 'opacity-50' : 'cursor-pointer hover:border-brand-500/60 hover:bg-ink-880/60',
          )}
        >
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
            <Icon name="image" className="size-5" />
          </span>
          <span className="text-[0.9375rem] font-medium text-white">
            Clique para escolher ou arraste as imagens
          </span>
          <span className="text-xs text-ink-400">Até {MAX_ARQUIVOS} imagens · print, foto ou captura de tela</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={anexos.length >= MAX_ARQUIVOS}
            className="sr-only"
            onChange={(event) => void escolher(event.target.files)}
          />
        </label>

        {anexos.length > 0 && (
          <ul className="flex flex-col gap-1.5" aria-live="polite">
            {anexos.map((a, i) => (
              <li key={`${a.nome}-${i}`} className="flex items-center gap-2 text-sm">
                {a.estado === 'ok' ? (
                  <Icon name="check" className="size-4 shrink-0 text-brand-400" />
                ) : a.estado === 'erro' ? (
                  <Icon name="close" className="size-4 shrink-0 text-critical-500" />
                ) : (
                  <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-ink-600 border-t-brand-400" />
                )}
                <span className={cn('truncate', a.estado === 'erro' ? 'text-critical-500' : 'text-ink-300')}>{a.nome}</span>
                <span className="shrink-0 text-xs text-ink-500">
                  {a.estado === 'enviando' ? 'enviando…' : a.estado === 'ok' ? 'pronto' : a.detalhe}
                </span>
                {a.estado !== 'enviando' && (
                  <button
                    type="button"
                    onClick={() => remover(i)}
                    className="ml-auto text-xs text-ink-400 underline underline-offset-2 hover:text-white"
                  >
                    remover
                  </button>
                )}
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
          maxLength={6000}
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

      <Enviar bloqueado={enviando} />
    </form>
  )
}
