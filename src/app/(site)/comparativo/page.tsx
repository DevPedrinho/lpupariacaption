import type { Metadata } from 'next'
import Link from 'next/link'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHero } from '@/components/site/PageHero'
import { Section, SectionHeader } from '@/components/ui/Section'
import { getCustomerSession } from '@/lib/customer-auth'
import { STATUS_LABEL, listCustomerComparisons, comparativosDisponiveis } from '@/lib/comparativos'
import { formatDate } from '@/lib/format'
import { NovoComparativo } from './NovoComparativo'

export const metadata: Metadata = {
  title: 'Comparativo: o que você achou × o que a UPAR entrega',
  description:
    'Envie o print do computador que você encontrou em outro site e receba a análise de um consultor da UPAR.',
  alternates: { canonical: '/comparativo' },
}

const PASSOS = [
  { title: 'Você manda a configuração', description: 'Print do anúncio ou o texto colado. Um dos dois basta.' },
  { title: 'A análise é preparada', description: 'A configuração é lida e cruzada com o catálogo da UPAR.' },
  { title: 'Um consultor responde', description: 'Uma pessoa revisa tudo antes de enviar, e continua a conversa com você.' },
]

const GANHOS = [
  'Dimensionado para a sua aplicação, não para um comprador genérico',
  'VRAM conferida contra o que você pretende executar',
  'Conjunto equilibrado: processador, memória e armazenamento acompanhando a placa',
  'Expansão considerada no projeto, não deixada para depois',
  'Montagem e teste sob carga pela equipe',
  'Suporte de quem dimensionou a máquina',
]

// A análise por IA roda dentro da action de envio; 10 s (padrão) não bastam.
export const maxDuration = 60

export default async function ComparativoPage() {
  const session = await getCustomerSession()

  /* ------------------------ Visitante: apresentação ------------------------ */
  if (!session) {
    return (
      <>
        <PageHero
          eyebrow="Comparativo"
          title="Achou um computador em outro site? Manda pra gente."
          description="Um consultor da UPAR analisa a configuração que você encontrou e responde o que entregaríamos no lugar, e por quê."
          breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Comparativo' }]}
        />

        <Section tone="raised">
          <div className="container-page">
            <ol className="grid gap-4 md:grid-cols-3">
              {PASSOS.map((passo, index) => (
                <li
                  key={passo.title}
                  className="flex flex-col gap-3 rounded-2xl border border-ink-700/70 bg-ink-880/60 p-6"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex size-9 items-center justify-center rounded-full bg-brand-500/12 font-display text-sm font-semibold text-brand-300 ring-1 ring-brand-500/25 ring-inset"
                  >
                    {index + 1}
                  </span>
                  <h2 className="text-[1.0625rem] leading-snug font-semibold text-white">{passo.title}</h2>
                  <p className="text-sm leading-relaxed text-ink-300">{passo.description}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 rounded-2xl border border-brand-500/30 bg-ink-880 p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
                <div className="flex flex-col gap-4">
                  <h2 className="text-[1.5rem] leading-tight font-semibold text-white md:text-[1.85rem]">
                    O que entra na análise
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {GANHOS.map((ganho) => (
                      <li key={ganho} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-300">
                        <Icon name="check" className="mt-1 size-4 shrink-0 text-brand-400" />
                        <span>{ganho}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-center gap-4 rounded-xl border border-ink-700/70 bg-ink-900/60 p-6">
                  <h3 className="text-[1.0625rem] font-semibold text-white">
                    Crie uma conta para enviar
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-300">
                    A conta guarda a conversa em um lugar só e permite que o consultor retome de onde parou,
                    em vez de recomeçar a cada mensagem.
                  </p>
                  <div className="mt-1 flex flex-col gap-2.5">
                    <ButtonLink href="/criar-conta" size="lg" className="justify-center">
                      Criar conta e enviar
                      <Icon name="arrowRight" />
                    </ButtonLink>
                    <Link
                      href="/entrar"
                      className="text-center text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
                    >
                      Já tenho conta
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-10 text-center text-sm leading-relaxed text-ink-400">
              Se a máquina que você encontrou resolver o seu caso, vamos dizer isso também.
            </p>
          </div>
        </Section>
      </>
    )
  }

  /* -------------------------- Cliente autenticado -------------------------- */
  const comparativos = await listCustomerComparisons(session.id)

  return (
    <>
      <PageHero
        eyebrow={`Olá, ${session.name.split(' ')[0]}`}
        title="Seus comparativos"
        description="Envie a configuração que você encontrou e acompanhe a resposta do consultor aqui mesmo."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Comparativo' }]}
      />

      <Section>
        <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <SectionHeader title="Enviar uma configuração" />
            <div className="mt-7 rounded-2xl border border-ink-700/70 bg-ink-880/60 p-6 md:p-7">
              {comparativosDisponiveis ? (
                <NovoComparativo />
              ) : (
                <p className="text-sm leading-relaxed text-ink-300">
                  O envio ainda não está configurado neste ambiente. Fale com a UPAR pelo WhatsApp.
                </p>
              )}
            </div>
          </div>

          <div>
            <SectionHeader title="Conversas" />
            <div className="mt-7 flex flex-col gap-3">
              {comparativos.length === 0 ? (
                <p className="rounded-xl border border-dashed border-ink-700 bg-ink-900/40 px-5 py-8 text-center text-sm text-ink-400">
                  Nenhum comparativo ainda. O primeiro aparece aqui assim que você enviar.
                </p>
              ) : (
                comparativos.map((item) => (
                  <Link
                    key={item.id}
                    href={`/comparativo/${item.id}`}
                    className="group flex flex-col gap-2 rounded-xl border border-ink-700/70 bg-ink-880/60 p-5 transition-colors hover:border-brand-500/45 hover:bg-ink-850"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-2xs font-semibold tracking-[0.08em] text-brand-300 uppercase">
                        {STATUS_LABEL[item.status]}
                      </span>
                      <span className="text-xs text-ink-400">{formatDate(item.createdAt)}</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-ink-300">
                      {item.sourceText || `${item.imagePaths.length} imagem(ns) enviada(s)`}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-300">
                      Abrir conversa
                      <Icon
                        name="arrowRight"
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
