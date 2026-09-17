'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type Enviado = { src: string; alt: string }
type Item = { nome: string; estado: 'preparando' | 'enviando' | 'ok' | 'erro'; detalhe?: string }

const LADO_MAXIMO = 2000
const QUALIDADE = 0.86

/**
 * Reduz a foto no próprio navegador antes de enviar.
 *
 * Foto de celular tem 4000+ px e 5–10 MB; o site nunca mostra acima de
 * ~1400 px. Reamostrar para 2000 px no lado maior e recodificar em JPEG
 * derruba o tamanho para algumas centenas de KB — é o que faz o envio
 * levar segundos em vez de minutos. PNG pequeno e GIF passam intactos.
 */
async function reduzir(file: File): Promise<{ blob: Blob; type: string }> {
  const intacto = { blob: file, type: file.type }
  if (file.type === 'image/gif' || file.size < 400 * 1024) return intacto
  try {
    const bitmap = await createImageBitmap(file)
    const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height))
    const largura = Math.round(bitmap.width * escala)
    const altura = Math.round(bitmap.height * escala)
    const canvas = document.createElement('canvas')
    canvas.width = largura
    canvas.height = altura
    const ctx = canvas.getContext('2d')
    if (!ctx) return intacto
    ctx.drawImage(bitmap, 0, 0, largura, altura)
    bitmap.close()
    // PNG com transparência continua PNG; o resto vira JPEG.
    const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALIDADE))
    if (!blob || blob.size >= file.size) return intacto
    return { blob, type }
  } catch {
    return intacto
  }
}

export function Uploader({
  prefix,
  bucket,
  accept,
  disponivel,
  pedirLegenda = false,
  legendaPadrao = '',
  preparar,
  concluir,
}: {
  prefix: string
  bucket: 'produtos' | 'conteudos'
  accept: string
  disponivel: boolean
  pedirLegenda?: boolean
  legendaPadrao?: string
  /** Server action: assina a URL de envio de um arquivo. */
  preparar: (bucket: 'produtos' | 'conteudos', prefix: string, contentType: string) => Promise<{ signedUrl: string; publicUrl: string } | { error: string }>
  /** Server action: registra o que subiu (ou só revalida). */
  concluir: (prefix: string, enviados: Enviado[]) => Promise<{ error?: string }>
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [alt, setAlt] = useState('')
  const [itens, setItens] = useState<Item[]>([])
  const [ocupado, setOcupado] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  const atualizar = (indice: number, patch: Partial<Item>) =>
    setItens((atual) => atual.map((item, i) => (i === indice ? { ...item, ...patch } : item)))

  const enviar = async (files: FileList | null) => {
    const lista = Array.from(files ?? []).slice(0, 10)
    if (lista.length === 0) return
    setOcupado(true)
    setAviso(null)
    setItens(lista.map((file) => ({ nome: file.name, estado: 'preparando' })))

    const enviados: Enviado[] = []
    // Até três em paralelo: aproveita a banda sem abrir dez conexões.
    let cursor = 0
    const trabalhador = async () => {
      while (cursor < lista.length) {
        const indice = cursor++
        const file = lista[indice]
        try {
          const { blob, type } = await reduzir(file)
          const assinatura = await preparar(bucket, prefix, type)
          if ('error' in assinatura) {
            atualizar(indice, { estado: 'erro', detalhe: assinatura.error })
            continue
          }
          atualizar(indice, { estado: 'enviando', detalhe: `${(blob.size / 1024).toFixed(0)} KB` })
          const resposta = await fetch(assinatura.signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': type, 'x-upsert': 'false' },
            body: blob,
          })
          if (!resposta.ok) {
            atualizar(indice, { estado: 'erro', detalhe: `o servidor de arquivos recusou (${resposta.status})` })
            continue
          }
          enviados.push({ src: assinatura.publicUrl, alt: alt.trim() || legendaPadrao })
          atualizar(indice, { estado: 'ok' })
        } catch (erro) {
          atualizar(indice, { estado: 'erro', detalhe: erro instanceof Error ? erro.message : 'falha de conexão' })
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(3, lista.length) }, trabalhador))

    if (enviados.length > 0) {
      const resultado = await concluir(prefix, enviados)
      if (resultado.error) setAviso(resultado.error)
      router.refresh()
    }
    setOcupado(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <label htmlFor={`upload-${bucket}`} className="mb-1.5 block text-xs font-medium text-ink-300">
            Enviar fotos <span className="text-ink-500">(várias de uma vez; são reduzidas antes de subir)</span>
          </label>
          <input
            ref={inputRef}
            id={`upload-${bucket}`}
            type="file"
            accept={accept}
            multiple
            disabled={!disponivel || ocupado}
            onChange={(event) => void enviar(event.target.files)}
            className="block w-full text-sm text-ink-300 file:mr-3 file:rounded-md file:border-0 file:bg-brand-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink-950 hover:file:bg-brand-400 disabled:opacity-50"
          />
        </div>
        {pedirLegenda && (
          <div className="md:w-72">
            <label htmlFor={`alt-${bucket}`} className="mb-1.5 block text-xs font-medium text-ink-300">
              Legenda <span className="text-ink-500">(opcional)</span>
            </label>
            <input
              id={`alt-${bucket}`}
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              maxLength={160}
              placeholder={legendaPadrao}
              className="h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {!disponivel && (
        <p className="text-xs text-caution-500">
          O envio de arquivo precisa da SUPABASE_SERVICE_ROLE_KEY neste ambiente.
        </p>
      )}

      {itens.length > 0 && (
        <ul className="flex flex-col gap-1.5 text-sm" aria-live="polite">
          {itens.map((item, i) => (
            <li key={`${item.nome}-${i}`} className="flex items-center gap-2">
              {item.estado === 'ok' ? (
                <Icon name="check" className="size-4 shrink-0 text-brand-300" />
              ) : item.estado === 'erro' ? (
                <Icon name="close" className="size-4 shrink-0 text-critical-500" />
              ) : (
                <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-ink-600 border-t-brand-400" />
              )}
              <span className={cn('truncate', item.estado === 'erro' ? 'text-critical-500' : 'text-ink-200')}>{item.nome}</span>
              <span className="shrink-0 text-xs text-ink-500">
                {item.estado === 'preparando' && 'reduzindo…'}
                {item.estado === 'enviando' && `enviando ${item.detalhe ?? ''}`}
                {item.estado === 'ok' && 'pronto'}
                {item.estado === 'erro' && (item.detalhe ?? 'falhou')}
              </span>
            </li>
          ))}
        </ul>
      )}

      {aviso && <p className="text-sm text-critical-500">{aviso}</p>}
    </div>
  )
}
