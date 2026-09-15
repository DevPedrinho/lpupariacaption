import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession } from '@/lib/admin-session'
import { AdminHeader, Panel } from '@/components/admin/ui'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { formatDateTime } from '@/lib/format'
import { whatsappUrl } from '@/lib/whatsapp'
import {
  STATUS_LABEL,
  getComparison,
  getCustomer,
  getDraft,
  listMessages,
  signedUrl,
} from '@/lib/comparativos'
import { alterarStatus, regenerarRascunho, responderCliente } from '../actions'

const RASCUNHO_AVISO: Record<string, string> = {
  pendente: 'A análise ainda não foi gerada.',
  indisponivel:
    'A análise por IA não está ligada neste ambiente (falta ANTHROPIC_API_KEY). Escreva a resposta abaixo.',
  erro: 'A análise falhou. Escreva a resposta abaixo ou tente gerar de novo.',
}

export default async function ComparativoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  await requireSession('comparativos')
  const { id } = await params

  const comparativo = await getComparison(id)
  if (!comparativo) notFound()

  const [cliente, mensagens, rascunho, imagens] = await Promise.all([
    getCustomer(comparativo.customerId),
    listMessages(comparativo.id),
    getDraft(comparativo.id),
    Promise.all(comparativo.imagePaths.map((path) => signedUrl(path))),
  ])

  return (
    <>
      <Link
        href="/admin/comparativos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-300 transition-colors hover:text-white"
      >
        <Icon name="arrowLeft" className="size-4" />
        Voltar para a lista
      </Link>

      <AdminHeader
        title={cliente?.name ?? 'Cliente removido'}
        description={`Enviado em ${formatDateTime(comparativo.createdAt)}`}
      />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        {/* ------------------------------ Coluna principal ---------------------- */}
        <div className="flex flex-col gap-5">
          <Panel>
            <h2 className="mb-4 text-base font-semibold text-white">O que o cliente enviou</h2>

            {comparativo.sourceText ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink-200">
                {comparativo.sourceText}
              </p>
            ) : (
              <p className="text-sm text-ink-400">Sem texto — o cliente enviou apenas imagem.</p>
            )}

            {imagens.filter(Boolean).length > 0 && (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {imagens.map((url, index) =>
                  url ? (
                    <li key={url}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {/* URL assinada e temporária: fora do alcance do otimizador. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Print ${index + 1} enviado pelo cliente`}
                          className="aspect-4/3 w-full rounded-lg border border-ink-700/70 object-cover transition-opacity hover:opacity-85"
                        />
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            )}
          </Panel>

          {/* Rascunho da IA + envio. É o mesmo campo: o vendedor edita e manda. */}
          <Panel>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-white">Resposta ao cliente</h2>
              <div className="flex items-center gap-2">
                {rascunho?.status === 'gerado' && (
                  <Badge tone="flux">Rascunho da IA{rascunho.model ? ` · ${rascunho.model}` : ''}</Badge>
                )}
                <form action={regenerarRascunho}>
                  <input type="hidden" name="comparisonId" value={comparativo.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ink-600/70 px-3 py-1.5 text-xs text-ink-200 transition-colors hover:border-ink-500 hover:text-white"
                  >
                    <Icon name="spark" className="size-3.5" />
                    Gerar de novo
                  </button>
                </form>
              </div>
            </div>

            {rascunho && rascunho.status !== 'gerado' && (
              <p className="mb-3 rounded-lg border border-caution-500/30 bg-caution-500/8 px-4 py-3 text-sm text-caution-500">
                {RASCUNHO_AVISO[rascunho.status] ?? 'Rascunho indisponível.'}
                {rascunho.error ? <span className="mt-1 block text-xs opacity-80">{rascunho.error}</span> : null}
              </p>
            )}

            {rascunho?.suggestedSlug && (
              <p className="mb-3 text-sm text-ink-300">
                Configuração sugerida pela IA:{' '}
                <Link
                  href={`/produtos/${rascunho.suggestedSlug}`}
                  target="_blank"
                  className="font-medium text-brand-300 hover:text-brand-200"
                >
                  {rascunho.suggestedSlug}
                </Link>
              </p>
            )}

            <form action={responderCliente} className="flex flex-col gap-3">
              <input type="hidden" name="comparisonId" value={comparativo.id} />
              <label htmlFor="body" className="sr-only">
                Resposta ao cliente
              </label>
              <textarea
                id="body"
                name="body"
                rows={10}
                required
                defaultValue={rascunho?.body ?? ''}
                placeholder="Escreva a resposta que o cliente vai receber…"
                className="w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3.5 py-3 text-sm leading-relaxed text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none"
              />
              <p className="text-xs leading-relaxed text-ink-400">
                O cliente recebe exatamente o texto acima. Confira as especificações antes de enviar — a IA
                pode errar, e o que sai daqui é a palavra da UPAR.
              </p>
              <Button type="submit" size="md" className="self-start">
                Enviar ao cliente
              </Button>
            </form>
          </Panel>

          {/* Histórico */}
          <Panel>
            <h2 className="mb-4 text-base font-semibold text-white">Conversa</h2>
            {mensagens.length === 0 ? (
              <p className="text-sm text-ink-400">Nenhuma mensagem trocada ainda.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {mensagens.map((mensagem) => (
                  <li
                    key={mensagem.id}
                    className={
                      mensagem.role === 'upar'
                        ? 'rounded-xl border border-brand-500/30 bg-brand-500/[0.06] p-4'
                        : 'rounded-xl border border-ink-700/70 bg-ink-900/50 p-4'
                    }
                  >
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {mensagem.role === 'upar' ? mensagem.authorEmail ?? 'UPAR' : cliente?.name ?? 'Cliente'}
                      </span>
                      <span className="text-xs text-ink-400">{formatDateTime(mensagem.createdAt)}</span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink-200">{mensagem.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* ------------------------------ Coluna lateral ------------------------ */}
        <div className="flex flex-col gap-5">
          <Panel>
            <h2 className="mb-4 text-base font-semibold text-white">Contato</h2>
            {cliente ? (
              <dl className="flex flex-col gap-3 text-sm">
                <div>
                  <dt className="text-ink-400">Nome</dt>
                  <dd className="text-white">{cliente.name}</dd>
                </div>
                <div>
                  <dt className="text-ink-400">E-mail</dt>
                  <dd className="break-all text-ink-200">{cliente.email}</dd>
                </div>
                <div>
                  <dt className="text-ink-400">WhatsApp</dt>
                  <dd className="text-ink-200">{cliente.whatsapp}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-ink-400">Cadastro removido.</p>
            )}

            {cliente && (
              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href={whatsappUrl(
                    cliente.whatsapp,
                    `Olá, ${cliente.name.split(' ')[0]}! Aqui é da UPAR. Recebi a configuração que você enviou no site e queria conversar sobre ela.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1FA855] px-4 text-sm font-medium text-white transition-colors hover:bg-[#199247]"
                >
                  <Icon name="whatsapp" className="size-4" />
                  Chamar no WhatsApp
                </a>
                <a
                  href={`tel:+${cliente.whatsapp}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-ink-600/70 px-4 text-sm font-medium text-ink-100 transition-colors hover:border-ink-500 hover:text-white"
                >
                  <Icon name="phone" className="size-4" />
                  Ligar
                </a>
              </div>
            )}
          </Panel>

          <Panel>
            <h2 className="mb-4 text-base font-semibold text-white">Situação</h2>
            <p className="mb-4">
              <Badge tone="brand">{STATUS_LABEL[comparativo.status]}</Badge>
            </p>
            <div className="flex flex-col gap-2">
              {(['em_analise', 'encerrado'] as const).map((status) => (
                <form key={status} action={alterarStatus}>
                  <input type="hidden" name="comparisonId" value={comparativo.id} />
                  <input type="hidden" name="status" value={status} />
                  <button
                    type="submit"
                    disabled={comparativo.status === status}
                    className="w-full rounded-lg border border-ink-600/70 px-3 py-2 text-sm text-ink-200 transition-colors hover:border-ink-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {status === 'em_analise' ? 'Assumir análise' : 'Encerrar'}
                  </button>
                </form>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
