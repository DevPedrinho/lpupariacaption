import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { requireCustomer } from '@/lib/customer-auth'
import {
  STATUS_LABEL,
  getCustomerComparison,
  listMessages,
  signedUrl,
} from '@/lib/comparativos'
import { formatDateTime } from '@/lib/format'
import { Responder } from './Responder'

export const metadata: Metadata = {
  title: 'Sua conversa com a UPAR',
  robots: { index: false },
}

function Balao({
  autor,
  quando,
  children,
}: {
  autor: 'cliente' | 'upar'
  quando: string
  children: React.ReactNode
}) {
  const daUpar = autor === 'upar'
  return (
    <div className={daUpar ? 'flex justify-start' : 'flex justify-end'}>
      <div
        className={
          daUpar
            ? 'max-w-[85%] rounded-2xl rounded-tl-sm border border-brand-500/30 bg-brand-500/[0.07] p-4'
            : 'max-w-[85%] rounded-2xl rounded-tr-sm border border-ink-700/70 bg-ink-880/70 p-4'
        }
      >
        <div className="mb-1.5 flex items-center gap-2">
          <span className={daUpar ? 'text-sm font-semibold text-brand-300' : 'text-sm font-semibold text-white'}>
            {daUpar ? 'UPAR' : 'Você'}
          </span>
          <span className="text-xs text-ink-400">{formatDateTime(quando)}</span>
        </div>
        <div className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-ink-200">{children}</div>
      </div>
    </div>
  )
}

export default async function ConversaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireCustomer(`/comparativo/${id}`)

  // A posse é checada na consulta: id de outra pessoa simplesmente não retorna.
  const comparativo = await getCustomerComparison(id, session.id)
  if (!comparativo) notFound()

  const [mensagens, imagens] = await Promise.all([
    listMessages(comparativo.id),
    Promise.all(comparativo.imagePaths.map((path) => signedUrl(path))),
  ])

  return (
    <Section>
      <div className="container-page max-w-3xl">
        <Link
          href="/comparativo"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-300 transition-colors hover:text-white"
        >
          <Icon name="arrowLeft" className="size-4" />
          Voltar
        </Link>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[1.6rem] leading-tight font-semibold text-white">Seu comparativo</h1>
          <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-2xs font-semibold tracking-[0.08em] text-brand-300 uppercase">
            {STATUS_LABEL[comparativo.status]}
          </span>
        </div>

        {/* O envio original, sempre no topo */}
        <div className="mt-7 rounded-2xl border border-ink-700/70 bg-ink-880/60 p-5">
          <h2 className="text-sm font-semibold text-white">O que você enviou</h2>
          <p className="mt-1 text-xs text-ink-400">{formatDateTime(comparativo.createdAt)}</p>

          {comparativo.sourceText && (
            <p className="mt-3.5 text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-ink-200">
              {comparativo.sourceText}
            </p>
          )}

          {imagens.filter(Boolean).length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imagens.map((url, index) =>
                url ? (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {/* Imagem enviada pelo próprio usuário, em URL assinada e
                          temporária — fora do alcance do otimizador do Next. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Print ${index + 1} da configuração enviada`}
                        className="aspect-4/3 w-full rounded-lg border border-ink-700/70 object-cover transition-opacity hover:opacity-85"
                      />
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          )}
        </div>

        {/* A conversa */}
        <div className="mt-8 flex flex-col gap-4">
          {mensagens.length === 0 ? (
            <p className="rounded-xl border border-dashed border-ink-700 bg-ink-900/40 px-5 py-8 text-center text-sm leading-relaxed text-ink-400">
              Um consultor da UPAR está analisando o que você enviou. A resposta aparece aqui — e você recebe
              o contato dele no WhatsApp que cadastrou.
            </p>
          ) : (
            mensagens.map((mensagem) => (
              <Balao key={mensagem.id} autor={mensagem.role} quando={mensagem.createdAt}>
                {mensagem.body}
              </Balao>
            ))
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-ink-700/70 bg-ink-880/60 p-5">
          <h2 className="mb-3 text-sm font-semibold text-white">Responder</h2>
          <Responder comparisonId={comparativo.id} />
        </div>
      </div>
    </Section>
  )
}
